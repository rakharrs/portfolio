import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import TargetCursor from "@/components/effects/TargetCursor";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Yoann's portfolio",
  description: "Yoann's portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TargetCursor

          spinDuration={2}

          hideDefaultCursor={true}

          parallaxOn={true}

        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
