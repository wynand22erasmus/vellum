/**
 * Shared auth shell (login-02 split layout + centered variant for verify flows).
 *
 * @packageDocumentation
 */

import type { ReactNode } from 'react';
import { FileCheck, Lock, ShieldCheck } from 'lucide-react';
import { BrandLogo, BrandTitle } from '@/components/brand/brand-logo';
import {
  AppSurfaceBackdrop,
  SurfaceAccentLine,
  elevatedSurfaceClassName,
} from '@/components/layout/app-surface';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useBrand } from '@/providers/brand-provider';
import { cn } from '@/lib/utils';

type AuthLayoutProps = {
  children: ReactNode;
  /** Split brand panel on lg+ (login); single column centered (verify). */
  variant?: 'split' | 'centered';
};

const BRAND_FEATURES = [
  { icon: ShieldCheck, label: 'Verified recipient access' },
  { icon: Lock, label: 'Password-protected downloads' },
  { icon: FileCheck, label: 'Audit-ready compliance trail' },
] as const;

function AuthBrandPanel() {
  const brand = useBrand();

  return (
    <div className="auth-brand-panel relative hidden flex-col justify-between overflow-hidden p-10 text-primary-foreground lg:flex lg:p-12 xl:p-14">
      <div
        className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-brand-accent/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 size-48 rounded-full bg-secondary/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/3 right-1/4 size-32 rounded-full blur-2xl"
        style={{ background: 'oklch(0.609 0.208 222 / 0.12)' }}
        aria-hidden
      />

      <div className="relative z-10">
        <BrandLogo variant="full" className="max-w-[13rem] brightness-0 invert drop-shadow-sm xl:max-w-[15rem]" />
      </div>

      <div className="relative z-10 max-w-md space-y-8">
        <blockquote className="space-y-3">
          {brand.wordmark ? (
            <p className="text-2xl font-semibold tracking-[0.14em] xl:text-3xl">{brand.wordmark}</p>
          ) : (
            <p className="text-2xl font-semibold xl:text-3xl">{brand.displayName}</p>
          )}
          <p className="text-base leading-relaxed text-primary-foreground/85">{brand.tagline}</p>
        </blockquote>

        <ul className="space-y-3.5">
          {BRAND_FEATURES.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-sm text-primary-foreground/90">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/10 ring-1 ring-primary-foreground/15 backdrop-blur-sm">
                <Icon className="size-4 text-brand-accent" aria-hidden />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <div className="h-1 w-12 rounded-full bg-brand-accent" aria-hidden />
        <p className="text-xs tracking-wide text-primary-foreground/60 uppercase">Trusted document delivery</p>
      </div>
    </div>
  );
}

function AuthFormBackdrop() {
  return <AppSurfaceBackdrop />;
}

/** Mobile-only brand header when the split panel is hidden. */
export function AuthMobileBrandHeader({ className }: { className?: string }) {
  const brand = useBrand();

  return (
    <div className={cn('flex flex-col items-center gap-3 text-center lg:hidden', className)}>
      <BrandLogo variant="full" className="max-w-[11rem]" />
      <p className="max-w-xs text-sm text-muted-foreground">{brand.tagline}</p>
    </div>
  );
}

/** Terms / Privacy row below auth cards. */
export function AuthLegalFooter({ className }: { className?: string }) {
  const brand = useBrand();
  const termsUrl = brand.legal?.termsUrl;
  const privacyUrl = brand.legal?.privacyUrl;

  if (!termsUrl && !privacyUrl) return null;

  return (
    <p className={cn('text-center text-xs text-muted-foreground', className)}>
      {termsUrl ? (
        <a
          href={termsUrl}
          className="underline underline-offset-2 transition-colors hover:text-foreground"
          target={termsUrl.startsWith('http') ? '_blank' : undefined}
          rel={termsUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          Terms of Service
        </a>
      ) : null}
      {termsUrl && privacyUrl ? <span className="mx-1.5 text-muted-foreground/60">·</span> : null}
      {privacyUrl ? (
        <a
          href={privacyUrl}
          className="underline underline-offset-2 transition-colors hover:text-foreground"
          target={privacyUrl.startsWith('http') ? '_blank' : undefined}
          rel={privacyUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          Privacy Policy
        </a>
      ) : null}
    </p>
  );
}

type AuthCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  showLogo?: boolean;
  showWordmark?: boolean;
  /** Elevated styling for the login card (accent bar, stronger shadow). */
  elevated?: boolean;
  className?: string;
};

/** Centered card for auth forms (title, description, body). */
export function AuthCard({
  title,
  description,
  children,
  showLogo = true,
  showWordmark = false,
  elevated = false,
  className,
}: AuthCardProps) {
  return (
    <Card
      className={cn(
        'relative w-full overflow-visible',
        elevatedSurfaceClassName,
        elevated
          ? 'max-w-[26rem] shadow-xl'
          : 'max-w-sm shadow-sm',
        className,
      )}
    >
      {elevated ? <SurfaceAccentLine className="inset-x-8" /> : null}
      <CardHeader className={cn('items-center pb-2', elevated ? 'space-y-3 pt-8' : 'space-y-4')}>
        {showLogo ? (
          <BrandLogo variant="full" className="max-w-[14rem] md:max-w-[16rem]" />
        ) : null}
        {showWordmark ? <BrandTitle className="pb-0" /> : null}
        <div className="space-y-1.5 text-center">
          <CardTitle className={cn(elevated && 'text-xl font-semibold tracking-tight')}>{title}</CardTitle>
          {description ? (
            <CardDescription className={cn(elevated && 'text-[0.9375rem] leading-relaxed')}>
              {description}
            </CardDescription>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className={cn(elevated && 'pb-8')}>{children}</CardContent>
    </Card>
  );
}

/** Page wrapper: split brand panel (login) or centered column (verify). */
export function AuthLayout({ children, variant = 'split' }: AuthLayoutProps) {
  if (variant === 'centered') {
    return (
      <div className="relative flex min-h-svh flex-1 flex-col items-center justify-center p-6 md:p-10">
        <AuthFormBackdrop />
        <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6">
          {children}
          <AuthLegalFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-[1.05fr_0.95fr] xl:grid-cols-2">
      <AuthBrandPanel />
      <div className="relative flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12">
        <AuthFormBackdrop />
        <div className="relative z-10 flex w-full max-w-[26rem] flex-col items-center gap-6">
          {children}
          <AuthLegalFooter />
        </div>
      </div>
    </div>
  );
}
