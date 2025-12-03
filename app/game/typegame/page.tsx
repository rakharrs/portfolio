import { Separator } from "@/components/ui/separator";
import "./typegame.css";

export default function TypegamePage() {
    return (
        <div className="w-full h-screen bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)] text-white">
            <div className="relative z-10 container mx-auto flex h-full flex-col items-center justify-center gap-8 px-4 md:px-6">
                <div>
                    <h1 className="font-departure bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                        Type Game
                    </h1>
                </div>

                <Separator className="mx-auto my-4 w-24 bg-yellow-500/60" />

                <div
                    className="
            w-full rounded-2xl border border-white/10
            bg-white/5 p-6 shadow-2xl
            backdrop-blur-md backdrop-saturate-150
            
            text-lg leading-relaxed md:text-xl
            text-gray-400
          "
                >
                    <span className="right-chars">
                        
                    </span>
                    <span>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
                        veritatis inventore molestiae quisquam saepe obcaecati. Totam, magni!
                        Nulla veritatis nemo asperiores aliquid illo perferendis voluptate
                        earum laboriosam reprehenderit adipisci. Quia?
                    </span>
                </div>
            </div>
        </div>
    );
}
