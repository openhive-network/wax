# Sourced by the suites (run-checks.sh, run-rust.sh, run-python.sh) from the repo
# root: the compiler cache every wax build of the suite shares.
#
# The cache is CI's sccache Redis, reached through the stack's relay as
# redis://sccache:6379 (.aidev/sccache-relay.compose.yml); WAX_SCCACHE_REDIS
# overrides that address (a run by hand on a network that reaches CI's Redis).
# ts/scripts/sccache_redis_probe.sh, the probe CI's builds source, PINGs it and,
# when it does not answer, prints one warning line and leaves every build uncached
# (cold) rather than failing; otherwise it routes the wasm, the Rust crates and
# the native CMake builds through sccache. Keys include absolute paths: suites
# build at /work, the fixed mount of every slot, so they hit each other's entries
# (not CI's, which builds under a runner-specific /builds/... path).

export SCCACHE_REDIS="${WAX_SCCACHE_REDIS:-redis://sccache:6379}"

# A Redis in another data centre answers, but reads a cached object at about
# 1 MB/s: a warm build there is slower than a cold one (rust suite 427 s warm vs
# 178 s uncached from a host 40 ms away; 0.8 ms away reads run at ~90 MB/s). So
# the cache is used only when a PING round trip, after the connection is up, is
# at most _WAX_SCCACHE_MAX_RTT_MS.
_WAX_SCCACHE_MAX_RTT_MS=10

_sccache_redis_rtt_ms() {  # HOST PORT: the round trip of a second PING, in ms
    timeout 3 bash -c '
        exec 3<>"/dev/tcp/$1/$2" || exit 1
        printf "PING\r\n" >&3 && read -r _ <&3 || exit 1
        t0=$EPOCHREALTIME
        printf "PING\r\n" >&3 && read -r reply <&3 || exit 1
        t1=$EPOCHREALTIME
        [[ "$reply" == +PONG* ]] || exit 1
        echo $(( (${t1//[.,]/} - ${t0//[.,]/}) / 1000 ))' _ "$1" "$2" 2>/dev/null
}

_wax_sccache_near() {
    local hostport="${SCCACHE_REDIS#redis://}" rtt
    hostport="${hostport%%/*}"; hostport="${hostport##*@}"
    # No answer is the probe's to report.
    rtt="$(_sccache_redis_rtt_ms "${hostport%:*}" "${hostport##*:}")" || return 0
    [ "$rtt" -gt "$_WAX_SCCACHE_MAX_RTT_MS" ] || return 0
    echo "WARNING: sccache redis $hostport answers in ${rtt} ms (over ${_WAX_SCCACHE_MAX_RTT_MS} ms, too far for a cache hit to beat compiling) - building without compiler cache"
    export WAX_DISABLE_COMPILER_CACHE=1
    unset SCCACHE_REDIS
}

_wax_sccache_near
unset -f _sccache_redis_rtt_ms _wax_sccache_near; unset _WAX_SCCACHE_MAX_RTT_MS
# shellcheck source=../ts/scripts/sccache_redis_probe.sh
source ts/scripts/sccache_redis_probe.sh

# Prints sccache's hit and miss counts, when this run uses it.
compiler_cache_stats() {
    [ -z "${WAX_DISABLE_COMPILER_CACHE:-}" ] || return 0
    sccache --show-stats || true
}
