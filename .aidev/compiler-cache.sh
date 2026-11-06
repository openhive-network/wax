# Sourced by the suites (run-checks.sh, run-rust.sh, run-python.sh) from the repo
# root as `source .aidev/compiler-cache.sh RECORD`: the compiler cache every wax
# build of the suite shares. RECORD (the suite's sccache.tsv) gets the backend
# chosen, and sccache-stats.log beside it every `sccache --show-stats` of the run
# (compiler_cache_stats), so a run's kept reports say which cache it used and how
# it hit (project.yaml's `reports:`).
#
# The cache is the host's site WebDAV cache when AIDEV hands one over
# (AIDEV_SCCACHE_WEBDAV_ENDPOINT, the Jefferson and Poland hosts), reached directly
# or, from the stack's internal network, through the relay's http://sccache:8090/
# (.aidev/sccache-relay.compose.yml). Otherwise, or when it does not answer near
# enough, it is CI's sccache Redis, reached through the same relay as
# redis://sccache:6379; WAX_SCCACHE_REDIS overrides that address (a run by hand on a
# network that reaches CI's Redis). ts/scripts/sccache_redis_probe.sh, the probe
# CI's builds source, PINGs Redis and, when it does not answer, prints one warning
# line and leaves every build uncached (cold) rather than failing; otherwise it
# routes the wasm, the Rust crates and the native CMake builds through sccache.
# Keys include absolute paths: suites build at /work, the fixed mount of every
# slot, under the fixed WebDAV prefix `wax`, so they hit each other's entries on
# every host of a site (not CI's, which builds under a runner-specific /builds/...
# path).

_wax_sccache_record="${1:?usage: source .aidev/compiler-cache.sh RECORD}"
unset SCCACHE_WEBDAV_ENDPOINT SCCACHE_WEBDAV_KEY_PREFIX
_wax_sccache_note=""

# A cache in another data centre answers, but reads a cached object at about
# 1 MB/s: a warm build there is slower than a cold one (rust suite 427 s warm vs
# 178 s uncached from a host 40 ms away; 0.8 ms away reads run at ~90 MB/s). So
# a cache is used only when a request's round trip, after the connection is up, is
# at most _WAX_SCCACHE_MAX_RTT_MS.
_WAX_SCCACHE_MAX_RTT_MS=10
_WAX_SCCACHE_WEBDAV_RELAY=http://sccache:8090/

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

# URL (http://host[:port]/[path]): the fastest round trip of three `HEAD <path>/healthz`
# after a first on the same connection, in ms (one sample on a loaded host can be
# several times the link's); fails unless every one answers 200.
_sccache_webdav_rtt_ms() {
    local rest="${1#http://}" hostport path port
    [ "$rest" != "$1" ] || return 1
    hostport="${rest%%/*}"
    path="/${rest#"$hostport"}"; path="${path#/}"; path="${path%/}/healthz"
    port="${hostport##*:}"
    [ "$port" != "$hostport" ] || port=80
    timeout 3 bash -c '
        exec 3<>"/dev/tcp/$1/$2" || exit 1
        # One write per request: printf with arguments writes in pieces, and the
        # server delays the ACK of the first piece by 40 ms on a warm connection.
        printf -v request "HEAD %s HTTP/1.1\r\nHost: %s\r\n\r\n" "$3" "$4"
        healthz() {
            local code line
            printf "%s" "$request" >&3
            read -r _ code _ <&3 || return 1
            while read -r line <&3 && [ -n "${line%$'"'\r'"'}" ]; do :; done
            [ "$code" = 200 ]
        }
        healthz || exit 1
        best=
        for _ in 1 2 3; do
            t0=$EPOCHREALTIME
            healthz || exit 1
            t1=$EPOCHREALTIME
            us=$(( ${t1//[.,]/} - ${t0//[.,]/} ))
            [ -n "$best" ] && [ "$best" -le "$us" ] || best=$us
        done
        echo $(( best / 1000 ))' _ "${hostport%:*}" "$port" "$path" "$hostport" 2>/dev/null
}

# Uses the site WebDAV cache when it answers within the gate, directly or through
# the relay; fails, leaving the choice to Redis, when there is none or it does not.
# Only sccache 0.10 or later reads it (.aidev/runtime/Dockerfile).
_wax_sccache_webdav() {
    local endpoint="${AIDEV_SCCACHE_WEBDAV_ENDPOINT:-}" url rtt
    [ -n "$endpoint" ] || return 1
    for url in "$endpoint" "$_WAX_SCCACHE_WEBDAV_RELAY"; do
        rtt="$(_sccache_webdav_rtt_ms "$url")" || continue
        if [ "$rtt" -gt "$_WAX_SCCACHE_MAX_RTT_MS" ]; then
            echo "WARNING: sccache webdav $endpoint answers through $url in ${rtt} ms (over ${_WAX_SCCACHE_MAX_RTT_MS} ms, too far for a cache hit to beat compiling)"
            continue
        fi
        echo "sccache webdav $endpoint answers through $url in ${rtt} ms - building with the compiler cache"
        export SCCACHE_WEBDAV_ENDPOINT="$url" SCCACHE_WEBDAV_KEY_PREFIX=wax
        unset SCCACHE_REDIS
        _wax_sccache_note="through $url, ${rtt} ms"
        return 0
    done
    echo "WARNING: sccache webdav $endpoint does not answer within ${_WAX_SCCACHE_MAX_RTT_MS} ms, directly or through $_WAX_SCCACHE_WEBDAV_RELAY - trying CI's sccache redis"
    return 1
}

_wax_sccache_near() {
    local hostport="${SCCACHE_REDIS#redis://}" rtt
    hostport="${hostport%%/*}"; hostport="${hostport##*@}"
    # No answer is the probe's to report.
    rtt="$(_sccache_redis_rtt_ms "${hostport%:*}" "${hostport##*:}")" || { _wax_sccache_note="$SCCACHE_REDIS does not answer"; return 0; }
    _wax_sccache_note="${rtt} ms"
    [ "$rtt" -gt "$_WAX_SCCACHE_MAX_RTT_MS" ] || return 0
    echo "WARNING: sccache redis $hostport answers in ${rtt} ms (over ${_WAX_SCCACHE_MAX_RTT_MS} ms, too far for a cache hit to beat compiling) - building without compiler cache"
    _wax_sccache_note="$SCCACHE_REDIS answers in ${rtt} ms, over ${_WAX_SCCACHE_MAX_RTT_MS} ms"
    export WAX_DISABLE_COMPILER_CACHE=1
    unset SCCACHE_REDIS
}

if ! _wax_sccache_webdav; then
    export SCCACHE_REDIS="${WAX_SCCACHE_REDIS:-redis://sccache:6379}"
    _wax_sccache_near
fi
# shellcheck source=../ts/scripts/sccache_redis_probe.sh
source ts/scripts/sccache_redis_probe.sh

# backend (webdav, redis or none), the cache it names, and how it was reached or why
# none was used.
if [ -n "${WAX_DISABLE_COMPILER_CACHE:-}" ]; then
    printf 'none\t\t%s\n' "${_wax_sccache_note:-no cache answers}; building cold"
elif [ -n "${SCCACHE_WEBDAV_ENDPOINT:-}" ]; then
    printf 'webdav\t%s\t%s\n' "$AIDEV_SCCACHE_WEBDAV_ENDPOINT" "$_wax_sccache_note"
elif [ -n "${SCCACHE_REDIS:-}" ]; then
    printf 'redis\t%s\t%s\n' "$SCCACHE_REDIS" "$_wax_sccache_note"
fi > "$_wax_sccache_record"
echo "sccache backend: $(cut -f1,2 "$_wax_sccache_record" | tr '\t' ' ')"

# Started afresh for every run (the python and rust suites keep their output
# directory), and never empty without a cache, so the declared report always exists.
_wax_sccache_stats="$(dirname "$_wax_sccache_record")/sccache-stats.log"
if [ -n "${WAX_DISABLE_COMPILER_CACHE:-}" ]; then
    printf 'no sccache stats: building without compiler cache (%s)\n' "$(cut -f3 "$_wax_sccache_record")"
fi > "$_wax_sccache_stats"

unset -f _sccache_redis_rtt_ms _sccache_webdav_rtt_ms _wax_sccache_webdav _wax_sccache_near
unset _WAX_SCCACHE_MAX_RTT_MS _WAX_SCCACHE_WEBDAV_RELAY _wax_sccache_record _wax_sccache_note

# Prints sccache's hit and miss counts, when this run uses it, and appends them to
# the suite's sccache-stats.log.
compiler_cache_stats() {
    [ -z "${WAX_DISABLE_COMPILER_CACHE:-}" ] || return 0
    { sccache --show-stats || true; } | tee -a "$_wax_sccache_stats"
}
