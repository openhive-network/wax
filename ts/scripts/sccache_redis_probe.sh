# Sourced (not executed) before a wasm build: it changes the caller's environment.
#
# sccache 0.8.1 fails every compile when its redis backend cannot be reached at
# server start instead of falling back to a cache miss, and `sccache --show-stats`
# does not contact the backend, so it cannot detect that. This probe talks the redis
# protocol to the SCCACHE_REDIS backend with a short timeout and, when no answer
# comes, unsets SCCACHE_REDIS and sets WAX_DISABLE_COMPILER_CACHE (read by
# ts/wasm/src/CMakeLists.txt) so the build runs uncached instead of failing.

_sccache_redis_probe() {
  local hostport host port reply

  [ -n "${SCCACHE_REDIS:-}" ] || return 0

  hostport="${SCCACHE_REDIS#redis://}"
  hostport="${hostport%%/*}"
  hostport="${hostport##*@}"
  host="${hostport%:*}"
  port="${hostport##*:}"
  [ "${port}" != "${hostport}" ] || port=6379

  # A server requiring a password answers PING with -NOAUTH; it is up, sccache authenticates itself.
  if reply="$(timeout 3 bash -c \
      'exec 3<>"/dev/tcp/$1/$2" && printf "PING\r\n" >&3 && read -r line <&3 && printf "%s" "${line}"' \
      _ "${host}" "${port}" 2>/dev/null)" && [[ "${reply}" == +PONG* || "${reply}" == -NOAUTH* ]]; then
    echo "sccache redis ${host}:${port} answers - building with the compiler cache"
    return 0
  fi

  echo "WARNING: sccache redis ${host}:${port} unreachable - building without compiler cache"
  export WAX_DISABLE_COMPILER_CACHE=1
  unset SCCACHE_REDIS
}

_sccache_redis_probe
unset -f _sccache_redis_probe
