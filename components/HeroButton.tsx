"use client"

import { toast } from "sonner"
import { Button } from "./ui/button"
import { AlertCircle, ArrowRight } from "lucide-react"

export default function HeroButton() {
    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <a href={"/spaceship"}>
                    <Button variant={"outline"} size="lg" className="cursor-target cursor-none text-white font-departure">
                        ▷ Play game ?
                    </Button>
                </a>

                <Button
                    onClick={() =>
                        toast.error("Coming soon", {
                            description: "section under construction o7",
                            icon: <AlertCircle className="h-4 w-4" />
                        })
                    }
                    variant={"outline"} size="lg" className="cursor-target cursor-none text-white font-departure">
                    See more <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </>
    )
}