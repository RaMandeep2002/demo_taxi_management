import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./Providers";
import "react-datepicker/dist/react-datepicker.css";
import { ThemeProvider } from "./components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Demo Taxi",
  description:
    "Discover Salmon Arm Taxi your trusted transportation service in Salmon Arm. Learn about our company, explore our fleet, and get in touch easily through our website. Safe, reliable, and professional service you can count on.",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <Providers>
          {" "}
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}  
            disableTransitionOnChange
            themes={["light", "dark", "dracula", "solarized"]} // custom themes
          >
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
