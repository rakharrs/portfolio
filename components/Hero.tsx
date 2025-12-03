

import React from "react";
import { Gamepad2, Rocket, Code2, Coffee, Boxes, Cylinder } from "lucide-react";
import DecryptedText from "./effects/DecryptedText";
import { Separator } from "./ui/separator";
import TextType from "./effects/TextType";
import HeroWrapper from "./HeroWrapper";

const skills = [
    { label: "Full-Stack Dev", icon: <Code2 className="h-3 w-3" /> },
    { label: "Next.js & React", icon: <Rocket className="h-3 w-3" /> },
    { label: "Game Lover", icon: <Gamepad2 className="h-3 w-3" /> },
    { label: "Java - Spring boot - Quarkus", icon: <Coffee className="h-3 w-3" /> },
    { label: "PHP - Laravel", icon: <Boxes className="h-3 w-3" /> },
    { label: "Python", icon: null },
    { label: "SQL", icon: <Cylinder className="h-3 w-3" /> },
    { label: "AI", icon: null },
    { label: "Git", icon: null },
    { label: "Linux - Windows - MacOS", icon: null },
];


export const Hero: React.FC = () => {
    return (
        <>
            <HeroWrapper>
                <div className="space-y-6 max-w-3xl">
                    <h1 className="font-departure bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                        <DecryptedText
                            text="Rodolphe Yoann"
                            sequential={true}
                            animateOn="view"
                        />
                    </h1>

                    <Separator className="mx-auto my-4 w-24 bg-yellow-500/60" />
                    <div className="mx-auto max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        <TextType
                            loop={false}
                            text={["Hi, I am Rodolphe Yoann RAKOTO-HARISOA"]}
                            typingSpeed={7}
                            pauseDuration={-1}
                            showCursor={false}
                            cursorCharacter="|"
                        />
                        <TextType
                            loop={false}
                            text={[
                                "A computer science student & full stack developer that loves training, experimenting and learning new skills. From web development to 3D programming, I enjoy creating interactive experiences and pushing the boundaries of technology.",
                            ]}
                            typingSpeed={7}
                            initialDelay={10}
                            pauseDuration={-1}
                            showCursor={false}
                            cursorCharacter="|"
                        />
                        <TextType
                            loop={false}
                            text={["Welcome to my portfolio!"]}
                            typingSpeed={7}
                            initialDelay={2000}
                            pauseDuration={-1}
                            showCursor={false}
                            cursorCharacter="|"
                        />
                    </div>

                    {/* Skill badges */}
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {skills.map((skill) => (
                            <div
                                key={skill.label}
                                className="cursor-target group inline-flex items-center gap-1 rounded-full border border-yellow-500/40 bg-black/60 px-3 py-1 text-xs text-yellow-100/90 backdrop-blur-sm transition hover:border-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
                            >
                                {skill.icon && (
                                    <span className="translate-y-[0.5px] transition group-hover:scale-110">
                                        {skill.icon}
                                    </span>
                                )}
                                <span className="font-medium font-departure tracking-wide">
                                    {skill.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </HeroWrapper>

        </>
    );
};
