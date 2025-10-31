
'use server';

import 'server-only';

// This file is intentionally left empty. 
// The scraping logic has been moved to an AI flow `src/ai/flows/scrape-leaderboard-flow.ts`
// and the database operations are handled on the client-side in `src/app/admin/dashboard/leaderboard/page.tsx`.
// This avoids the need for Firebase Admin SDK on the server for this feature.
