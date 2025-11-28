import { SpaceGame } from "@/components/Spacegame";
import GameMusic from "./GameButton";
import TargetCursor from "@/components/effects/TargetCursor";


export default function SpacegamePage() {
    return (
        <main>
            <TargetCursor

                spinDuration={2}

                hideDefaultCursor={true}

                parallaxOn={true}

            />
            <GameMusic />
            <SpaceGame />
        </main>
    )
}