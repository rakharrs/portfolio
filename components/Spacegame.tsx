"use client";
import { OrthographicCamera, Stars, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import Thruster from "./Thruster";

function Spaceship() {
    const gltf = useGLTF("/models/spaceship2.glb");
    const scene = gltf.scene;

    // Physics body ref
    const rb = useRef(null);

    const rotationEuler = new THREE.Euler(0, 0, 0, "XYZ");
    const rotationQuaternion = new THREE.Quaternion();

    const previousXRef = useRef(0);
    const bankRef = useRef(0); // smoothed banking (tilt) around Z

    // to manage barrel roll effect
    const isRollingRef = useRef(false);
    const rollElapsedRef = useRef(0);
    const rollDirectionRef = useRef(1); // +1 = right, -1 = left

    function easeInOutQuad(t: number) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    useFrame((state, delta) => {
        if (!rb.current) return;

        const targetX = (state.pointer.x * state.viewport.width) / 2;
        const currentTranslation = rb.current.translation();

        const smoothX = THREE.MathUtils.lerp(currentTranslation.x, targetX, 0.1);

        // direction vector
        const dx = targetX - smoothX;

        // yaw angle (angle entre le spaceship et targetX)
        const yaw = THREE.MathUtils.clamp(dx * 0.15, -0.8, 0.8);

        // Use smoothed X so speed matches what we see visually
        const previousX = previousXRef.current;
        const vx = (smoothX - previousX) / Math.max(delta, 0.0001); // avoid div by 0
        previousXRef.current = smoothX;

        // Bank / tilt based on speed
        const maxBank = 0.6; // max angle - rad
        const bankFromVelocity = THREE.MathUtils.clamp(-vx * 0.15, -maxBank, maxBank);

        // Smooth the bank to avoid jitter
        const smoothedBank = THREE.MathUtils.lerp(bankRef.current, bankFromVelocity, 0.15);
        bankRef.current = smoothedBank;

        const rollTriggerSpeed = 50; // higher = harder to trigger roll
        const rollDuration = 0.6;   // seconds

        if (!isRollingRef.current && Math.abs(vx) > rollTriggerSpeed) {
            isRollingRef.current = true;
            rollElapsedRef.current = 0;
            rollDirectionRef.current = vx > 0 ? 1 : -1; // right vs left roll
        }

        let extraRollZ = 0;

        // barrel roll animation
        if (isRollingRef.current) {
            rollElapsedRef.current += delta;
            const t = Math.min(rollElapsedRef.current / rollDuration, 1);
            const easedT = easeInOutQuad(t);

            // Full 360° roll around forward axis
            extraRollZ = rollDirectionRef.current * easedT * Math.PI * 2;

            if (t >= 1) {
                isRollingRef.current = false;
                rollElapsedRef.current = 0;
            }
        }

    
        // Small bobbing on Y and tiny wobble on pitch/roll when idle
        const time = state.clock.getElapsedTime();
        // (sin(time*i) * o) with i as the speed freq and o the intensity of the rotation
        const idleBob = Math.sin(time * 2) * 0.15 ;        // up/down  
        const idlePitch = Math.sin(time * 1.3) * 0.05 ;    // nose up/down
        const idleRoll = Math.sin(time * 1.7) * 0.1 ;     // small roll


        rb.current.setNextKinematicTranslation({
            x: smoothX,
            y: -6 + idleBob,
            z: 0,
        });

        // orientation + bank + barrel roll
        rotationEuler.set(
            idlePitch,
            -smoothedBank + 0 + idleRoll,
            -yaw,
        );

        rotationQuaternion.setFromEuler(rotationEuler);
        rb.current.setNextKinematicRotation(rotationQuaternion);
    });

    return (
        <RigidBody
            ref={rb}
            type="kinematicPosition"
            position={[0, -6, 0]}
            colliders="hull"
            lockRotations
        >
            <primitive object={scene} scale={1.2} rotation={[1.8, Math.PI, 0]} />
            <Thruster position={[0, -1.6, 0]} scale={1} />
        </RigidBody>
    );
}

export function TestSpaceGame() {
    return (
        <div className="w-full h-screen bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]">
            <Canvas shadows>
                <OrthographicCamera
                    makeDefault
                    position={[0, 0, 10]}
                    zoom={50}
                    castShadow
                />
                <ambientLight intensity={0.7} />
                <directionalLight position={[0, 0, 1]} intensity={1} castShadow />

                <Physics gravity={[0, 0, 0]} debug={false}>
                    <Suspense fallback={null}>
                        <Spaceship />
                    </Suspense>
                </Physics>

                <Stars
                    radius={100}
                    depth={10}
                    count={1000}
                    factor={10}
                    saturation={10}
                    fade
                    speed={2}
                />
            </Canvas>
        </div>
    );
}
