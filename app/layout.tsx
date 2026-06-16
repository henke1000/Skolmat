import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "Skolmat röster",
  description: "Rösta på veckans skolmat med swipe.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Skolmat",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#14b8a6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
