#!/usr/bin/env bash
# 双击获取 GitHub 上的最新博客内容。

set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
bash "$PROJECT_ROOT/bin/update-local.sh"
read -r -p "按回车键关闭窗口……" _
