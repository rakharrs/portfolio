import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import TargetCursor from "@/components/effects/TargetCursor";
import { Hero } from "@/components/Hero";
import { cn } from "@/lib/utils";


export default function Home() {
  return (
    <>
      <div className="dark max-h-screen bg-background font-sans antialiased selection:bg-primary selection:text-primary-foreground">
        <TargetCursor

          spinDuration={2}

          hideDefaultCursor={true}

          parallaxOn={true}

        />

        <main className="flex-1">
          <Hero />
        </main>
        <div>
          <StarsBackground
            className={cn(
              'absolute inset-0 flex items-center justify-center rounded-xl',
              'dark:bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)] bg-[radial-gradient(ellipse_at_bottom,_#f5f5f5_0%,_#fff_100%)]',
            )}
          />
        </div>
      </div>

    </>
  );
}
