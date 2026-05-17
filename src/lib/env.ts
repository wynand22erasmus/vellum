function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  appUrl: optionalEnv('APP_URL', 'http://localhost:5173'),
  port: Number(optionalEnv('PORT', '3000')),
  apiKey: optionalEnv('API_KEY', 'dev-api-key-change-in-production'),
  databaseUrl: () => requireEnv('DATABASE_URL'),
  redisUrl: optionalEnv('REDIS_URL', 'redis://localhost:6379'),
  minioEndpoint: optionalEnv('MINIO_ENDPOINT', 'http://localhost:9000'),
  minioRootUser: optionalEnv('MINIO_ROOT_USER', 'minioadmin'),
  minioRootPassword: optionalEnv('MINIO_ROOT_PASSWORD', 'minioadmin'),
  minioBucket: optionalEnv('MINIO_BUCKET_NAME', 'vellum-documents'),
  awsRegion: optionalEnv('AWS_REGION', 'us-east-1'),
  clamavHost: optionalEnv('CLAMAV_HOST', 'localhost'),
  clamavPort: Number(optionalEnv('CLAMAV_PORT', '3310')),
  authProvider: optionalEnv('AUTH_PROVIDER', 'dev'),
  sessionSecret: optionalEnv('SESSION_SECRET', 'dev-session-secret-change-in-production'),
  workosApiKey: () => process.env.WORKOS_API_KEY,
  workosClientId: () => process.env.WORKOS_CLIENT_ID,
  workosRedirectUri: optionalEnv(
    'WORKOS_REDIRECT_URI',
    'http://localhost:5173/api/auth/callback',
  ),
  emailProvider: optionalEnv('EMAIL_PROVIDER', 'local'),
  mailpitHost: optionalEnv('MAILPIT_HOST', 'localhost'),
  mailpitPort: Number(optionalEnv('MAILPIT_PORT', '1025')),
  reportingLifetimeYears: Number(optionalEnv('REPORTING_LIFETIME_YEARS', '5')),
  maxUploadBytes: Number(optionalEnv('MAX_UPLOAD_BYTES', '52428800')),
  isProduction: optionalEnv('NODE_ENV', 'development') === 'production',
};
