
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Info } from "lucide-react";
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
  
  export default function AdminLeaderboardPage() {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard Management</CardTitle>
            <CardDescription>
              The leaderboard is now updated in real-time from the 'leaderboard' collection in Firestore.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>How to Update the Leaderboard</AlertTitle>
              <AlertDescription>
                <p>
                  To update the leaderboard, you can manually edit the documents in the <strong>leaderboard</strong> collection directly in the Firebase Console.
                </p>
                 <p className="mt-2">
                  Each document in the collection should follow the `leaderboard_entry` schema defined in `docs/backend.json`.
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }
  