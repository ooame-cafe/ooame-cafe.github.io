#!/usr/bin/env bash
# 双击创建一份带时间标记的本地 ZIP 备份。

set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
bash "$PROJECT_ROOT/bin/backup.sh"
read -r -p "按回车键关闭窗口……" _
