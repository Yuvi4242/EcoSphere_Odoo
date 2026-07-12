import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ESGProvider } from "../context/ESGContext";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "EcoSphere - ESG Management Platform",
  description: "Measure, manage, and improve carbon accounting, social CSR activities, and compliance governance.",
=======
  title: "EcoSphere — ESG Platform",
  description:
    "End-to-end ESG management: carbon accounting, CSR activities, governance, and gamification — all in one platform.",
>>>>>>> c85afe19836437d8bd5ee454ad9a252f053d0abe
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex font-sans bg-background text-foreground">
        <ESGProvider>
          <div className="flex w-full min-h-screen">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Top Header */}
              <Header />
              
              {/* Page Content */}
              <main className="flex-1 p-8 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ESGProvider>
      </body>
=======
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
>>>>>>> c85afe19836437d8bd5ee454ad9a252f053d0abe
    </html>
  );
}
