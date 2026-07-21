#!/usr/bin/env bash
# 维护脚本共用函数：定位项目、检查命令、读取配置与输出错误。

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# 输出普通进度信息。
info() {
  printf '\n%s\n' "$1"
}

# 输出错误并终止当前操作。
fail() {
  printf '\n错误：%s\n' "$1" >&2
  return 1
}

# 检查必要命令是否存在。
require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "没有找到 $1。请先按 README 安装所需工具。"
}

# 从根配置读取一个字段。
read_config() {
  node "$PROJECT_ROOT/bin/read-config.mjs" "$1"
}

# 确保依赖已经安装；首次使用时自动安装。
ensure_dependencies() {
  require_command node
  require_command npm
  if [[ ! -d "$PROJECT_ROOT/node_modules" ]]; then
    info "首次使用，正在安装博客依赖……"
    npm install
  fi
}

# 确保当前目录已经初始化为 Git 仓库。
ensure_git_repository() {
  require_command git
  if [[ ! -d "$PROJECT_ROOT/.git" ]]; then
    info "正在初始化本地 Git 仓库……"
    git init -b "$(read_config repository.branch)"
  fi
}

# 确保已经配置 GitHub 远程仓库。
ensure_origin() {
  git remote get-url origin >/dev/null 2>&1 || fail "尚未配置 GitHub 远程仓库。请先完成 README 的“首次上传”步骤。"
}

# 在双击终端中保留错误信息，便于用户阅读。
pause_on_error() {
  local exit_code=$?
  if [[ $exit_code -ne 0 ]]; then
    printf '\n操作没有完成。请根据上面的提示处理后重试。\n'
    read -r -p "按回车键关闭窗口……" _
  fi
  exit "$exit_code"
}
