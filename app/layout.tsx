import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { AuthProvider } from "@/components/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtStudio - Персональная студия художницы",
  description: "Закажите уникальные художественные работы от профессиональной художницы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} antialiased m-0 p-0`}>
        <AuthProvider>
          <AnimatedBackground />
          <Navbar />
          <main className="pt-20 min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
