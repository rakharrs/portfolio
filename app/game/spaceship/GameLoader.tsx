"use client";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@react-three/drei";

export function GameLoader() {
    const { progress, active } = useProgress();
    if (!active) return null;

    return (

        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-black/70 text-white">
            <div className="flex w-full max-w-md flex-col items-center gap-2 font-departure">
                <h1 className="text-xl font-bold tracking-tight animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600">
                    Loading assets...
                </h1>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600">
                    {Math.round(progress)}%
                </span>
                <Progress value={progress} className="h-2 w-full" />
            </div>
        </div>

    );
}