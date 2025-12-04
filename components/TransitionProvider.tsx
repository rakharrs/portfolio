"use client";

import React, { createContext, useContext, useRef, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { cn } from "@/lib/utils";

type TransitionContextValue = {
  startTransition: (href: string, transitionBackground?: string) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export const usePageTransition = () => {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("usePageTransition must be used inside TransitionProvider");
  }
  return ctx;
};

type Props = {
  children: ReactNode;
};

export const TransitionProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [backgroundTransition, setBackgroundTransition] = useState<string>("");
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Ensure overlay is hidden at the start
  useEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { autoAlpha: 0 });
    }
  }, []);

  const startTransition = (href: string, transitionBackground?: string) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setBackgroundTransition(transitionBackground || "bg-gradient-to-b from-yellow-50 via-white to-slate-100");

    const overlay = overlayRef.current;
    if (!overlay) {
      router.push(href);
      return;
    }

    const slices = overlay.querySelectorAll<HTMLDivElement>(".slice");

    // animation: slices move from bottom to center
    const tl = gsap.timeline({
      onComplete: () => {
        router.push(href);
      },
    });

    tl.set(overlay, { autoAlpha: 1 }) // show overlay
      .fromTo(
        slices,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
        }
      );
  };

  // When the route actually changes, play the "reveal" animation (slices exit)
  useEffect(() => {
    if (!isAnimating || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const slices = overlay.querySelectorAll<HTMLDivElement>(".slice");

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        gsap.set(overlay, { autoAlpha: 0 });
      },
    });

    tl.fromTo(
      slices,
      { yPercent: 0 },
      {
        yPercent: -100,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.in",
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-50 flex opacity-0"
      >
        {Array.from({ length: 1 }).map((_, index) => (
          <div
            key={index}
            className={
              cn([
                "slice flex-1",
                backgroundTransition
              ])
            }
          />
        ))}
      </div>

      {children}
    </TransitionContext.Provider>
  );
};
