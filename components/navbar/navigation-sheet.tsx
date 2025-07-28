import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Logo />
        <NavMenu orientation="vertical" className="mt-12" />

        <div className="mt-8 space-y-4">
          <Button asChild className="w-full xs:hidden">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSc00ARqp2iVGDPP6wWi4KHdlkS8ZEHywKP_gYuT0KMSIrDcKA/viewform?usp=dialog" target="_blank" rel="noopener noreferrer">
              Join CSS Now
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
