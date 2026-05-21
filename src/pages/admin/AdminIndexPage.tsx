/**
 * Admin overview: links to read-only data sections.
 *
 * @packageDocumentation
 */

import { Link } from 'react-router-dom';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card.tsx';

/** `/admin` landing cards. */
export function AdminIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Data browser</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Read-only views of Postgres data. Secrets (download tokens, password hashes, object keys)
          are never shown.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        <li>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">
                <Link
                  to="/admin/documents"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Documents
                </Link>
              </CardTitle>
              <CardDescription>All uploads: lifecycle, recipient, storage state.</CardDescription>
            </CardHeader>
          </Card>
        </li>
        <li>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">
                <Link
                  to="/admin/users"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Users
                </Link>
              </CardTitle>
              <CardDescription>Dashboard accounts and roles.</CardDescription>
            </CardHeader>
          </Card>
        </li>
        <li>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">
                <Link
                  to="/admin/audit-logs"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Audit logs
                </Link>
              </CardTitle>
              <CardDescription>Compliance events with optional filters.</CardDescription>
            </CardHeader>
          </Card>
        </li>
        <li>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">
                <Link
                  to="/admin/failed-audit-logs"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Failed audit queue
                </Link>
              </CardTitle>
              <CardDescription>Dead-letter payloads when audit enqueue fails.</CardDescription>
            </CardHeader>
          </Card>
        </li>
      </ul>
    </div>
  );
}
