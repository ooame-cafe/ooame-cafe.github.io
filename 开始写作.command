#!/usr/bin/env bash
# 双击启动本地博客首页和网页写作后台。

set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
exec bash "$PROJECT_ROOT/bin/start-local.sh"
