import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alldare",
  description: "Identity and Authorization Provider for Alldare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
