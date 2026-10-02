import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@uppy/dashboard/css/style.min.css";
import type { Metadata } from "next";
import { StudioSessionProvider } from "@bokang/persistence";

export const metadata: Metadata = {
  title: "Bokang Industry App Studio",
  description: "Reusable industry applications designed and developed by Bokang Jobe."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StudioSessionProvider>{children}</StudioSessionProvider>
      </body>
    </html>
  );
}
