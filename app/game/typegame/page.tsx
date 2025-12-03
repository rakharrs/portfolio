"use client";
import React, { useMemo, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import "./typegame.css";
import typeGameData from "./data";
import { Button } from "@/components/ui/button";

const data = typeGameData;

function getCorrectPrefixLen(typed: string, target: string) {
  let i = 0;
  const max = Math.min(typed.length, target.length);
  while (i < max && typed[i] === target[i]) i++;
  return i;
}

export default function TypegamePage() {
  const [itemValue, setItemValue] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasError, setHasError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const targetText = data[itemValue]?.text ?? "";

  const correctLen = useMemo(
    () => getCorrectPrefixLen(inputValue, targetText),
    [inputValue, targetText]
  );

  const correctText = useMemo(() => targetText.slice(0, correctLen), [targetText, correctLen]);
  const typedWrongText = useMemo(() => inputValue.slice(correctLen), [inputValue, correctLen]);
  const remainingText = useMemo(() => targetText.slice(correctLen + typedWrongText.length), [targetText, correctLen, typedWrongText.length]);

  const errors = typedWrongText.length;

  const handleStart = () => {
    setItemValue(Math.floor(Math.random() * data.length));
    setInputValue("");
    setHasError(false);
    setGameStarted(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const changeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.slice(0, targetText.length);
    setInputValue(next);

    const nextCorrectLen = getCorrectPrefixLen(next, targetText);
    const nextHasError = next.length > nextCorrectLen;

    if (nextHasError && !hasError) {
      setHasError(true);

      // remove error state after the shake finishes
      window.setTimeout(() => setHasError(false), 220);
    } else if (!nextHasError) {
      setHasError(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)] text-white">
      <div className="relative z-10 container mx-auto flex h-full flex-col items-center justify-center gap-6 px-4 md:px-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-departure bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            Type Game
          </h1>

          {!gameStarted && (
            <Button
              onClick={handleStart}
              className="font-departure group inline-flex items-center justify-center gap-3 rounded-full border border-yellow-500/40 bg-black/60 px-14 py-8 text-2xl text-yellow-100/90 backdrop-blur-sm transition hover:border-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 active:scale-95 hover:cursor-pointer"
            >
              Start
            </Button>
          )}
        </div>

        {gameStarted && (
          <>
            <Separator className="mx-auto my-2 w-24 bg-yellow-500/60" />

            <div className="w-full max-w-4xl">
              <div
                className="
                  w-full rounded-2xl border border-white/10
                  bg-white/5 p-6 shadow-2xl
                  backdrop-blur-md backdrop-saturate-150
                  text-lg leading-relaxed md:text-xl
                  text-gray-300
                "
              >
                <span className="right-chars">{correctText}</span>

                {typedWrongText.length > 0 && (
                  <span className="wrong-chars">{typedWrongText}</span>
                )}

                <span className="pending-chars">{remainingText}</span>
              </div>

              <div className="mt-6 w-full max-w-3xl mx-auto">
                <input
                  ref={inputRef}
                  placeholder="Start typing here..."
                  className={[
                    "w-full rounded-2xl border bg-black/40 px-5 py-4 text-lg md:text-xl text-white outline-none shadow-lg",
                    "border-white/10 focus:border-yellow-500/60 focus:ring-2 focus:ring-yellow-500/20",
                    hasError ? "input-error" : "",
                  ].join(" ")}
                  value={inputValue}
                  onChange={changeInputValue}
                  spellCheck={false}
                  autoCapitalize="none"
                  autoCorrect="off"
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-300">
                  <div className="flex gap-4">
                    <span>
                      Progress: {correctLen}/{targetText.length}
                    </span>
                    <span>Errors: {errors}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
