import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout-wrapper";
import { AuthProvider } from "@/lib/auth/auth-context";

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CSS - Computer Science Society",
  description: "Empowering students in technology",
  keywords: [
    "Computer Science Society",
    "CSS USLS",
    "Computer Science",
    "University of St. La Salle",
    "Student Organization"
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://css-website.vercel.app",
    title: "CSS - Computer Science Society",
    description: "Empowering students in technology",
    siteName: "CSS - Computer Science Society",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Computer Science Society - USLS"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "CSS - Computer Science Society",
    description: "Empowering students in technology",
    images: ["/og-image.png"]
  },
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.className}>
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
