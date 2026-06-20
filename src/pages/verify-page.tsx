/**
 * Verify password page (form only — shell from `AuthLayout`).
 *
 * @packageDocumentation
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { problemActionRequired } from '@/lib/api';
import { apiGet, apiPost, ApiQueryError } from '@/lib/api-client';
import { PAGE_LABELS, panelDescription } from '@/lib/page-labels';
import { triggerFileDownload } from '@/lib/verify-routes';
import { storeVerifyChecksum } from '@/lib/verify-checksum';
import { AuthCard } from '@/components/layout/auth-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type MetaCaptcha = {
  provider: 'off' | 'hcaptcha';
  siteKey: string | null;
  required: boolean;
};

type VerifyStep = 'captcha' | 'password' | 'otp';

type VerifySuccess = {
  downloadUrl?: string;
  fileName?: string;
  sha256?: string;
  otpRequired?: boolean;
  otpSessionId?: string;
  otpChannel?: string;
  otpExpiresInSeconds?: number;
};

/** Password entry step for secure document download. */
export function VerifyPage() {
  const { token } = useParams({ strict: false }) as { token: string };
  const navigate = useNavigate();
  const captchaRef = useRef<HCaptcha>(null);

  const [captchaConfig, setCaptchaConfig] = useState<MetaCaptcha | null>(null);
  const [step, setStep] = useState<VerifyStep>('password');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);
  const [otpChannel, setOtpChannel] = useState<string | null>(null);
  const [otpExpiresIn, setOtpExpiresIn] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionRequired, setActionRequired] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const meta = await apiGet<{ captcha?: MetaCaptcha }>('/api/meta');
        if (cancelled) return;
        const captcha = meta.captcha ?? { provider: 'off', siteKey: null, required: false };
        setCaptchaConfig(captcha);
        setStep(captcha.required ? 'captcha' : 'password');
      } catch {
        setStep('password');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const finishDownload = useCallback(
    (data: VerifySuccess) => {
      if (!data.downloadUrl || !token) return;
      if (data.sha256) {
        storeVerifyChecksum(token, { sha256: data.sha256, fileName: data.fileName });
      }
      void navigate({
        to: '/verify/$token/complete',
        params: { token },
        replace: true,
      });
      triggerFileDownload(data.downloadUrl, data.fileName);
    },
    [navigate, token],
  );

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError(null);
    setActionRequired(null);
    try {
      const body: Record<string, string> = { token, password };
      if (captchaConfig?.required && captchaToken) {
        body.hcaptchaToken = captchaToken;
      }
      const data = await apiPost<VerifySuccess>('/api/verify', body);
      if (data.otpRequired && data.otpSessionId) {
        setOtpSessionId(data.otpSessionId);
        setOtpChannel(data.otpChannel ?? null);
        setOtpExpiresIn(data.otpExpiresInSeconds ?? null);
        setStep('otp');
        setOtpCode('');
        return;
      }
      finishDownload(data);
    } catch (err) {
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
      if (captchaConfig?.required) {
        setStep('captcha');
      }
      if (err instanceof ApiQueryError) {
        setError(err.message);
        const action = problemActionRequired(err.problem);
        if (action) setActionRequired(action);
        return;
      }
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !otpSessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiPost<VerifySuccess>('/api/verify/otp', {
        token,
        otpSessionId,
        code: otpCode,
      });
      finishDownload(data);
    } catch (err) {
      if (err instanceof ApiQueryError) {
        setError(err.message);
        return;
      }
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (!token || !otpSessionId || otpChannel === 'authenticator') return;
    setResendLoading(true);
    setError(null);
    try {
      const data = await apiPost<{ otpExpiresInSeconds?: number }>('/api/verify/otp/resend', {
        token,
        otpSessionId,
      });
      setOtpExpiresIn(data.otpExpiresInSeconds ?? null);
    } catch (err) {
      if (err instanceof ApiQueryError) {
        setError(err.message);
        return;
      }
      setError('Could not resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  }

  const captchaRequired = captchaConfig?.required === true;
  const passwordDisabled =
    loading || !token || (captchaRequired && step === 'captcha' && !captchaToken);

  const otpHint =
    otpChannel === 'authenticator'
      ? 'Enter the 6-digit code from your authenticator app.'
      : otpChannel === 'sms'
        ? 'Enter the code sent to your phone via SMS.'
        : otpChannel === 'whatsapp'
          ? 'Enter the code sent to your phone via WhatsApp.'
          : 'Enter the verification code sent to your email.';

  return (
    <AuthCard
      title={PAGE_LABELS.secureDocumentDownload.nav}
      description={`${panelDescription(PAGE_LABELS.secureDocumentDownload)} If the download fails, you may retry on the previous page before requesting a new email link.`}
      className="max-w-md"
      elevated
    >
      {step === 'captcha' && captchaConfig?.siteKey ? (
        <div className="mb-4 space-y-2">
          <Label>Security check</Label>
          <HCaptcha
            ref={captchaRef}
            sitekey={captchaConfig.siteKey}
            onVerify={(t) => {
              setCaptchaToken(t);
              setStep('password');
              setError(null);
            }}
            onExpire={() => {
              setCaptchaToken(null);
              setStep('captcha');
            }}
          />
        </div>
      ) : null}

      {step === 'otp' ? (
        <form onSubmit={(e) => void handleOtpSubmit(e)} className="space-y-4">
          <p className="text-sm text-muted-foreground">{otpHint}</p>
          {otpExpiresIn ? (
            <p className="text-xs text-muted-foreground">
              Code expires in {Math.max(1, Math.round(otpExpiresIn / 60))} minutes.
            </p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="otp">Verification code</Label>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
            />
          </div>
          {error ? (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading || !otpCode}>
            {loading ? 'Verifying…' : 'Confirm and download'}
          </Button>
          {otpChannel !== 'authenticator' ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={resendLoading}
              onClick={() => void handleResendOtp()}
            >
              {resendLoading ? 'Sending…' : 'Resend code'}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setStep(captchaRequired ? 'captcha' : 'password');
              setOtpSessionId(null);
              setOtpCode('');
              setError(null);
              captchaRef.current?.resetCaptcha();
              setCaptchaToken(null);
            }}
          >
            Back to password
          </Button>
        </form>
      ) : (
        <form onSubmit={(e) => void handlePasswordSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">File password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
              disabled={passwordDisabled && captchaRequired && !captchaToken}
            />
          </div>
          {captchaRequired && !captchaToken ? (
            <p className="text-sm text-muted-foreground">Complete the captcha above to continue.</p>
          ) : null}
          {error ? (
            <Alert variant="destructive" role="alert">
              <AlertDescription>
                {error}
                {actionRequired ? <p className="mt-2 opacity-90">{actionRequired}</p> : null}
              </AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" className="w-full" disabled={passwordDisabled}>
            {loading ? 'Verifying…' : 'Download document'}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
