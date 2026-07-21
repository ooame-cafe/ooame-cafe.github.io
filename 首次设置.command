#!/usr/bin/env bash
# 双击运行博客首次设置向导。

set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
bash "$PROJECT_ROOT/bin/setup.sh"
read -r -p "按回车键关闭窗口……" _
