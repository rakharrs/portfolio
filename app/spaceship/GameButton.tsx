"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react"

export default function GameMusic() {
    const [isPlaying, setMusic] = useState<boolean>(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const startMusic = () => {
            audioRef.current?.play();
            audioRef.current?.onplay
            window.removeEventListener("touchstart", startMusic);
            window.removeEventListener("click", startMusic);
        };

        window.addEventListener("touchstart", startMusic);
        window.addEventListener("click", startMusic);
    }, []);

    function handleMusicButton() {
        if (isPlaying) {
            setMusic(false);
            audioRef.current?.pause();
        } else {
            setMusic(true);
            audioRef.current?.play();
        }
    }
    return (
        <>
            <audio ref={audioRef} loop playsInline>
                <source src="/sounds/space-music-c.mp3" type="audio/mpeg" />
            </audio>
            <Button onClick={handleMusicButton} variant={isPlaying ? "default" : "destructive"} className="absolute top-4 left-4 z-10 cursor-target cursor-none text-4xl">
                <span className="font-departure bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600">♬</span>
            </Button>
        </>
    )
}