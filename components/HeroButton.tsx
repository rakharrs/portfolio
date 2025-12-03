"use client"

import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"
import { usePageTransition } from "@/components/TransitionProvider";



export default function HeroButton({onGameButtonClick}: {onGameButtonClick: () => void}) {
    const { startTransition } = usePageTransition();

    const handleClick = () => {
        startTransition("/about");
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <Button
                    onClick={onGameButtonClick}
                    variant={"outline"} size="lg" className="cursor-target cursor-none text-white font-departure">
                    ▷ Play game ?
                </Button>

                <Button
                    onClick={handleClick}
                    variant={"outline"} size="lg" className="cursor-target cursor-none text-white font-departure">
                    See more <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

        </>
    )
}




