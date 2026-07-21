#!/usr/bin/env bash
# 创建不含依赖、构建产物和 Git 历史的本地 ZIP 备份。

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

trap pause_on_error ERR
ensure_dependencies
require_command zip

BACKUP_SETTING="$(read_config tooling.backup_dir)"
if [[ "$BACKUP_SETTING" = /* ]]; then
  BACKUP_DIR="$BACKUP_SETTING"
else
  BACKUP_DIR="$PROJECT_ROOT/$BACKUP_SETTING"
fi
mkdir -p "$BACKUP_DIR"

STAMP="$(date '+%Y%m%d-%H%M%S')"
TARGET="$BACKUP_DIR/shiso-everforest-blog-$STAMP.zip"

info "正在创建本地备份……"
zip -rq "$TARGET" . \
  -x "node_modules/*" "public/*" ".git/*" "*.zip" ".DS_Store" "db.json"

info "备份完成：$TARGET"
