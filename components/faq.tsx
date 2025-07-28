import {
  Route,
  ShieldCheck,
  UserRoundCheck,
  Ticket,
  Navigation,
  Calendar1
} from "lucide-react";

const faq = [
  {
    icon: Ticket,
    question: "How do I become a member of the CSS-USLS for this Academic Year?",
    answer:
      "Our pre-membership campaign is already on its way! You can join us by filling out the form below.",
  },
  {
    icon: Route,
    question: "What are the benefits of becoming a member of the CSS-USLS?",
    answer:
      "As a member, you will have access to our resources, events, and opportunities to network with other members and professionals in the field of computer science.",
  },
  {
    icon: Calendar1,
    question: "What are the events that the CSS-USLS will be hosting this Academic Year?",
    answer:
      "We will be hosting a series of events that will be announced soon. Stay tuned for more information!",
  },
  {
    icon: Navigation,
    question: "Where is the CSS-USLS located?",
    answer:
      "The CSS-USLS is located in the University of St. La Salle, Bacolod, Philippines.",
  },
  {
    icon: ShieldCheck,
    question: "How can we partner with the CSS-USLS?",
    answer:
      "Please contact our support team at comsci.eng@usls.edu.ph for more information.",
  },
  {
    icon: UserRoundCheck,
    question: "How can I contact the CSS-USLS?",
    answer:
      "Reach out via email at comsci.eng@usls.edu.ph for assistance with any inquiries.",
  },
];

const FAQ = () => {
  return (
    <div
      id="faq"
      className="min-h-screen flex items-center justify-center px-6 py-12 xs:py-20"
    >
      <div className="max-w-screen-lg">
        <h2 className="text-3xl xs:text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tight text-center">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 xs:text-lg text-center text-muted-foreground">
          Quick answers to common questions about our products and services.
        </p>

        <div className="mt-12 grid md:grid-cols-2 bg-background rounded-xl overflow-hidden outline outline-[1px] outline-border outline-offset-[-1px]">
          {faq.map(({ question, answer, icon: Icon }) => (
            <div key={question} className="border p-6 -mt-px -ml-px">
              <div className="h-8 w-8 xs:h-10 xs:w-10 flex items-center justify-center rounded-full bg-accent">
                <Icon className="h-4 w-4 xs:h-6 xs:w-6" />
              </div>
              <div className="mt-3 mb-2 flex items-start gap-2 text-lg xs:text-[1.35rem] font-semibold tracking-tight">
                <span>{question}</span>
              </div>
              <p className="text-sm xs:text-base">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
