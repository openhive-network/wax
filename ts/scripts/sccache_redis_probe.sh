# Sourced (not executed) before a build: it changes the caller's environment.
#
# sccache 0.8.1 fails every compile when its redis backend cannot be reached at
# server start instead of falling back to a cache miss, and `sccache --show-stats`
# does not contact the backend, so it cannot detect that. This probe talks the redis
# protocol to the SCCACHE_REDIS backend with a short timeout and, when no answer
# comes, unsets SCCACHE_REDIS and sets WAX_DISABLE_COMPILER_CACHE (read by
# ts/wasm/src/CMakeLists.txt) so the build runs uncached instead of failing.
#
# Unless the cache is disabled, the native builds go through sccache too: cargo's
# rustc (RUSTC_WRAPPER, which also makes cc-rs wrap the cxx bridge and
# rust/wax/build.rs give the hive/core CMake build its launcher) and new CMake build
# trees (CMAKE_<LANG>_COMPILER_LAUNCHER, read by python/wax's). With the cache
# disabled, those naming sccache are unset, so nothing compiles through sccache.

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

_sccache_native_builds() {
  local var
  if [ -n "${WAX_DISABLE_COMPILER_CACHE:-}" ] || ! command -v sccache > /dev/null; then
    for var in RUSTC_WRAPPER CMAKE_C_COMPILER_LAUNCHER CMAKE_CXX_COMPILER_LAUNCHER; do
      [[ "${!var:-}" != *sccache ]] || unset "${var}"
    done
    return 0
  fi
  # sccache cannot cache incremental rustc compiles.
  export RUSTC_WRAPPER=sccache CARGO_INCREMENTAL=0 \
    CMAKE_C_COMPILER_LAUNCHER=sccache CMAKE_CXX_COMPILER_LAUNCHER=sccache
}

_sccache_redis_probe
_sccache_native_builds
unset -f _sccache_redis_probe _sccache_native_builds
