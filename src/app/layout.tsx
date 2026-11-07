import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visually — a tutor that thinks on the board",
  description: "An adaptive, whiteboard-first AI tutor for visual learning.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
