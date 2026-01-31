import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "لوحة التحكم",
  description: "لوحة تحكم إدارة دورات الفيديو",
};

import AuthGuard from "../components/AuthGuard";
import ClientLayout from "../components/ClientLayout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Use a client-side hook to determine the current path
  // This is a workaround for Next.js layouts being server components by default
  // We'll use a dynamic import for Sidebar and AuthGuard
  return (
    <html lang="ar" dir="rtl">
      <head>
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-900 dark:text-slate-100`} style={{ fontFamily: 'Cairo, Noto Sans Arabic, sans-serif' }}>
        <AuthGuard>
          <ClientLayout>{children}</ClientLayout>
        </AuthGuard>
      </body>
    </html>
  );
}

// ClientLayout is now imported as a separate client component
