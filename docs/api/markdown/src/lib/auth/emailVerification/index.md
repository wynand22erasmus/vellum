# src/lib/auth/emailVerification

Email verification tokens and guards for dashboard sign-in.

## Remarks

Production users verify through WorkOS verification email.
Development users receive a Mailpit link via [createEmailVerificationToken](functions/createEmailVerificationToken.md).
`UserKind` `ADMIN` users skip verification. Set `SKIP_EMAIL_VERIFICATION=true`
only for local E2E (never in production).

## Variables

- [EMAIL\_NOT\_VERIFIED\_CODE](variables/EMAIL_NOT_VERIFIED_CODE.md)

## Functions

- [assertEmailVerified](functions/assertEmailVerified.md)
- [createEmailVerificationToken](functions/createEmailVerificationToken.md)
- [createPendingVerificationToken](functions/createPendingVerificationToken.md)
- [isEmailVerificationSatisfied](functions/isEmailVerificationSatisfied.md)
- [verifyEmailVerificationToken](functions/verifyEmailVerificationToken.md)
- [verifyPendingVerificationToken](functions/verifyPendingVerificationToken.md)
