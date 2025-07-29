import Image from "next/image";

export const Logo = () => (
  <div className="flex items-center gap-4">
    {/* USLS Logo */}
    <div className="relative h-8 w-16 sm:h-10 sm:w-20">
      <Image
        src="/images/usls-logo.svg"
        alt="University of St. La Salle"
        fill
        className="object-contain brightness-0"
      />
    </div>

    {/* Separator */}
    <div className="h-6 sm:h-8 w-px bg-gray-300"></div>

    {/* CSS Logo */}
    <div className="flex items-center">
      <div className="relative h-8 w-8 sm:h-10 sm:w-10">
        <Image
          src="/images/css-logo.png"
          alt="Computer Science Society - USLS"
          fill
          className="object-contain"
        />
      </div>
      {/* <div className="hidden sm:block ml-3">
        <h3 className="font-bold text-sm">Computer Science Society</h3>
        <p className="text-xs text-muted-foreground">University of St. La Salle</p>
      </div> */}
    </div>
  </div>
);
