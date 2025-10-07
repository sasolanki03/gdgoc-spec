import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72 mt-2" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center"><Skeleton className="h-5 w-10 mx-auto" /></TableHead>
              <TableHead><Skeleton className="h-5 w-32" /></TableHead>
              <TableHead className="text-center"><Skeleton className="h-5 w-24 mx-auto" /></TableHead>
              <TableHead className="text-center"><Skeleton className="h-5 w-16 mx-auto" /></TableHead>
              <TableHead className="text-center"><Skeleton className="h-5 w-24 mx-auto" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="text-center"><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                <TableCell>
                    <div className='flex items-center gap-2'>
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </TableCell>
                <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                <TableCell>
                    <Skeleton className="h-8 w-8 ml-auto" />
                </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-48" />
      </CardFooter>
    </Card>
  );
}
