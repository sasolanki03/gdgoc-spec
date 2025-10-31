
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Papa, { ParseResult } from 'papaparse';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateLeaderboard } from '@/app/actions/leaderboard';
import type { LeaderboardEntry } from '@/lib/types';


type ParsedData = Omit<LeaderboardEntry, 'rank' | 'student'> & {
    studentName: string;
};

export function LeaderboardUploadForm() {
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
      dynamicTyping: true,
      complete: (results: ParseResult<ParsedData>) => {
        setIsParsing(false);
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
    const result = await updateLeaderboard(parsedData);

    if (result.success) {
        toast({
            title: 'Leaderboard Updated!',
            description: 'The new student progress data has been saved.',
        });
        // Reset state
        setFile(null);
        setParsedData([]);
        reset();
    } else {
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: result.error || 'Could not update the leaderboard. Please try again.',
        });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onParse)} className="space-y-4">
        <div className="p-6 border-dashed border-2 rounded-lg text-center bg-background">
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-10 w-10" />
              <p className="font-semibold">{file ? file.name : 'Click to upload or drag and drop'}</p>
              <p className="text-xs">CSV file up to 10MB</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>
              Review the parsed data before saving. Only the first 10 rows are shown.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border max-h-64">
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
                        <TableCell key={i}>{String(value)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button onClick={onSubmit} disabled={isSubmitting} className="mt-6 w-full sm:w-auto">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Save Changes to Leaderboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
