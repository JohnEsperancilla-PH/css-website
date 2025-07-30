"use client";

import { useState } from "react";
import CTABanner from "@/components/cta-banner";
import FAQ from "@/components/faq";
import Hero from "@/components/hero";
import LoadingScreen from "@/components/loading-screen";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-1000"}>
        <main className="pt-16 xs:pt-20 sm:pt-24">
          <Hero />
          {/* <Features /> */}
          {/* <Pricing /> */}
          
          {/* Forms System CTA */}
          <section className="py-16 bg-blue-50">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Custom Forms System
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We&apos;ve built a powerful Google Forms-inspired system with clean UI, 
                one-question-per-page interface, and comprehensive admin features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo">
                  <Button size="lg" className="flex items-center gap-2">
                    View Demo & Features
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button size="lg" variant="outline" className="flex items-center gap-2">
                    Admin Dashboard
                    <FileText className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
          
          <FAQ />
          {/* <Testimonials /> */}
          <CTABanner />
        </main>
      </div>
    </>
  );
}
