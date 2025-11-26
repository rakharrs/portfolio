"use client";
import { OrthographicCamera, Stars, useGLTF, Float, Stats } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody, RapierRigidBody } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Thruster from "./Thruster";
import { GameLoader } from "@/app/spaceship/GameLoader";
import { cn } from "@/lib/utils";
import ShakeCamera from "./effects/CameraShake";

useGLTF.preload("/models/spaceship2.glb");
type Vec3 = [number, number, number];
interface MeteorProps {
    id: string;
    position: Vec3;
    scale: number;
    speed: number;
    pause: boolean;
    gameOver: boolean;
    onHit: () => void;
    onDespawn: (id: string) => void;
}

interface MeteorData {
    id: string;
    x: number;
    scale: number;
    speed: number;
}

function Meteor({ id, position, scale, speed, pause, gameOver, onHit, onDespawn }: MeteorProps) {
    const rigidBody = useRef<RapierRigidBody>(null);

    useFrame((state, delta) => {
        if (!rigidBody.current || pause) return;
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
            type="dynamic"
            linearVelocity={[0, pause || gameOver ? 0 : -speed, 0]}
            colliders="hull"
            // Important: Detect collision with the spaceship
            onCollisionEnter={({ other }) => {
                if (other.rigidBodyObject?.name === "spaceship") {
                    onHit();
                }
            }}
        >
            <Float speed={0} rotationIntensity={0} floatIntensity={0}>
                <mesh scale={scale}>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#555" flatShading={false} />
                </mesh>
            </Float>
        </RigidBody >
    );
}

function Spaceship({ gameOver, pause, hit }: { gameOver: boolean, pause: boolean, hit: boolean }) {
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

    // fly-away state (when hit)
    const hasStartedFlyAway = useRef(false);
    const flyVel = useRef(new THREE.Vector3());
    const flyRotVel = useRef(new THREE.Vector3());

    function easeInOutQuad(t: number) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    useFrame((state, delta) => {
        if (!rb.current) return;
        const currentTranslation = rb.current.translation();

        if (hit) {
            // init once
            if (!hasStartedFlyAway.current) {
                hasStartedFlyAway.current = true;

                // give it some initial velocity & spin
                const dir = currentTranslation.x >= 0 ? 1 : -1;
                flyVel.current.set(5 * dir, 10, -5);            // sideways + up + into screen
                flyRotVel.current.set(2, 4 * dir, 1);          // rotation speed
            }

            // fake gravity
            flyVel.current.y -= 15 * delta;

            const newX = currentTranslation.x + flyVel.current.x * delta;
            const newY = currentTranslation.y + flyVel.current.y * delta;
            const newZ = currentTranslation.z + flyVel.current.z * delta;

            rb.current.setNextKinematicTranslation({ x: newX, y: newY, z: newZ });

            // spin
            rotationEuler.set(
                rotationEuler.x + flyRotVel.current.x * delta,
                rotationEuler.y + flyRotVel.current.y * delta,
                rotationEuler.z + flyRotVel.current.z * delta
            );
            rotationQuaternion.setFromEuler(rotationEuler);
            rb.current.setNextKinematicRotation(rotationQuaternion);

            return; // stop normal control
        }
        // FREEZE CONTROLS IF GAME OVER OR PAUSED
        if (gameOver || pause) return;




        const targetX = (state.pointer.x * state.viewport.width) / 2;
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
            colliders="hull"
        >
            <primitive object={scene} scale={1.2} rotation={[1.8, Math.PI, 0]} />
            <Thruster position={[0, -1.6, 0]} scale={1} />
        </RigidBody>
    );
}

function MeteorController({ setGameOver, gameOver, pause, onShipHit, setScore, score }: { setGameOver: (value: boolean) => void; gameOver: boolean; pause: boolean; onShipHit: () => void; setScore: (value: number) => void; score: number }) {
    const { viewport } = useThree();
    const [meteors, setMeteors] = useState<MeteorData[]>([]);
    const lastSpawnTime = useRef(0);

    // Seconds between spawns
    const spawnRate = 0.4;

    useFrame((state) => {
        if (gameOver || pause) return;

        const time = state.clock.getElapsedTime();

        // Spawn logic
        if (time - lastSpawnTime.current > spawnRate) {
            lastSpawnTime.current = time;

            // Random attributes
            const id = Math.random().toString();
            const x = (Math.random() - 0.5) * viewport.width; // Span full width
            const scale = 0.5 + Math.random() * 1.5; // Random size 0.5 to 2.0
            const speed = 2 + Math.random() * (score + 1); // Random speed

            setMeteors((prev) => [
                ...prev,
                { id, x, scale, speed }
            ]);
        }
    });


    const removeMeteor = (id: string) => {
        setMeteors((prev) => prev.filter((m) => m.id !== id));
        setScore(score + 1);
    };

    return (
        <>
            {meteors.map((meteor) => (
                <Meteor
                    pause={pause}
                    gameOver={gameOver}
                    key={meteor.id}
                    id={meteor.id}
                    position={[meteor.x, 10, 0]} // Start above screen
                    scale={meteor.scale}
                    speed={meteor.speed}
                    onDespawn={removeMeteor}
                    onHit={onShipHit}
                />
            ))}
        </>
    );
}

// game over overlay

function GameOverOverlay({ onRestart }: { onRestart: () => void }) {
    return (
        <div className="font-departure absolute inset-0 flex flex-col items-center justify-center bg-black/30 z-10 text-white font-bold">
            <h1 className="text-6xl mb-4 text-red-500">GAME OVER</h1>

            <div className="flex gap-4">
                <button
                    onClick={onRestart}
                    className="px-6 py-3 cursor-none bg-white text-black rounded hover:bg-gray-300 transition"
                >
                    Restart
                </button>

                <button
                    onClick={() => window.location.href = "/"}
                    className="px-6 py-3 cursor-none bg-red-600 text-white rounded hover:bg-red-500 transition"
                >
                    Exit
                </button>
            </div>

        </div>
    );
}

function GamePauseOverlay({ onResume }: { onResume: () => void }) {
    return (
        <div className="font-departure 
        absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 text-white font-bold">
            <h1 className="text-6xl mb-4 text-yellow-300">PAUSED</h1>

            <div className="flex gap-4">
                <button
                    onClick={onResume}
                    className={cn(["cursor-none px-6 py-3 bg-white text-black rounded hover:bg-gray-300 transition"])}
                >
                    Resume
                </button>
                <button
                    onClick={() => window.location.href = "/"}
                    className="px-6 py-3 cursor-none bg-red-600 text-white rounded hover:bg-red-500 transition"
                >
                    Quit
                </button>
            </div>
        </div>
    );
}

export function TestSpaceGame() {
    const [gameOver, setGameOver] = useState(false);
    const [pause, setPause] = useState(false);
    const [shipHit, setShipHit] = useState(false);
    const [score, setScore] = useState(0);

    const handleRestart = () => {
        window.location.reload();
    };

    const handleResume = () => {
        setPause(false);
    }

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "p") setPause((prev) => !prev);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    })

    return (
        <>
            <div className="absolute right-0 top-2 z-20 p-4 select-none">
                <span className="font-departure text-white text-sm opacity-80">
                    Score: {score}
                </span>
            </div>
            <div className="w-full h-screen bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]">

                {gameOver && <GameOverOverlay onRestart={handleRestart} />}
                {pause && <GamePauseOverlay onResume={handleResume} />}

                <GameLoader />
                <Canvas shadows>
                    <Suspense fallback={null}>
                        <OrthographicCamera
                            makeDefault
                            position={[0, 0, 10]}
                            zoom={50}
                            castShadow
                        />
                        <ShakeCamera active={gameOver} />
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

                        <Physics gravity={[0, 0, 0]} debug={false}>


                            <Spaceship gameOver={gameOver} pause={pause} hit={shipHit} />

                            <MeteorController
                                gameOver={gameOver}
                                setGameOver={setGameOver}
                                pause={pause}
                                setScore={setScore}
                                score={score}
                                onShipHit={() => {
                                    setShipHit(true);
                                    setGameOver(true);
                                }}
                            />

                        </Physics>
                    </Suspense>
                </Canvas>

            </div>
        </>
    );
}