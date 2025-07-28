"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Trophy,
  Calendar,
  ArrowUpRight
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import CTABanner from "@/components/cta-banner";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24">
        {/* Hero Section */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-primary rounded-full py-2 px-4 text-sm sm:text-base border-none mb-6">
              About CSS USLS ✨
            </Badge>
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold !leading-[1.1] tracking-tight mb-8">
              Empowering Future
              <span className="block">Tech Leaders</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto !leading-relaxed">
              The Computer Science Society of the University of St. La Salle is a vibrant community where innovation meets collaboration, and where every student&apos;s potential takes flight.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 px-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Mission - Left Side */}
              <div className="order-1 lg:order-1">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                  <p className="text-muted-foreground text-lg !leading-relaxed mb-8">
                    The Computer Science Society - USLS commits to the pursuance of progress and development in different aspects of the society. The organization aims to connect the potential of the computer science community to the pursuit of academic development, technological relevance, societal change, and political awareness. As an academic club, it seeks to create opportunities for computer science students through collaboration with the faculty, industry partners, and the Computer Science students that will become an avenue of life-changing milestones through well-curated programs and activities.
                  </p>
                </div>
              </div>

              {/* Mission Image - Right Side */}
              <div className="order-2 lg:order-2">
                <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/mission.jpg"
                    alt="Computer Science Society Mission"
                    fill
                    className="object-cover object-center scale-110"
                  />
                </div>
              </div>
            </div>

            {/* Vision Section */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mt-20">
              {/* Vision Image - Left Side */}
              <div className="order-2 lg:order-1">
                <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/vision.jpg"
                    alt="Computer Science Society Vision"
                    fill
                    className="object-cover object-center scale-110"
                  />
                </div>
              </div>

              {/* Vision - Right Side */}
              <div className="order-1 lg:order-2">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
                  <p className="text-muted-foreground text-lg !leading-relaxed mb-8">
                    The Computer Science Society - USLS envisions a community of like-minded individuals with the mindset of innovation and creativity that has eradicated their lone-wolf mentality and will become a community that is collaborative in pursuit of development in the technological field.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="bg-primary rounded-full py-2 px-4 text-sm border-none mb-4">
                  Our Story
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  A Journey of Growth and Innovation
                </h2>
                <p className="text-lg text-muted-foreground !leading-relaxed mb-6">
                  Founded with the vision of creating a supportive community for computer science students, the CSS USLS has grown into a dynamic organization that bridges academic learning with real-world application.
                </p>
                <p className="text-lg text-muted-foreground !leading-relaxed mb-8">
                  Through years of dedication and collaboration, we&apos;ve built a legacy of excellence, fostering innovation and empowering students to reach their full potential in the ever-evolving field of technology.
                </p>
                <Button size="lg" className="rounded-full">
                  Join Our Journey <ArrowUpRight className="!h-5 !w-5 ml-2" />
                </Button>
              </div>

              <div className="border bg-background text-foreground rounded-2xl p-8 md:p-12">
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mr-4 mt-1">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">2019</h3>
                      <p className="text-muted-foreground">The Computer Science Society of the University of St. La Salle was founded.</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mr-4 mt-1">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">2021</h3>
                      <p className="text-muted-foreground">Reached 100+ active members and launched different programs and events to help the community.</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mr-4 mt-1">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">2024</h3>
                      <p className="text-muted-foreground">Partnered with multiple international and local organizations to help the community.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTABanner />
        <Footer />
      </main>
    </>
  );
} 