"use client";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Thruster from "./Thruster";
import Beam from "./CannonBeam";


export default function Spaceship({ gameOver, pause, hit }: { gameOver: boolean, pause: boolean, hit: boolean }) {
    const gltf = useGLTF("/models/spaceship.glb");
    const scene = gltf.scene;
    const rb = useRef<RapierRigidBody>(null);

    // Movement Refs
    const previousXRef = useRef(0);
    const bankRef = useRef(0);
    const isRollingRef = useRef(false);
    const rollElapsedRef = useRef(0);
    const rollDirectionRef = useRef(1);

    const rotationEuler = new THREE.Euler(0, 0, 0, "XYZ");
    const rotationQuaternion = new THREE.Quaternion();

    // Fly-away state (when hit)
    const hasStartedFlyAway = useRef(false);
    const flyVel = useRef(new THREE.Vector3());
    const flyRotVel = useRef(new THREE.Vector3());

    // --- SHOOTING LOGIC STATE ---
    const [beams, setBeams] = useState<{ id: number; position: [number, number, number] }[]>([]);
    const beamIdCounter = useRef(0);

    // Helper to remove beam from state
    const removeBeam = (id: number) => {
        setBeams((prev) => prev.filter((b) => b.id !== id));
    };

    function easeInOutQuad(t: number) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // LISTENER: CLICK TO SHOOT
    useEffect(() => {
        const handleShoot = () => {
            if (gameOver || pause || hit || !rb.current) return;

            const shipPos = rb.current.translation();

            // Offset for left and right wings (approximate based on your model scale)
            const wingOffset = 0.6;
            const startY = shipPos.y;
            const startZ = shipPos.z; // -0.5 to spawn slightly behind nose?

            const leftBeam = {
                id: beamIdCounter.current++,
                position: [shipPos.x - wingOffset, startY, startZ] as [number, number, number],
            };

            const rightBeam = {
                id: beamIdCounter.current++,
                position: [shipPos.x + wingOffset, startY, startZ] as [number, number, number],
            };

            setBeams((prev) => [...prev, leftBeam, rightBeam]);
        };

        window.addEventListener("pointerdown", handleShoot);
        return () => window.removeEventListener("pointerdown", handleShoot);
    }, [gameOver, pause, hit]);


    useFrame((state, delta) => {
        if (!rb.current) return;
        const currentTranslation = rb.current.translation();

        // --- GAME OVER / HIT LOGIC ---
        if (hit) {
            if (!hasStartedFlyAway.current) {
                hasStartedFlyAway.current = true;
                const dir = currentTranslation.x >= 0 ? 1 : -1;
                flyVel.current.set(5 * dir, 10, -5);
                flyRotVel.current.set(2, 4 * dir, 1);
            }

            flyVel.current.y -= 15 * delta;

            const newX = currentTranslation.x + flyVel.current.x * delta;
            const newY = currentTranslation.y + flyVel.current.y * delta;
            const newZ = currentTranslation.z + flyVel.current.z * delta;

            rb.current.setNextKinematicTranslation({ x: newX, y: newY, z: newZ });

            rotationEuler.set(
                rotationEuler.x + flyRotVel.current.x * delta,
                rotationEuler.y + flyRotVel.current.y * delta,
                rotationEuler.z + flyRotVel.current.z * delta
            );
            rotationQuaternion.setFromEuler(rotationEuler);
            rb.current.setNextKinematicRotation(rotationQuaternion);

            return;
        }

        if (gameOver || pause) return;

        // --- NORMAL FLIGHT LOGIC ---
        const targetX = (state.pointer.x * state.viewport.width) / 2;
        const smoothX = THREE.MathUtils.lerp(currentTranslation.x, targetX, 0.1);

        // Velocity & Tilt
        const dx = targetX - smoothX;
        const yaw = THREE.MathUtils.clamp(dx * 0.15, -0.8, 0.8);
        const previousX = previousXRef.current;
        const vx = (smoothX - previousX) / Math.max(delta, 0.0001);
        previousXRef.current = smoothX;

        // Banking
        const maxBank = 0.6;
        const bankFromVelocity = THREE.MathUtils.clamp(-vx * 0.15, -maxBank, maxBank);
        const smoothedBank = THREE.MathUtils.lerp(bankRef.current, bankFromVelocity, 0.15);
        bankRef.current = smoothedBank;

        // Barrel Roll Logic
        const rollTriggerSpeed = 50;
        const rollDuration = 0.6;

        if (!isRollingRef.current && Math.abs(vx) > rollTriggerSpeed) {
            isRollingRef.current = true;
            rollElapsedRef.current = 0;
            rollDirectionRef.current = vx > 0 ? 1 : -1;
        }

        let extraRollZ = 0;
        if (isRollingRef.current) {
            rollElapsedRef.current += delta;
            const t = Math.min(rollElapsedRef.current / rollDuration, 1);
            const easedT = easeInOutQuad(t);
            extraRollZ = rollDirectionRef.current * easedT * Math.PI * 2;
            if (t >= 1) {
                isRollingRef.current = false;
                rollElapsedRef.current = 0;
            }
        }

        // Idle Animations
        const time = state.clock.getElapsedTime();
        const idleBob = Math.sin(time * 2) * 0.15;
        const idlePitch = Math.sin(time * 1.3) * 0.05;
        const idleRoll = Math.sin(time * 1.7) * 0.1;

        // Apply Position
        rb.current.setNextKinematicTranslation({
            x: smoothX,
            y: -6 + idleBob,
            z: 0,
        });

        // Apply Rotation
        rotationEuler.set(
            idlePitch,
            -smoothedBank + extraRollZ + idleRoll,
            -yaw,
        );
        rotationQuaternion.setFromEuler(rotationEuler);
        rb.current.setNextKinematicRotation(rotationQuaternion);
    });

    return (
        <>
            <RigidBody
                ref={rb}
                name="spaceship"
                type="kinematicPosition"
                position={[0, -6, 0]}
                colliders="hull"
            >
                <primitive object={scene} scale={1.2} rotation={[1.8, Math.PI, 0]} />
                <Thruster position={[0, -1.6, 0]} scale={1} />
            </RigidBody>

            {/* Render Active Beams */}
            {beams.map((beam) => (
                <Beam
                    key={beam.id}
                    id={beam.id}
                    position={beam.position}
                    onRemove={removeBeam}
                />
            ))}
        </>
    );
}