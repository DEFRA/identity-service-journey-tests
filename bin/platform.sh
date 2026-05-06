#!/usr/bin/env bash
set -euo pipefail

# ------------------------------------------------------------
# Resolve ROOT_DIR to the identity services parent folder
# Works locally AND in GitHub Actions
# ------------------------------------------------------------
if [ -z "${ROOT_DIR:-}" ]; then
	export ROOT_DIR="$(cd "$(dirname "$0")/../../" && pwd)"
fi

# ------------------------------------------------------------
# Resolve other repo paths relative to identity services parent folder
# ------------------------------------------------------------
IDENTITY_SERVICE_BACKEND_DIR="$ROOT_DIR/identity-service-helper"
IDENTITY_SERVICE_PARENT_DIR="$ROOT_DIR"
IDENTITY_SERVICE_FRONTEND_DIR="$ROOT_DIR/identity-service-handler"

SERVICE="${1:-frontend}"
COMMAND="${2:-help}"

ensure_network() {
	if ! docker network inspect identity-services >/dev/null 2>&1; then
		echo "[platform] Creating identity-services network..."
		docker network create identity-services
	fi
}

start_backend() {
	echo "[platform] Starting identity service helper..."
	cd "$IDENTITY_SERVICE_BACKEND_DIR"

	if [ "${CI:-}" = "true" ]; then
		echo "[platform] Using backend compose file: compose.override.yml detached"
		docker compose -p identity-services -f compose.override.yml up --build -d
	else
		echo "[platform] Using backend compose file: compose.override.yml"
		docker compose -p identity-services -f compose.override.yml up --build
	fi

	return $?
}

stop_backend() {
	echo "[platform] Stopping identity service helper..."
	cd "$IDENTITY_SERVICE_BACKEND_DIR"
	docker compose -p identity-services -f compose.override.yml down || true
	return $?
}

start_ui() {
	echo "[platform] Starting identity service handler..."
	cd "$IDENTITY_SERVICE_FRONTEND_DIR"

	if [ "${CI:-}" = "true" ]; then
		echo "[platform] Using UI compose file: compose.override.yml detached"
		docker compose -p identity-services -f compose.override.yml up --build -d
	else
		echo "[platform] Using UI compose file: compose.override.yml"
		docker compose -p identity-services -f compose.override.yml up --build
	fi

	return $?
}

stop_ui() {
	echo "[platform] Stopping identity service handler..."
	cd "$IDENTITY_SERVICE_FRONTEND_DIR"
	docker compose -p identity-services -f compose.override.yml down || true
	return $?
}

case "$SERVICE" in
frontend)
	case "$COMMAND" in
	up)
		ensure_network
		start_ui
		;;
	down)
		stop_ui
		;;
	*)
		echo "Usage:"
		echo "  ./platform.sh frontend up     # Start frontend only"
		echo "  ./platform.sh frontend down   # Stop frontend only"
		;;
	esac
	;;
backend)
	case "$COMMAND" in
	up)
		ensure_network
		start_backend
		;;
	down)
		stop_backend
		;;
	*)
		echo "Usage:"
		echo "  ./platform.sh backend up     # Start backend only"
		echo "  ./platform.sh backend down   # Stop backend only"
		;;
	esac
	;;
*)
	echo "Usage:"
	echo "  ./platform.sh frontend up     # Start frontend only"
	echo "  ./platform.sh frontend down   # Stop frontend only"
	echo "  ./platform.sh backend up      # Start backend only"
	echo "  ./platform.sh backend down    # Stop backend only"
	;;
esac
