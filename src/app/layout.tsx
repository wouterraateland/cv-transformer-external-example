import type { Metadata } from "next";
import "app/globals.css";

export const metadata: Metadata = {
  title: "CV-Transformer External Usage Example",
};

export default function Layout({
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
