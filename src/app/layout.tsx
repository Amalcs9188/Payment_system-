import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { QueryProvider } from "./query-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cafe Payment",
  description: "A simple cafe payment system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}>
        <QueryProvider>
          <SidebarProvider>
            <div className="flex h-screen w-full">
              {/* Sidebar & Navbar */}
              <div >
                <AppSidebar />
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col min-w-0">
                <Navbar   />
                <div className="mt-4 overflow-auto side_bar">{children}</div>

                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  richColors={true}
                  style={{ zIndex: 9999 }}
                />
              </div>
            </div>
          </SidebarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
