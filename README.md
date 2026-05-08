# Nat OS Mission Control Dashboard Backup

This repository contains a source backup for Nathaniel Williams' local Nat OS Mission Control dashboard.

## What is included

- Next.js dashboard source
- TypeScript/Tailwind configuration
- API routes for vault, state, calendar sync, knowledge, trades, journal, and write-file workflows
- Local JSON data seed/state files
- Supabase SQL schema file
- Start script and deployment configuration

## What is intentionally excluded

- `node_modules/`
- `.next/`
- `.env*` files and local secrets
- local build logs and transient TypeScript cache files

## Restore

Download `backups/nat-os-dashboard-source-2026-05-07.tar.gz.b64`, decode it, and extract it:

```bash
base64 -d nat-os-dashboard-source-2026-05-07.tar.gz.b64 > nat-os-dashboard-source-2026-05-07.tar.gz
mkdir nat-os-dashboard
cd nat-os-dashboard
tar -xzf ../nat-os-dashboard-source-2026-05-07.tar.gz
npm install
npm run build
./scripts/start-local.sh 3009
```

Then open:

```text
http://127.0.0.1:3009
```

## Verification at backup time

`npm run build` completed successfully locally before this backup was created.
