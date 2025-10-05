
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
import { Badge } from "@/components/ui/badge";

// Placeholder data until we connect to Firestore
const registrations = [
    { id: '1', name: 'Liam Johnson', email: 'liam@example.com', event: 'Android Study Jam', status: 'Approved', date: '2023-06-23' },
    { id: '2', name: 'Olivia Smith', email: 'olivia@example.com', event: 'Web Workshop', status: 'Declined', date: '2023-06-24' },
    { id: '3', name: 'Noah Williams', email: 'noah@example.com', event: 'Android Study Jam', status: 'Approved', date: '2023-06-25' },
    { id: '4', name: 'Emma Brown', email: 'emma@example.com', event: 'Cloud Study Jam', status: 'Pending', date: '2023-06-26' },
    { id: '5', name: 'James Jones', email: 'james@example.com', event: 'Web Workshop', status: 'Approved', date: '2023-06-27' },
];

export default function AdminRegistrationsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Event Registrations</CardTitle>
                <CardDescription>View and manage all event registrations.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="hidden md:table-cell">Event</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {registrations.map((reg) => (
                            <TableRow key={reg.id}>
                                <TableCell className="font-medium">{reg.name}</TableCell>
                                <TableCell>{reg.email}</TableCell>
                                <TableCell className="hidden md:table-cell">{reg.event}</TableCell>
                                <TableCell className="hidden md:table-cell">{reg.date}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={
                                        reg.status === 'Approved' ? 'default' : 
                                        reg.status === 'Declined' ? 'destructive' : 'secondary'
                                    }>
                                        {reg.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{registrations.length}</strong> of <strong>{registrations.length}</strong> registrations
              </div>
            </CardFooter>
        </Card>
    );
}
