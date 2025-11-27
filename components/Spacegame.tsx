"use client";
import { OrthographicCamera, Stars, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useState } from "react";
import { GameLoader } from "@/app/spaceship/GameLoader";
import { cn } from "@/lib/utils";
import ShakeCamera from "./effects/CameraShake";
import Spaceship from "./spacegame/entity/Spaceship";
import MeteorController from "./spacegame/MeteorController";

useGLTF.preload("/models/spaceship.glb");

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

// game pause overlay
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

export function SpaceGame() {
    const [gameOver, setGameOver] = useState(false);
    const [pause, setPause] = useState(false);
    const [shipHit, setShipHit] = useState(false);
    const [score, setScore] = useState(0);
    const [restartSignal, setRestartSignal] = useState(0);

    const handleRestart = () => {
        setGameOver(false);
        setPause(false);
        setShipHit(false);
        setScore(0);

        // trigger reset inside MeteorController + Spaceship
        setRestartSignal(prev => prev + 1);
    };

    const handleResume = () => {
        setPause(false);
    }

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setPause((prev) => !prev);
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


                            <Spaceship restartSignal={restartSignal} gameOver={gameOver} pause={pause} hit={shipHit} />

                            <MeteorController
                                restartSignal={restartSignal}
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