"use client";

import { useState } from "react";
import CTABanner from "@/components/cta-banner";
import FAQ from "@/components/faq";
import Hero from "@/components/hero";
import LoadingScreen from "@/components/loading-screen";
// Removed unused imports

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

          
          <FAQ />
          {/* <Testimonials /> */}
          <CTABanner />
        </main>
      </div>
    </>
  );
}
