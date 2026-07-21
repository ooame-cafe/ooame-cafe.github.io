#!/usr/bin/env bash
# 先发布到 GitHub；若已配置 Gitee，再同步一份远程备份。

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

bash "$SCRIPT_DIR/sync-github.sh" "${@:-}"
if git remote get-url gitee >/dev/null 2>&1; then
  bash "$SCRIPT_DIR/sync-gitee.sh"
else
  printf '\n未配置 Gitee，已跳过远程备份。\n'
fi
