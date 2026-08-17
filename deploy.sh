#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="ec2-13-232-187-83.ap-south-1.compute.amazonaws.com"
REMOTE_USER="ubuntu"
PEM_FILE="${PEM_FILE:-afsha.pem}"
REMOTE_DIR="/var/www/html"

if [ ! -f "$PEM_FILE" ]; then
  echo "Missing SSH key: $PEM_FILE"
  exit 1
fi

rsync -avz --delete -e "ssh -i \"$PEM_FILE\"" \
  --exclude '.git' \
  ./ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
