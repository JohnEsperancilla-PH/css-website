import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Computer Science Society - USLS",
  description:
    "Accentuate your potential. And let your passion for Computer Science take flight.",
  keywords: [
    "Computer Science Society USLS",
    "CSS USLS",
    "ComSciSoc USLS",
    "CSS University of St. La Salle"
  ],
  openGraph: {
    type: "website",
    siteName: "Computer Science Society - USLS",
    locale: "en_US",
    url: "https://computer-science-society-usls.vercel.app",
    title: "Computer Science Society - USLS",
    description:
      "Accentuate your potential. And let your passion for Computer Science take flight.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Computer Science Society - USLS",
      },
    ],
  },
  authors: [
    {
      name: "Computer Science Society - USLS",
      url: "https://computer-science-society-usls.vercel.app",
    },
  ],
  creator: "John Esperancilla",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
    {
      rel: "icon",
      type: "image/svg+xml",
      url: "/favicon.svg",
    },
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-96x96.png",
      sizes: "96x96",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/web-app-manifest-192x192.png",
      sizes: "192x192",
    },
  ],
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
