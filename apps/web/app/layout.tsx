import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bokang Industry App Studio",
  description: "Reusable industry applications designed and developed by Bokang Jobe."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
