#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: bash bun.sh [options] -- <bun arguments...>
  --project DIR    Workspace root to mount (default: current directory)
  --image IMAGE    Required Bun image; choose a project-compatible version
  --port PORT      Publish the same container port on host 127.0.0.1 (repeatable)
  --host-network   Use host networking instead of port publishing
  --name NAME      Container name, useful for docker stop
  --detach         Run in background and return the container ID
  --help           Show this help
EOF
}

fail() { printf '%s\n' "$*" >&2; exit 2; }
project="$PWD"
image=
network=bridge
detach=false
ports=()
extra=()
while (($#)); do
  case "$1" in
    --project|--image|--port|--name)
      (($# >= 2)) || fail "Missing value for $1"
      case "$1" in
        --project) project="$2" ;;
        --image) image="$2" ;;
        --port)
          [[ "$2" =~ ^[0-9]{1,5}$ ]] || fail "Invalid port"
          port=$((10#$2))
          ((port >= 1 && port <= 65535)) || fail "Invalid port"
          ports+=(--publish "127.0.0.1:$port:$port") ;;
        --name)
          [[ "$2" =~ ^[a-zA-Z0-9][a-zA-Z0-9_.-]*$ ]] || fail "Invalid container name"
          extra+=(--name "$2") ;;
      esac
      shift 2 ;;
    --host-network) network=host; shift ;;
    --detach) detach=true; shift ;;
    --help) usage; exit 0 ;;
    --) shift; break ;;
    *) fail "Unknown option: $1; use -- before Bun arguments" ;;
  esac
done
(($#)) || fail "Bun arguments required; use --help"
[[ -n "$image" && "$image" != -* ]] || fail "A valid --image is required"
[[ "$network" != host || ${#ports[@]} == 0 ]] || fail "Do not combine --host-network with --port"
project=$(cd -- "$project" && pwd -P)
[[ "$project" != / && "$project" != *,* ]] || fail "Unsupported workspace path"
[[ -f "$project/package.json" ]] || fail "Choose a workspace containing package.json"
command -v docker >/dev/null || fail "Docker is not installed"
docker info >/dev/null || fail "Docker daemon is unavailable or access was denied"
if "$detach"; then
  extra+=(--detach)
elif [[ -t 0 && -t 1 ]]; then
  extra+=(-it)
fi
exec docker run --rm --init \
  --user "$(id -u):$(id -g)" --env HOME=/tmp \
  --mount "type=bind,source=$project,target=/workspace" \
  --workdir /workspace --network "$network" \
  ${ports[@]+"${ports[@]}"} ${extra[@]+"${extra[@]}"} "$image" bun "$@"
