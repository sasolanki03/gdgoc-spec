import Link from 'next/link';
import { GoogleLogo } from '@/components/icons/google-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Admin Panel</CardTitle>
          <CardDescription>Sign in to manage the GDG SPEC website.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/dashboard">
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 56.5l-63.5 61.8C330.8 103.2 292.3 88 248 88c-77.5 0-140.3 62.8-140.3 140S170.5 396 248 396c43.2 0 79.9-18.5 106.1-47.5l63.5 61.8C379.2 475.2 319.1 504 248 504z"
                  ></path>
                </svg>
                Sign in with Google
              </Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Access is restricted to authorized personnel.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
