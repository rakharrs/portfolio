"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { gsap } from "gsap";
import "./TargetCursor.css";

export interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = ".cursor-target",
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
}) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  const isActiveRef = useRef(false);

  const targetCornerPositionsRef = useRef<
    { x: number; y: number }[] | null
  >(null);

  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12,
    }),
    []
  );

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;

    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (!cursorRef.current) return;

    /*
     * La détection de l’appareil est faite dans useEffect.
     * Elle ne s’exécute donc jamais pendant le rendu serveur.
     */
    const hasTouchScreen =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const hasCoarsePointer = window.matchMedia(
      "(pointer: coarse)"
    ).matches;

    const isMobile = hasTouchScreen || hasCoarsePointer;

    const originalCursor = document.body.style.cursor;

    if (hideDefaultCursor && !isMobile) {
      document.body.style.cursor = "none";
    }

    const cursor = cursorRef.current;

    cornersRef.current =
      cursor.querySelectorAll<HTMLDivElement>(
        ".target-cursor-corner"
      );

    let activeTarget: Element | null = null;
    let currentLeaveHandler: (() => void) | null = null;

    let resumeTimeout: ReturnType<typeof setTimeout> | null =
      null;

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener(
          "mouseleave",
          currentLeaveHandler
        );
      }

      currentLeaveHandler = null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const createSpinTimeline = () => {
      spinTl.current?.kill();

      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, {
          rotation: "+=360",
          duration: spinDuration,
          ease: "none",
        });
    };

    createSpinTimeline();

    const tickerFn = () => {
      if (
        !targetCornerPositionsRef.current ||
        !cursorRef.current ||
        !cornersRef.current
      ) {
        return;
      }

      const strength = activeStrengthRef.current.current;

      if (strength === 0) return;

      const cursorX = gsap.getProperty(
        cursorRef.current,
        "x"
      ) as number;

      const cursorY = gsap.getProperty(
        cursorRef.current,
        "y"
      ) as number;

      const corners = Array.from(cornersRef.current);

      corners.forEach((corner, index) => {
        const targetPosition =
          targetCornerPositionsRef.current?.[index];

        if (!targetPosition) return;

        const currentX = gsap.getProperty(
          corner,
          "x"
        ) as number;

        const currentY = gsap.getProperty(
          corner,
          "y"
        ) as number;

        const targetX = targetPosition.x - cursorX;
        const targetY = targetPosition.y - cursorY;

        const finalX =
          currentX + (targetX - currentX) * strength;

        const finalY =
          currentY + (targetY - currentY) * strength;

        const duration =
          strength >= 0.99
            ? parallaxOn
              ? 0.2
              : 0
            : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration,
          ease: duration === 0 ? "none" : "power1.out",
          overwrite: "auto",
        });
      });
    };

    tickerFnRef.current = tickerFn;

    const pointerMoveHandler = (event: PointerEvent) => {
      if (
        event.pointerType === "mouse" ||
        event.pointerType === "touch"
      ) {
        moveCursor(event.clientX, event.clientY);
      }
    };

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;

      const mouseX = gsap.getProperty(
        cursorRef.current,
        "x"
      ) as number;

      const mouseY = gsap.getProperty(
        cursorRef.current,
        "y"
      ) as number;

      const elementUnderMouse = document.elementFromPoint(
        mouseX,
        mouseY
      );

      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget ||
          elementUnderMouse.closest(targetSelector) ===
            activeTarget);

      if (!isStillOverTarget) {
        currentLeaveHandler?.();
      }
    };

    const pointerDownHandler = (event: PointerEvent) => {
      if (!dotRef.current || !cursorRef.current) return;

      if (
        event.pointerType === "mouse" ||
        event.pointerType === "touch"
      ) {
        gsap.to(dotRef.current, {
          scale: 0.7,
          duration: 0.3,
        });

        gsap.to(cursorRef.current, {
          scale: 0.9,
          duration: 0.2,
        });
      }
    };

    const pointerUpHandler = (event: PointerEvent) => {
      if (!dotRef.current || !cursorRef.current) return;

      if (
        event.pointerType === "mouse" ||
        event.pointerType === "touch"
      ) {
        gsap.to(dotRef.current, {
          scale: 1,
          duration: 0.3,
        });

        gsap.to(cursorRef.current, {
          scale: 1,
          duration: 0.2,
        });
      }
    };

    const enterHandler = (event: MouseEvent) => {
      const directTarget = event.target as Element;
      const matchingTargets: Element[] = [];

      let current: Element | null = directTarget;

      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          matchingTargets.push(current);
        }

        current = current.parentElement;
      }

      const target = matchingTargets[0] ?? null;

      if (
        !target ||
        !cursorRef.current ||
        !cornersRef.current
      ) {
        return;
      }

      if (activeTarget === target) return;

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;

      const corners = Array.from(cornersRef.current);

      corners.forEach((corner) => {
        gsap.killTweensOf(corner);
      });

      gsap.killTweensOf(cursorRef.current, "rotation");

      spinTl.current?.pause();

      gsap.set(cursorRef.current, {
        rotation: 0,
      });

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;

      const cursorX = gsap.getProperty(
        cursorRef.current,
        "x"
      ) as number;

      const cursorY = gsap.getProperty(
        cursorRef.current,
        "y"
      ) as number;

      targetCornerPositionsRef.current = [
        {
          x: rect.left - borderWidth,
          y: rect.top - borderWidth,
        },
        {
          x: rect.right + borderWidth - cornerSize,
          y: rect.top - borderWidth,
        },
        {
          x: rect.right + borderWidth - cornerSize,
          y: rect.bottom + borderWidth - cornerSize,
        },
        {
          x: rect.left - borderWidth,
          y: rect.bottom + borderWidth - cornerSize,
        },
      ];

      isActiveRef.current = true;

      if (tickerFnRef.current) {
        gsap.ticker.add(tickerFnRef.current);
      }

      gsap.to(activeStrengthRef.current, {
        current: 1,
        duration: hoverDuration,
        ease: "power2.out",
      });

      corners.forEach((corner, index) => {
        const targetPosition =
          targetCornerPositionsRef.current?.[index];

        if (!targetPosition) return;

        gsap.to(corner, {
          x: targetPosition.x - cursorX,
          y: targetPosition.y - cursorY,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      const leaveHandler = () => {
        if (tickerFnRef.current) {
          gsap.ticker.remove(tickerFnRef.current);
        }

        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;

        gsap.set(activeStrengthRef.current, {
          current: 0,
          overwrite: true,
        });

        activeTarget = null;

        if (cornersRef.current) {
          const currentCorners = Array.from(
            cornersRef.current
          );

          gsap.killTweensOf(currentCorners);

          const { cornerSize } = constants;

          const positions = [
            {
              x: -cornerSize * 1.5,
              y: -cornerSize * 1.5,
            },
            {
              x: cornerSize * 0.5,
              y: -cornerSize * 1.5,
            },
            {
              x: cornerSize * 0.5,
              y: cornerSize * 0.5,
            },
            {
              x: -cornerSize * 1.5,
              y: cornerSize * 0.5,
            },
          ];

          const timeline = gsap.timeline();

          currentCorners.forEach((corner, index) => {
            timeline.to(
              corner,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.3,
                ease: "power3.out",
              },
              0
            );
          });
        }

        resumeTimeout = setTimeout(() => {
          if (
            !activeTarget &&
            cursorRef.current &&
            spinTl.current
          ) {
            const currentRotation = gsap.getProperty(
              cursorRef.current,
              "rotation"
            ) as number;

            const normalizedRotation =
              currentRotation % 360;

            spinTl.current.kill();

            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, {
                rotation: "+=360",
                duration: spinDuration,
                ease: "none",
              });

            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration:
                spinDuration *
                (1 - normalizedRotation / 360),
              ease: "none",
              onComplete: () => {
                spinTl.current?.restart();
              },
            });
          }

          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;

      target.addEventListener(
        "mouseleave",
        leaveHandler
      );
    };

    window.addEventListener(
      "pointermove",
      pointerMoveHandler
    );

    window.addEventListener(
      "pointerdown",
      pointerDownHandler
    );

    window.addEventListener(
      "pointerup",
      pointerUpHandler
    );

    window.addEventListener(
      "mouseover",
      enterHandler as EventListener
    );

    window.addEventListener("scroll", scrollHandler, {
      passive: true,
    });

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }

      window.removeEventListener(
        "pointermove",
        pointerMoveHandler
      );

      window.removeEventListener(
        "pointerdown",
        pointerDownHandler
      );

      window.removeEventListener(
        "pointerup",
        pointerUpHandler
      );

      window.removeEventListener(
        "mouseover",
        enterHandler as EventListener
      );

      window.removeEventListener(
        "scroll",
        scrollHandler
      );

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
      }

      spinTl.current?.kill();

      document.body.style.cursor = originalCursor;

      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current.current = 0;
    };
  }, [
    targetSelector,
    spinDuration,
    moveCursor,
    constants,
    hideDefaultCursor,
    hoverDuration,
    parallaxOn,
  ]);

  useEffect(() => {
    if (!cursorRef.current || !spinTl.current) return;

    if (spinTl.current.isActive()) {
      spinTl.current.kill();

      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, {
          rotation: "+=360",
          duration: spinDuration,
          ease: "none",
        });
    }
  }, [spinDuration]);

  return (
    <div
      ref={cursorRef}
      className="target-cursor-wrapper"
      aria-hidden="true"
    >
      <div
        ref={dotRef}
        className="target-cursor-dot"
      />

      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
};

export default TargetCursor;