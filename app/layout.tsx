import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import TargetCursor from "@/components/effects/TargetCursor";
import { Toaster } from "sonner";
import { TransitionProvider } from "@/components/TransitionProvider";

export const metadata: Metadata = {
  title: "portfolio - Rodolphe Yoann",
  description: "Hi, I am Rodolphe Yoann RAKOTO-HARISOA, a computer science student & full stack developer and here is my portfolio website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        <TransitionProvider>
          {children}
        </TransitionProvider>
        <Toaster />
      </body>
    </html>
  );
}
