#!/usr/bin/env bash
# 在没有本地改动时，以快进方式获取 GitHub 上的最新版本。

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

trap pause_on_error ERR
ensure_dependencies
ensure_git_repository
ensure_origin

# 检查工作区是否适合直接更新。
if [[ -n "$(git status --porcelain)" ]]; then
  fail "本地还有未发布的改动。请先运行“同步发布”，或手动处理这些文件。"
fi

BRANCH="$(read_config repository.branch)"
info "正在检查 GitHub 更新……"
git fetch origin "$BRANCH"
git pull --ff-only origin "$BRANCH"
info "本地已经更新到最新版本。"
