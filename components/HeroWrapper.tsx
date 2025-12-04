"use client";

import { cn } from "@/lib/utils";
import TargetCursor from "./effects/TargetCursor";
import { useState } from "react";
import HeroButton from "./HeroButton";
import { usePageTransition } from "./TransitionProvider";

function GameMenuButton({ onExitClick }: { onExitClick: () => void }) {
    const { startTransition } = usePageTransition();
    const handleTypeGameClick = () => {
        onExitClick();
        startTransition("/game/typegame");
    }
    const menuButtonClassName =
        "group inline-flex items-center justify-center gap-3 rounded-full border border-yellow-500/40 bg-black/60 px-14 py-8 text-2xl text-yellow-100/90 backdrop-blur-sm transition hover:border-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 active:scale-95";

    return (
        <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-14">
                <div className="flex flex-row items-center justify-center">
                    <a
                        href="/game/spaceship"
                        className={cn(menuButtonClassName, "relative top-20 cursor-none")}
                        style={{ transform: "rotate(-15deg)" }}
                    >
                        <span className="font-departure text-5xl font-bold tracking-widest">
                            Spaceship
                        </span>
                    </a>
                    <button
                        onClick={handleTypeGameClick}
                        className={cn(menuButtonClassName, "relative top-20 cursor-none")}
                        style={{ transform: "rotate(20deg)" }}
                    >
                        <span className="font-departure text-5xl font-bold tracking-widest">
                            Type Game
                        </span>
                    </button>
                </div>

                <button
                    onClick={onExitClick}
                    className="
            group inline-flex items-center justify-center
            h-24 w-24 rounded-full
            border-2 border-yellow-500/50 bg-black/60
            text-yellow-100/90 backdrop-blur-md transition
            hover:border-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300
            active:scale-95
          "
                    aria-label="Exit"
                >
                    <span className="font-departure text-2xl font-extrabold tracking-widest">
                        EXIT
                    </span>
                </button>
            </div>
        </div>
    );
}

export default function HeroWrapper({ children }: { children: React.ReactNode }) {
    const [toggle, setToggle] = useState(false);
    const handleMenu = () => {
        setToggle(!toggle);
    }
    return (
        <>
            {toggle && (
                <div className="absolute w-full h-full bg-black/60 z-50">
                    <GameMenuButton onExitClick={handleMenu} />
                </div>
            )}
            <div className="no-touch relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden pt-16 text-center">

                <TargetCursor

                    spinDuration={2}

                    hideDefaultCursor={true}

                    parallaxOn={true}

                />

                <div className="relative z-10 container flex flex-col items-center gap-8 px-4 md:px-6">
                    {children}
                    <HeroButton onGameButtonClick={handleMenu} />
                </div>
            </div>
        </>
    );
}