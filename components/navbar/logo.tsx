import Image from "next/image";

export const Logo = () => (
  <div className="flex items-center">
    <div className="relative h-8 w-8 sm:h-10 sm:w-10">
      <Image
        src="/images/css-logo.png"
        alt="Computer Science Society - USLS"
        fill
        className="object-contain"
      />
    </div>
  </div>
);
