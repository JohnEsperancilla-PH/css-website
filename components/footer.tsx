import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  {
    title: "About",
    href: "#about",
  },
  {
    title: "Events",
    href: "#events",
  },
  {
    title: "FAQ",
    href: "#faq",
  },
  {
    title: "Testimonials",
    href: "#testimonials",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

const Footer = () => {
  return (
    <footer className="dark:border-t mt-40 dark bg-background text-foreground">
      <div className="max-w-screen-xl mx-auto">
        <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
          <div>
            {/* Logos */}
            <div className="flex items-center gap-6 mb-4">
              {/* USLS Logo */}
              <div className="relative h-12 w-24">
                <Image
                  src="/images/usls-logo.svg"
                  alt="University of St. La Salle"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>

              {/* Separator */}
              <div className="h-10 w-px bg-gray-300"></div>

              {/* CSS Logo */}
              <div className="flex items-center">
                <div className="relative h-10 w-10">
                  <Image
                    src="/images/css-logo.png"
                    alt="Computer Science Society - USLS"
                    fill
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold text-lg">Computer Science Society</h3>
                  <p className="text-sm text-muted-foreground">University of St. La Salle</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground max-w-xs">
              <p>La Salle Avenue, Bacolod City</p>
              <p>6100 Negros Occidental, Philippines</p>
            </div>
          </div>

          {/* Subscribe Newsletter */}
          <div className="max-w-xs w-full">
            <h6 className="font-semibold">Stay Connected</h6>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Get updates on events, workshops, and opportunities
            </p>
            <form className="flex items-center gap-2">
              <Input type="email" placeholder="Enter your email" />
              <Button>Join</Button>
            </form>
          </div>
        </div>
        <Separator />
        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <span className="text-muted-foreground text-center sm:text-start">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/" className="hover:text-foreground">
              Computer Science Society - USLS
            </Link>
            . All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
