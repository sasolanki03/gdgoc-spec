
'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Papa from 'papaparse';
import { Timestamp } from 'firebase/firestore';
import { FileDown, Upload } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { LeaderboardEntry } from '@/lib/types';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['text/csv'];

const formSchema = z.object({
  file: z.any()
    .refine((files) => files?.[0], "A CSV file is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".csv files are accepted."
    ),
});

type CsvData = {
  studentName: string;
  profileUrl: string;
  campaignCompleted: string; // 'Yes' or 'No'
  completionTime: string;
};

interface LeaderboardUploadFormProps {
    onSuccess: (data: Omit<LeaderboardEntry, 'id'|'rank'>[]) => void;
}

export function LeaderboardUploadForm({ onSuccess }: LeaderboardUploadFormProps) {
  const { toast } = useToast();
  const [parsedData, setParsedData] = useState<CsvData[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setIsParsing(true);
        setError(null);
        setParsedData([]);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Validate required columns
                const requiredColumns = ['studentName', 'profileUrl', 'campaignCompleted', 'completionTime'];
                const headers = results.meta.fields || [];
                const missingColumns = requiredColumns.filter(col => !headers.includes(col));

                if (missingColumns.length > 0) {
                    setError(`The CSV file is missing the following required columns: ${missingColumns.join(', ')}.`);
                    setIsParsing(false);
                    return;
                }

                setParsedData(results.data as CsvData[]);
                setIsParsing(false);
            },
            error: (err) => {
                setError(`Error parsing CSV file: ${err.message}`);
                setIsParsing(false);
            }
        });
    }
  };

  const createSampleCsv = () => {
    const csvContent = [
        ['studentName', 'profileUrl', 'campaignCompleted', 'completionTime'].join(','),
        ['John Doe', 'https://www.cloudskillsboost.google/public_profiles/12345', 'Yes', '2024-05-20T14:30:00Z'],
        ['Jane Smith', 'https://www.cloudskillsboost.google/public_profiles/67890', 'No', '2024-05-21T10:00:00Z'],
    ].join('\n');
    return `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
  };
  
  const handleSubmit = () => {
    const entriesToUpload = parsedData.map(item => {
        const completionTime = new Date(item.completionTime);
        if (isNaN(completionTime.getTime())) {
            toast({
                variant: 'destructive',
                title: 'Invalid Date',
                description: `Could not parse date for ${item.studentName}: ${item.completionTime}`
            })
            throw new Error('Invalid date format found');
        }
        return {
            studentName: item.studentName,
            profileUrl: item.profileUrl,
            campaignCompleted: item.campaignCompleted.toLowerCase() === 'yes',
            completionTime: Timestamp.fromDate(completionTime),
            avatar: '' // will be generated on the server
        }
    }).filter(Boolean);

    if (entriesToUpload.length !== parsedData.length) {
        return; // An error was toasted
    }

    onSuccess(entriesToUpload);
  };

  return (
    <div className="flex flex-col gap-4">
        <Form {...form}>
            <form className="space-y-4">
            <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>CSV File</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            accept=".csv" 
                            onChange={(e) => {
                                field.onChange(e.target.files);
                                handleFileChange(e);
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            </form>
        </Form>

        <a 
            href={createSampleCsv()} 
            download="sample-leaderboard.csv"
            className={cn(buttonVariants({ variant: 'link' }), 'self-start p-0 h-auto')}
        >
            <FileDown className="mr-2 h-4 w-4" />
            Download Sample CSV
        </a>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Card className={cn('flex-1 flex flex-col', { 'hidden': parsedData.length === 0 && !isParsing })}>
            <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>
                    {isParsing ? 'Parsing file...' : `Found ${parsedData.length} records. Please verify the data before uploading.`}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-72">
                    <Table>
                        <TableHeader className="sticky top-0 bg-card">
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Profile URL</TableHead>
                                <TableHead>Completed</TableHead>
                                <TableHead>Completion Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {parsedData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.studentName}</TableCell>
                                <TableCell className="max-w-xs truncate">{row.profileUrl}</TableCell>
                                <TableCell>{row.campaignCompleted}</TableCell>
                                <TableCell>{row.completionTime}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                 <Button
                    onClick={handleSubmit}
                    disabled={isParsing || parsedData.length === 0 || !!error}
                    className="w-full mt-4"
                    >
                    Upload {parsedData.length} entries
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
