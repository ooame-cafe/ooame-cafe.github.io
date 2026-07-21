#!/usr/bin/env bash
# 双击完成构建检查、提交并发布到 GitHub。

set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
bash "$PROJECT_ROOT/bin/sync-github.sh"
read -r -p "按回车键关闭窗口……" _
