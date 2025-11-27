import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import Meteor from "./entity/Meteor";

interface MeteorData {
    id: string;
    x: number;
    scale: number;
    speed: number;
}

export default function MeteorController({ restartSignal, setGameOver, gameOver, pause, onShipHit, setScore, score }: { restartSignal: number, setGameOver: (value: boolean) => void; gameOver: boolean; pause: boolean; onShipHit: () => void; setScore: (value: number) => void; score: number }) {
    const { viewport } = useThree();
    const [meteors, setMeteors] = useState<MeteorData[]>([]);
    const lastSpawnTime = useRef(0);

    // Seconds between spawns
    useFrame((state) => {
        if (gameOver || pause) return;

        const time = state.clock.getElapsedTime();
        const spawnRate = 0.5 - Math.min(score * 0.02, 0.3);
        // Spawn logic
        if (time - lastSpawnTime.current > spawnRate) {
            lastSpawnTime.current = time;

            // Random attributes
            const id = Math.random().toString();
            const x = (Math.random() - 0.5) * viewport.width; // Span full width
            const scale = 0.5 + Math.random() * 1.5; // Random size 0.5 to 2.0
            const speed = 3 + Math.random() * (score + 2); // Random speed

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

    useEffect(() => {
        // Clear meteors on restart
        meteors.forEach(meteor => {
            removeMeteor(meteor.id);
        });
        setScore(0);
        lastSpawnTime.current = 0;
    }, [restartSignal]);

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
