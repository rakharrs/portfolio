"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { p } from "motion/react-client";

export default function GameMusic() {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);


    function handleMusicButton() {
        if (isPlaying) {
            setIsPlaying(false);
            audioRef.current?.pause();
        } else {
            setIsPlaying(true);
            audioRef.current?.play();
        }
    }

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "m") {
                handleMusicButton()
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    })

    return (
        <>
            <audio ref={audioRef} loop playsInline>
                <source src="/sounds/space-music-c.mp3" type="audio/mpeg" />
            </audio>

            <div className="absolute top-4 left-4 z-20 flex items-center gap-3 select-none">
                <Button
                    onClick={handleMusicButton}
                    size="icon"
                    variant="ghost"
                    className={cn(
                        "cursor-target",
                        "h-12 w-12 rounded-full shadow-lg backdrop-blur-md",
                        "border border-yellow-500/40 hover:border-yellow-400",
                        "transition-all duration-300",
                        isPlaying
                            ? "bg-yellow-500/20 hover:bg-yellow-500/30"
                            : "bg-red-600/20 hover:bg-red-600/30"
                    )}
                >
                    <span
                        className={cn(
                            "text-3xl font-departure bg-clip-text text-transparent bg-gradient-to-r",
                            isPlaying
                                ? "from-yellow-300 to-yellow-600"
                                : "from-red-300 to-red-600",
                            isPlaying && "animate-spin-slow"
                        )}
                    >
                        ♬
                    </span>
                </Button>

                <span className="font-departure text-white text-sm opacity-80">
                    Press <span className="underline">Esc</span> to pause game
                </span>

                <span className="font-departure text-white text-sm opacity-80">
                    - <span className="underline">M</span> for music
                </span>
            </div>
        </>
    );
}
