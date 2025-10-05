
'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

// Placeholder data until we connect to Firestore
const messages = [
    { id: '1', name: 'Olivia Martin', email: 'olivia.m@example.com', subject: 'Question about hackathon sponsorship', message: 'Hello, I am interested in sponsoring the upcoming hackathon. Can you provide more details?', date: '2023-07-15' },
    { id: '2', name: 'Jackson Lee', email: 'jackson.l@example.com', subject: 'Feedback on the last workshop', message: 'The web development workshop was amazing! I learned a lot. Thank you to the organizers.', date: '2023-07-14' },
    { id: '3', name: 'Sophia Davis', email: 'sophia.d@example.com', subject: 'Collaboration Inquiry', message: 'I represent a local tech meetup and would love to explore collaboration opportunities with GDG SPEC.', date: '2023-07-12' },
];

export default function AdminContactsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>View messages submitted through the contact form.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {messages.map((msg) => (
                        <AccordionItem value={msg.id} key={msg.id}>
                            <AccordionTrigger>
                                <div className="flex justify-between w-full pr-4">
                                    <div className="text-left">
                                        <p className="font-semibold">{msg.subject}</p>
                                        <p className="text-sm text-muted-foreground">{msg.name} - {msg.email}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground self-center">{msg.date}</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 bg-muted/50 rounded-md">
                                {msg.message}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
             <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{messages.length}</strong> of <strong>{messages.length}</strong> messages
              </div>
            </CardFooter>
        </Card>
    );
}
