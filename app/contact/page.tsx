import { ContactForm } from "@/components/contact/contact-form";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Mail, MessageSquare, Clock, MapPin, Linkedin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IconShell } from "@/components/ui/icon-shell";

export const metadata = {
  title: "Contact Us | Accessibility.build",
  description:
    "Get in touch with our accessibility experts for questions, project support, or collaboration opportunities. We're here to help make your digital products accessible.",
  keywords: [
    "contact accessibility experts",
    "accessibility consulting",
    "WCAG compliance help",
    "accessibility audit services",
    "web accessibility support"
  ]
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-muted/30 to-background">
        <div className="container-wide py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
          Have questions about accessibility or need help with your project?
              We're here to help you create inclusive digital experiences.
        </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-wide pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Form */}
        <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight">Send us a Message</h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24-48 hours.
                  </p>
                </div>
                
                <Card className="border-0 shadow-sm bg-card/50">
                  <CardContent className="p-8">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              
              {/* Contact Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Contact Information</h3>

        <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <IconShell icon={Mail} size="md" tone="accent" className="flex-shrink-0 rounded-lg" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">Email</p>
                  <a
                    href="mailto:accessibilitybuild@gmail.com"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    accessibilitybuild@gmail.com
                  </a>
                </div>
              </div>

                  <div className="flex items-start gap-4">
                    <IconShell icon={Clock} size="md" tone="accent" className="flex-shrink-0 rounded-lg" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">Response Time</p>
                  <p className="text-sm text-muted-foreground">
                        24-48 hours during business days
                  </p>
                </div>
              </div>

                  <div className="flex items-start gap-4">
                    <IconShell icon={MapPin} size="md" tone="accent" className="flex-shrink-0 rounded-lg" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">Location</p>
                  <p className="text-sm text-muted-foreground">
                        Remote team serving clients worldwide
                  </p>
                </div>
              </div>

                  <div className="flex items-start gap-4">
                    <IconShell icon={MessageSquare} size="md" tone="accent" className="flex-shrink-0 rounded-lg" />
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Follow Us</p>
                    <a
                      href="https://linkedin.com/company/accessibilitybuild"
                      target="_blank"
                      rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Follow us on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                        LinkedIn
                    </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick FAQ */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quick Questions</h3>
                <Card className="border-0 shadow-sm bg-card/50">
                  <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1" className="border-0">
                        <AccordionTrigger className="text-sm font-medium hover:no-underline py-3 px-0">
                    Do you offer accessibility audits?
                  </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-3">
                          Yes, we provide comprehensive accessibility audits with detailed reports and actionable recommendations.
                  </AccordionContent>
                </AccordionItem>

                      <AccordionItem value="item-2" className="border-0">
                        <AccordionTrigger className="text-sm font-medium hover:no-underline py-3 px-0">
                    Can you help with WCAG compliance?
                  </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-3">
                          We specialize in WCAG 2.1 and 2.2 standards and can guide you through the entire compliance process.
                  </AccordionContent>
                </AccordionItem>

                      <AccordionItem value="item-3" className="border-0">
                        <AccordionTrigger className="text-sm font-medium hover:no-underline py-3 px-0">
                          Do you provide training?
                  </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-3">
                          Yes, we offer customized accessibility training for designers, developers, and content creators.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
