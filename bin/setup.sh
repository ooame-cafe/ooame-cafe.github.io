#!/usr/bin/env bash
# 安装必要依赖，运行首次设置向导并生成派生配置。

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

trap pause_on_error ERR
ensure_dependencies
npm run setup
npm run configure
info "首次设置完成。"
