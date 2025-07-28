import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CTABanner from "@/components/cta-banner";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Calendar, MapPin, Clock } from "lucide-react";

interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  time: string;
  description?: string;
  type: string;
}

const events: Event[] = [
  {
    id: "1",
    name: "USLS Club Fair 2025",
    location: "USLS 2nd Floor Library Lobby",
    date: "July 29 - 31, 2025",
    time: "8:00 AM - 5:00 PM",
    description: "Learn more about our club and engage in some fun activities that we have prepared.",
    type: "Club Fair"
  },
  {
    id: "2",
    name: "CSS Joins Club Icon 2025",
    location: "USLS Coliseum",
    date: "August 1, 2025",
    time: "TBA",
    description: "Join us in the Coliseum as we showcase and support our club icon.",
    type: "Club Icon"
  },
  {
    id: "3",
    name: "CSS Joins PasiCLUBan 2025",
    location: "USLS Premises",
    date: "July 29, 2025",
    time: "5:00 PM - 6:00 PM",
    description: "It's a secret for now!",
    type: "Competition"
  },
];

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24">
        {/* Hero Section */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold !leading-[1.1] tracking-tight mb-8">
              Our Upcoming Events
              <span className="block"></span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto !leading-relaxed">
              Interested to know what events we have prepared? Check out our upcoming events and activities.
            </p>
          </div>
        </section>

        {/* Events Grid Section */}
        <section className="px-4 sm:px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
                >
                  {/* Event Type Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>

                  {/* Event Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {event.name}
                  </h3>

                  {/* Event Description */}
                  {event.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  {/* Event Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    className="w-full text-sm"
                  >
                    Learn More
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Past Events Section
        <section className="px-4 sm:px-6 py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Past Events
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Take a look at some of our successful past events and activities.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "DevCon 2023", attendees: "150+ Attendees" },
                { name: "Code Wars", attendees: "80+ Participants" },
                { name: "Tech Summit", attendees: "200+ Attendees" },
                { name: "Innovation Fair", attendees: "300+ Visitors" }
              ].map((pastEvent, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-6 text-center"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {pastEvent.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {pastEvent.attendees}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        <CTABanner />
        <Footer />
      </main>
    </>
  );
} 