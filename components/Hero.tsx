
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import DecryptedText from './effects/DecryptedText';
import { Separator } from './ui/separator';
import TextType from './effects/TextType';
import Link from 'next/link';

export const Hero: React.FC = () => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden pt-16">

            <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center gap-8">

                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-4xl font-bold font-departure tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600">
                        <DecryptedText
                            text='Rodolphe Yoann'
                            sequential={true}
                            animateOn="view"

                        />
                    </h1>

                    <Separator className='my-5 w-50' />

                    <div className="mx-auto max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
                        <TextType
                            loop={false}
                            text={["Hi, I am Rodolphe Yoann RAKOTO-HARISOA, a computer science student & full stack developper passionate about data science, web application and game development. Contact me to help you craft efficient and scalable solutions with a touch of creativity."]}
                            typingSpeed={50}
                            // deletingSpeed={80}
                            pauseDuration={-1}
                            showCursor={false}
                            cursorCharacter="|"

                        />

                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-end w-full">
                        <a href={"/spaceship"}>
                            <Button variant={"outline"} size="lg" className="cursor-target cursor-none text-white font-departure">
                                ▷ Wanna play ?
                            </Button>
                        </a>

                        <Button variant={"outline"} size="lg" className="cursor-target cursor-none text-white font-departure">
                            See more <ArrowRight className="h-4 w-4" />
                        </Button>


                    </div>
                </div>

            </div>
        </div>
    );
};