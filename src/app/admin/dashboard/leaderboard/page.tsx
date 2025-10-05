import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardUploadForm } from "@/components/forms/leaderboard-upload-form";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminLeaderboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Update Leaderboard</CardTitle>
          <CardDescription>
            Upload a CSV file to update the student progress leaderboard data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaderboardUploadForm />
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>CSV File Format Instructions</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            Please ensure your CSV file has the following columns in order:
          </p>
          <code className="text-sm font-mono p-2 bg-muted rounded-md block">
            studentName,totalPoints,skillBadges,quests,genAIGames,profileId
          </code>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>studentName:</strong> Full name of the student.</li>
            <li><strong>totalPoints:</strong> Total points accumulated.</li>
            <li><strong>skillBadges:</strong> Number of skill badges earned.</li>
            <li><strong>quests:</strong> Number of quests completed.</li>
            <li><strong>genAIGames:</strong> Number of GenAI Arcade games completed.</li>
            <li><strong>profileId:</strong> The public URL of the student's Google Cloud Skills Boost profile.</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
