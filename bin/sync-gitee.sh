#!/usr/bin/env bash
# 把当前主分支推送到可选的 Gitee 备份仓库。

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

ensure_dependencies
ensure_git_repository
git remote get-url gitee >/dev/null 2>&1 || fail "尚未配置名为 gitee 的远程仓库。"

BRANCH="$(read_config repository.branch)"
info "正在备份到 Gitee……"
git push gitee "$BRANCH"
info "Gitee 备份完成。"
