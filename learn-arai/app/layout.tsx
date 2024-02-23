import type { Metadata } from "next";
import { open_sans } from "@/app/ui/fonts"
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={open_sans.className}>{children}</body>
      </AuthProvider>
    </html>
  );
}
