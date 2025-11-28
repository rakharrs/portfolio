import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import TargetCursor from "@/components/effects/TargetCursor";
import { Toaster } from "sonner";
import { TransitionProvider } from "@/components/TransitionProvider";

export const metadata: Metadata = {
  title: "portfolio - Rodolphe Yoann",
  description: "RAKOTO-HARISOA Rodolphe Yoann's portfolio website",
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
