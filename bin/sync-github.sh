#!/usr/bin/env bash
# 构建检查后，把本地改动安全同步到 GitHub 主分支。

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

trap pause_on_error ERR
ensure_dependencies
ensure_git_repository
ensure_origin

BRANCH="$(read_config repository.branch)"
MESSAGE="${*:-更新博客 $(date '+%Y-%m-%d %H:%M')}"

info "1/5 检查博客是否可以正常构建……"
npm run build

info "2/5 获取 GitHub 上的最新内容……"
git fetch origin "$BRANCH"
if git show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
  git pull --rebase --autostash origin "$BRANCH"
fi

info "3/5 整理本次改动……"
git add -A
if git diff --cached --quiet; then
  info "没有需要发布的新改动。"
  exit 0
fi

info "4/5 保存本次改动：$MESSAGE"
git commit -m "$MESSAGE"

info "5/5 上传到 GitHub……"
git push -u origin "$BRANCH"

info "同步完成。GitHub Actions 会自动更新公开网站。"
