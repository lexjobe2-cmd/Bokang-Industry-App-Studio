import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@uppy/dashboard/css/style.min.css";
import type { Metadata } from "next";
import { StudioSessionProvider } from "@bokang/persistence";
import { OfflineBootstrap } from "../components/shared/OfflineBootstrap";

export const metadata: Metadata = {
  title: "Bokang Industry App Studio",
  description: "Reusable industry applications designed and developed by Bokang Jobe."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <StudioSessionProvider><OfflineBootstrap /><div id="main-content">{children}</div></StudioSessionProvider>
      </body>
    </html>
  );
}
