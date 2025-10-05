import { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { ContactForm } from '@/components/forms/contact-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqs } from '@/lib/placeholder-data';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with GDG SPECM. We\'d love to hear from you!',
};

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        title="Get In Touch"
        description="Have a question, a suggestion, or want to collaborate? Drop us a line!"
      />
      <div className="py-16 md:py-24">
        <div className="container max-w-7xl">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-bold font-headline mb-6">Send us a Message</h2>
              <ContactForm />
            </div>
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <h3 className="text-2xl font-bold font-headline mb-4">Contact Information</h3>
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <MapPin className="h-6 w-6 text-primary mt-1"/>
                                <div>
                                    <h4 className="font-semibold">Address</h4>
                                    <p className="text-muted-foreground">Shree Parekh Engineering College, <br/>Bhavnagar Road, Mahuva, <br/>Dist. Bhavnagar, Gujarat, India - 364290</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Mail className="h-6 w-6 text-primary mt-1"/>
                                <div>
                                    <h4 className="font-semibold">Email</h4>
                                    <a href="mailto:contact@gdgspecm.in" className="text-muted-foreground hover:text-primary">contact@gdgspecm.in</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="h-6 w-6 text-primary mt-1"/>
                                <div>
                                    <h4 className="font-semibold">Phone</h4>
                                    <p className="text-muted-foreground">(+91) 123-456-7890</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <h3 className="text-2xl font-bold font-headline mb-4">FAQs</h3>
                     <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="font-semibold text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
