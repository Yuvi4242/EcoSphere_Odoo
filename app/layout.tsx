import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ESGProvider } from "../context/ESGContext";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoSphere - ESG Management Platform",
  description: "Measure, manage, and improve carbon accounting, social CSR activities, and compliance governance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
    </html>
  );
}
