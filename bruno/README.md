# Vellum Bruno workspace

API tests live in a [Bruno 3 workspace](https://docs.usebruno.com/get-started/bruno-basics/create-a-workspace) so the collection can be opened or run from any machine that can reach the API.

## Layout

```
bruno/
├── workspace.yml                 # Open this folder in Bruno
├── collections/
│   └── vellum-api/               # Collection root (bruno.json)
│       ├── environments/         # Local, Remote, Seeded (generated)
│       ├── fixtures/               # Sample upload file
│       └── 01-health … 06-request-link/
```

## Bruno app

1. Install [Bruno](https://www.usebruno.com/downloads) 3.0+.
2. **Open workspace** → select the `bruno/` directory (contains `workspace.yml`).
3. Open the **Vellum API** collection and choose an environment.

## CLI (from repo root)

| Script | Environment | Notes |
|--------|-------------|--------|
| `npm run test:api:smoke` | Local | No seed; health + upload negatives + auth + verify negatives |
| `npm run test:api` | Seeded | Runs seed, then full collection |
| `npm run test:api:remote` | Remote | Full collection against `Remote` env vars |

Run from the collection directory:

```bash
cd bruno/collections/vellum-api
bru run 01-health --env Local
bru run --env-file ./environments/Remote.bru 01-health
bru run 01-health --env Remote --env-var baseUrl=https://staging.example.com
```

## Testing from another host

1. Ensure the Vellum stack (or target deployment) is reachable from your machine.
2. Set **`E2E_BASE_URL`** to the API origin (no trailing slash), e.g. `https://vellum.example.com` or `http://192.168.1.10:5173`.
3. Set **`API_KEY`** if it differs from the dev default.
4. Edit **`environments/Remote.bru`** or pass overrides:

   ```bash
   export E2E_BASE_URL=https://your-host.example.com
   export API_KEY=your-api-key
   npm run test:e2e:seed    # writes Seeded.bru with live documentId / downloadToken
   npm run test:api         # or test:api:remote after updating Remote.bru
   ```

5. For smoke-only (no document seed):

   ```bash
   cd bruno/collections/vellum-api
   bru run 01-health 02-upload 03-auth 05-verify --env Remote \
     --env-var baseUrl=https://your-host.example.com \
     --env-var apiKey=your-api-key
   ```

Optional: copy the whole `bruno/` directory to another repo or machine; only `Seeded.bru` is gitignored and is recreated by the seed script.
