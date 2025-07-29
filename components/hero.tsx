import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import React from "react";

const Hero = () => {
  return (
    <div className="min-h-[120vh] flex flex-col items-center py-10 xs:py-16 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      {/* Airplane Flight Route Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url('/images/airplane-flight-route-line-path-600nw-1656451969.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="mt-4 xs:mt-8 md:mt-4 flex items-center justify-center relative z-10">
        <div className="text-center max-w-4xl">
          <Badge className="bg-primary rounded-full py-2 px-4 text-base sm:text-base border-none">
            Club Fair 2025 is here! 🚀
          </Badge>
          <h1 className="mt-6 sm:mt-8 max-w-[20ch] mx-auto text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold !leading-[1.1] tracking-tight">
            Computer Science Society
          </h1>
          <p className="mt-4 sm:mt-8 max-w-[60ch] mx-auto text-lg sm:text-lg md:text-xl lg:text-2xl !leading-relaxed px-2 sm:px-0">
            Welcome aboard the Computer Science Society of the University of St. La Salle – where innovation takes flight and ideas ascend beyond limits. Accentuate your potential. And let your passion for Computer Science take flight.
          </p>
          <div className="mt-8 sm:mt-16 flex flex-col sm:flex-row items-center sm:justify-center gap-4">
            <Button
              size="lg"
              className="w-64 sm:w-auto rounded-full text-base sm:text-lg px-4 sm:px-8 py-2 sm:py-4"
            >
              Learn More <ArrowUpRight className="!h-5 !w-5 sm:!h-6 sm:!w-6 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
