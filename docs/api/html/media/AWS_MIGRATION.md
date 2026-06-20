# AWS Migration Guide

This document summarizes the AWS migration plan from the Vellum design document (§13). Execute only after the local Docker stack is stable.

## Service mapping

| Local | AWS | Migration effort |
|-------|-----|------------------|
| Postgres container | RDS PostgreSQL | Low — update `DATABASE_URL` |
| MinIO | S3 | Low — AWS SDK already abstracts both |
| Redis | ElastiCache Redis | Medium — update `REDIS_URL`, security groups |
| Node/React app | ECS Fargate | Medium — push image to ECR |
| Nginx | ALB + ACM | Medium — replace reverse proxy config |
| Mailpit | SES | Low — set `EMAIL_PROVIDER=ses` |
| WorkOS | WorkOS (unchanged) | None |
| ClamAV container | Lambda (S3 trigger) | High — separate project |

## Migration steps

1. Move secrets to **AWS Secrets Manager**; reference from ECS task definitions.
2. Sync MinIO bucket to S3: `aws s3 sync ...`
3. Migrate database: `pg_dump $LOCAL | psql $RDS`
4. Create VPC with private subnets for RDS and ElastiCache; ECS tasks behind ALB.
5. Build and push Docker images to **ECR**; define Fargate service.
6. Replace Nginx with **ALB**; use **ACM** for TLS.
7. Set `EMAIL_PROVIDER=ses` in Secrets Manager.
8. Replace ClamAV with Lambda on S3 `PutObject` events (async scan).

## Zero code change principle

Storage (S3 SDK + `forcePathStyle`), email (strategy pattern), and auth (WorkOS env vars) are designed so production differs only by environment configuration.
