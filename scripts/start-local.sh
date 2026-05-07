#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

export PATH="/opt/homebrew/bin:$PATH"
exec /opt/homebrew/bin/npm run start -- --hostname 127.0.0.1 --port "${1:-3009}"
