import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import { Chatbot } from "@/components/chatbot/chatbot";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
