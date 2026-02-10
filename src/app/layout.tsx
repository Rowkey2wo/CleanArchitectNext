import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secure Portal",
  description: "High-security Next.js login and dashboard",
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