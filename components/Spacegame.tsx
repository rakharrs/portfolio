"use client";
import { OrthographicCamera, Stars, useGLTF, Float } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody, RapierRigidBody } from "@react-three/rapier";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import Thruster from "./Thruster";
import { GameLoader } from "@/app/spaceship/GameLoader";
import { Button } from "./ui/button";

useGLTF.preload("/models/spaceship2.glb");
type Vec3 = [number, number, number];
interface MeteorProps {
    id: string;
    position: Vec3;
    scale: number;
    speed: number;
    onHit: () => void;
    onDespawn: (id: string) => void;
}

interface MeteorData {
    id: string;
    x: number;
    scale: number;
    speed: number;
}

function Meteor({ id, position, scale, speed, onHit, onDespawn }: MeteorProps) {
    const rigidBody = useRef<RapierRigidBody>(null);

    useFrame((state, delta) => {
        if (!rigidBody.current) return;

        // Check if off-screen (despawn)
        // Since camera is at 0,0,10 and zooming, let's assume -15 is well below screen
        const currentPos = rigidBody.current.translation();
        if (currentPos.y < -15) {
            onDespawn(id);
        }

    });

    return (
        <RigidBody
            ref={rigidBody}
            position={position}
            // KinematicVelocity allows us to set constant speed, 
            type="kinematicVelocity"
            linearVelocity={[0, -speed, 0]}
            colliders="cuboid"
            // Important: Detect collision with the spaceship
            onCollisionEnter={({ other }) => {
                onHit();

            }}
        >
            <Float speed={0} rotationIntensity={0} floatIntensity={0}>
                <mesh scale={scale}>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#555" flatShading={false} />
                </mesh>
            </Float>
        </RigidBody>
    );
}

function Spaceship({ gameOver }: { gameOver: boolean }) {
    const gltf = useGLTF("/models/spaceship2.glb");
    const scene = gltf.scene;
    const rb = useRef<RapierRigidBody>(null);

    const previousXRef = useRef(0);
    const bankRef = useRef(0);
    const isRollingRef = useRef(false);
    const rollElapsedRef = useRef(0);
    const rollDirectionRef = useRef(1);

    const rotationEuler = new THREE.Euler(0, 0, 0, "XYZ");
    const rotationQuaternion = new THREE.Quaternion();

    function easeInOutQuad(t: number) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    useFrame((state, delta) => {
        if (!rb.current) return;

        // FREEZE CONTROLS IF GAME OVER
        if (gameOver) return;

        const targetX = (state.pointer.x * state.viewport.width) / 2;
        const currentTranslation = rb.current.translation();
        const smoothX = THREE.MathUtils.lerp(currentTranslation.x, targetX, 0.1);

        // Calculate velocity and tilt
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
        <RigidBody
            ref={rb}
            name="spaceship"
            type="kinematicPosition"
            position={[0, -6, 0]}
            colliders="cuboid"
        >
            <primitive object={scene} scale={1.2} rotation={[1.8, Math.PI, 0]} />
            <Thruster position={[0, -1.6, 0]} scale={1} />
        </RigidBody>
    );
}

function MeteorController({ setGameOver, gameOver }: { setGameOver: (value: boolean) => void; gameOver: boolean }) {
    const { viewport } = useThree();
    const [meteors, setMeteors] = useState<MeteorData[]>([]);
    const lastSpawnTime = useRef(0);

    // Seconds between spawns
    const spawnRate = 1.0;

    useFrame((state) => {
        if (gameOver) return;

        const time = state.clock.getElapsedTime();

        // Spawn logic
        if (time - lastSpawnTime.current > spawnRate) {
            lastSpawnTime.current = time;

            // Random attributes
            const id = Math.random().toString();
            const x = (Math.random() - 0.5) * viewport.width; // Span full width
            const scale = 0.5 + Math.random() * 1.5; // Random size 0.5 to 2.0
            const speed = 2 + Math.random() * 5; // Random speed

            setMeteors((prev) => [
                ...prev,
                { id, x, scale, speed }
            ]);
        }
    });


    const removeMeteor = (id: string) => {
        setMeteors((prev) => prev.filter((m) => m.id !== id));
    };

    return (
        <>
            {meteors.map((meteor) => (
                <Meteor
                    key={meteor.id}
                    id={meteor.id}
                    position={[meteor.x, 10, 0]} // Start above screen
                    scale={meteor.scale}
                    speed={meteor.speed}
                    onDespawn={removeMeteor}
                    onHit={() => setGameOver(true)}
                />
            ))}
        </>
    );
}

// game over overlay
function GameOverOverlay({ onRestart }: { onRestart: () => void }) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 text-white font-bold">
            <h1 className="text-6xl mb-4 text-red-500">GAME OVER</h1>
            <button
                onClick={onRestart}
                className="px-6 py-3 bg-white text-black rounded hover:bg-gray-300 transition"
            >
                Restart
            </button>
        </div>
    );
}

export function TestSpaceGame() {
    const [gameOver, setGameOver] = useState(false);

    const handleRestart = () => {
        window.location.reload();
    };

    return (
        <div className="w-full h-screen bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]">

            {gameOver && <GameOverOverlay onRestart={handleRestart} />}
            <GameLoader />
            <Canvas shadows>
                <Suspense fallback={null}>
                    <OrthographicCamera
                        makeDefault
                        position={[0, 0, 10]}
                        zoom={50}
                        castShadow
                    />
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[0, 0, 1]} intensity={1} castShadow />

                    <Stars
                        radius={100}
                        depth={10}
                        count={1000}
                        factor={10}
                        saturation={10}
                        fade
                        speed={2}
                    />

                    <Physics gravity={[0, 0, 0]} debug={true}>


                        <Spaceship gameOver={gameOver} />

                        <MeteorController
                            gameOver={gameOver}
                            setGameOver={setGameOver}
                        />

                    </Physics>
                </Suspense>
            </Canvas>

        </div>
    );
}