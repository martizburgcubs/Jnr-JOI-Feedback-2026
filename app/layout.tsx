import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Junior JOI 2026 Tournament Feedback",
  description: "Share your Junior JOI 2026 tournament experience in five minutes.",
  icons: {
    icon: "/joi-logo.png",
    shortcut: "/joi-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
