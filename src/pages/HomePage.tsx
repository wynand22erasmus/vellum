/**
 * Marketing landing page with login CTA.
 *
 * @packageDocumentation
 */

import { Link } from 'react-router-dom';
import { VellumLogo } from '../components/vellum-logo.tsx';
import { Button } from '../components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card.tsx';

/** Public home route (`/`). */
export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="items-center">
          <VellumLogo variant="full" linked={false} />
          <CardTitle className="pt-2">Recipient dashboard</CardTitle>
          <CardDescription>
            Secure document transfer for regulated industries. Two-key access: email link plus file
            password.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            API upload: POST /api/upload with Authorization: Bearer API_KEY
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
