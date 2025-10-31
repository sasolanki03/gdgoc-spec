
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Papa, { ParseResult } from 'papaparse';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { scrapeAndProcessProfiles } from '@/ai/flows/scrape-leaderboard-flow';
import type { LeaderboardEntry } from '@/lib/types';


type ParsedData = {
    studentName: string;
    profileId: string;
};

interface LeaderboardUploadFormProps {
    onSuccess: (data: Omit<LeaderboardEntry, 'id' | 'rank'>[]) => void;
}

export function LeaderboardUploadForm({ onSuccess }: LeaderboardUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a .csv file.',
        });
        return;
      }
      setFile(selectedFile);
      setParsedData([]);
    }
  };

  const onParse = () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a CSV file to parse.',
      });
      return;
    }

    setIsParsing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results: ParseResult<ParsedData>) => {
        setIsParsing(false);
        const requiredHeaders = ['studentName', 'profileId'];
        const actualHeaders = results.meta.fields || [];

        if (!requiredHeaders.every(h => actualHeaders.includes(h))) {
            toast({
                variant: 'destructive',
                title: 'Invalid CSV Headers',
                description: `File must contain the following headers: ${requiredHeaders.join(', ')}`,
            });
            return;
        }

        if (results.errors.length > 0) {
          toast({
            variant: 'destructive',
            title: 'Parsing Error',
            description: 'There was an error parsing the file. Please check the format.',
          });
          console.error('Parsing errors:', results.errors);
          return;
        }
        setParsedData(results.data);
        toast({
          title: 'File Parsed Successfully',
          description: `${results.data.length} records found. Review the data below.`,
        });
      },
      error: (error: Error) => {
        setIsParsing(false);
        toast({
          variant: 'destructive',
          title: 'Parsing Error',
          description: error.message,
        });
        console.error('PapaParse error:', error);
      },
    });
  };

  const onSubmit = async () => {
    if (parsedData.length === 0) {
        toast({
            variant: 'destructive',
            title: 'No Data to Save',
            description: 'Please parse a file before saving.',
        });
        return;
    }
    
    setIsSubmitting(true);
    toast({
        title: 'Scraping in Progress...',
        description: 'Fetching data from profiles. This may take a while, please do not close this window.',
    });
    
    try {
        const result = await scrapeAndProcessProfiles(parsedData);

        // Filter out any null results from scraping errors
        const successfulScrapes = result.filter(r => r !== null) as Omit<LeaderboardEntry, 'id' | 'rank'>[];

        if(successfulScrapes.length === 0) {
            throw new Error("Scraping failed for all profiles. Please check profile URLs and website structure.");
        }

        if (successfulScrapes.length < parsedData.length) {
            toast({
                variant: 'destructive',
                title: 'Partial Scraping Failure',
                description: `Could not scrape ${parsedData.length - successfulScrapes.length} profiles. The leaderboard will be updated with the successful ones.`,
            });
        }

        onSuccess(successfulScrapes);
        setFile(null);
        setParsedData([]);
        reset();

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: error.message || 'Could not update the leaderboard. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
      <form onSubmit={handleSubmit(onParse)} className="space-y-4">
        <div className="p-6 border-dashed border-2 rounded-lg text-center bg-background">
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-10 w-10" />
              <p className="font-semibold">{file ? file.name : 'Click to upload or drag and drop'}</p>
              <p className="text-xs">CSV with `studentName` and `profileId` headers</p>
            </div>
          </label>
          <Input 
            id="csv-upload" 
            type="file" 
            className="hidden" 
            accept=".csv"
            {...register('file')}
            onChange={handleFileChange} 
          />
        </div>
        <Button type="submit" disabled={!file || isParsing || isSubmitting} className="w-full sm:w-auto">
          {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
          Parse File
        </Button>
      </form>

      {parsedData.length > 0 && (
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>
              Review the parsed profile URLs before scraping. Only the first 10 rows are shown.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <ScrollArea className="h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(parsedData[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.slice(0, 10).map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i} className="max-w-xs truncate">{String(value)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
           <CardFooter>
            <Button onClick={onSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Fetch Data and Update Leaderboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
