#!/usr/bin/env bash
# 启动 Hexo 本地预览，并打开首页和 Sveltia 本地写作后台。

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
trap pause_on_error ERR

# 等待本地服务可访问，并在启动失败时返回错误。
wait_for_server() {
  local url=$1
  local server_pid=$2
  for _ in {1..40}; do
    if curl --silent --fail "$url" >/dev/null 2>&1; then
      return 0
    fi
    kill -0 "$server_pid" >/dev/null 2>&1 || return 1
    sleep 0.5
  done
  return 1
}

# 结束脚本时关闭由它启动的 Hexo 服务。
stop_server() {
  if [[ -n "${SERVER_PID:-}" ]]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}

ensure_dependencies
ensure_git_repository
npm run configure

PORT="$(read_config tooling.local_port)"
HOME_URL="http://localhost:${PORT}/"
ADMIN_URL="http://localhost:${PORT}/admin/index.html"

info "正在启动博客预览……"
npx hexo server --port "$PORT" &
SERVER_PID=$!
trap stop_server EXIT INT TERM

wait_for_server "$HOME_URL" "$SERVER_PID" || fail "本地服务未能启动，请查看上方日志。"
open "$HOME_URL"

if open -Ra "Google Chrome" >/dev/null 2>&1; then
  open -a "Google Chrome" "$ADMIN_URL"
  info "写作后台已在 Chrome 中打开。首次进入请选择“使用本地仓库”，再选择本项目文件夹。"
else
  info "首页已经打开。Sveltia 本地写作需要 Chrome、Edge 等 Chromium 浏览器，请安装后访问："
  printf '%s\n' "$ADMIN_URL"
fi

info "本地服务运行中。关闭这个终端窗口即可停止。"
wait "$SERVER_PID"
