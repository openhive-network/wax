#!/bin/bash
set -e

# Produces a single self-contained static library
#   target/prelink/<profile>/libwax_native-<target-triple>.a
# from the C++ archives of the most recent cargo build:
#   1. partial link (ld -r) of all wax/hive archives plus *static* Boost,
#      OpenSSL, zlib and bz2, with --gc-sections rooted at the cxx bridge
#      symbols (the only symbols reachable from Rust),
#   2. strip of debug info and unneeded local symbols,
#   3. localization of every symbol except the bridge roots, so the bundle
#      cannot collide with a user's own OpenSSL/Boost/secp256k1 at final link,
#   4. link-and-run smoke test against system libs only, proving the bundle
#      needs no Boost/OpenSSL/hive checkout on the consuming machine.
#
# This is the local implementation of the "prelink and shrink" step that CI
# will eventually run once per target triple.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

WAX_PROFILE=${WAX_PROFILE:-debug}

for arg in "$@"; do
  case "$arg" in
    release|debug) WAX_PROFILE="$arg" ;;
    *) echo "Unknown argument: $arg" >&2; exit 1 ;;
  esac
done

CC_BIN=${CC:-cc}
CXX_BIN=${CXX:-c++}
TARGET_DIR="${CARGO_TARGET_DIR:-${SCRIPT_DIR}/target}"

# Builds the C++ from the hive submodule; regular `cargo build` never does
# this — it links the bundle this script produces.
CARGO_FLAGS=""
if [ "${WAX_PROFILE}" = "release" ]; then
  CARGO_FLAGS="--release"
fi
(cd "${SCRIPT_DIR}" && WAX_FROM_SOURCE=1 CARGO_TARGET_DIR="${TARGET_DIR}" \
  cargo build --quiet ${CARGO_FLAGS})

OUT_DIR=$(ls -dt "${TARGET_DIR}/${WAX_PROFILE}"/build/hiveio-wax-*/out 2>/dev/null | head -1)
if [ -z "${OUT_DIR}" ]; then
  echo "No build output under ${TARGET_DIR}/${WAX_PROFILE}/build" >&2
  exit 1
fi

BRIDGE_ARCHIVE="${OUT_DIR}/libcpp_rust_bridge.a"
if [ ! -f "${BRIDGE_ARCHIVE}" ]; then
  echo "Bridge archive not found: ${BRIDGE_ARCHIVE}" >&2
  exit 1
fi

# Locates a static library: BOOST_ROOT/OPENSSL_ROOT_DIR first (same precedence
# as build.rs), then the compiler's default search path.
find_static_lib() {
  local name="$1"
  local root sub candidate

  for root in "${BOOST_ROOT}" "${OPENSSL_ROOT_DIR}"; do
    [ -n "${root}" ] || continue
    for sub in lib lib64; do
      candidate="${root}/${sub}/${name}"
      if [ -f "${candidate}" ]; then
        echo "${candidate}"
        return 0
      fi
    done
  done

  candidate=$("${CC_BIN}" -print-file-name="${name}")
  if [ "${candidate}" != "${name}" ] && [ -f "${candidate}" ]; then
    echo "${candidate}"
    return 0
  fi

  echo "Static library ${name} not found; set BOOST_ROOT/OPENSSL_ROOT_DIR or install its -dev package." >&2
  return 1
}

# Same archive set build.rs links: the bridge plus everything CMake produced.
ARCHIVES=("${BRIDGE_ARCHIVE}")
while IFS= read -r archive; do
  ARCHIVES+=("${archive}")
done < <(find "${OUT_DIR}/build" -name '*.a' | sort)

# Folding static Boost/OpenSSL/zlib/bz2 into the bundle is what removes the
# corresponding -dev package requirement from consuming machines. libstdc++
# and libc deliberately stay dynamic: bundling a second C++ runtime breaks
# exception handling and RTTI in processes containing other C++ code.
for component in chrono context coroutine filesystem system thread; do
  ARCHIVES+=("$(find_static_lib "libboost_${component}.a")")
done
for lib in libssl.a libcrypto.a libz.a libbz2.a; do
  ARCHIVES+=("$(find_static_lib "${lib}")")
done

WORK_DIR="${TARGET_DIR}/prelink/${WAX_PROFILE}"
mkdir -p "${WORK_DIR}"

TRIPLE=$(rustc -vV | awk '/^host:/ {print $2}')
ARTIFACT="${WORK_DIR}/libwax_native-${TRIPLE}.a"
ROOTS="${WORK_DIR}/gc_roots.txt"
EXPORTS="${WORK_DIR}/exported_symbols.txt"
BUNDLE="${WORK_DIR}/wax_native.o"

# The cxx bridge symbols are the entire FFI surface reachable from Rust, so
# they are the garbage-collection roots: everything transitively unreachable
# from them can never be called and is dropped.
nm "${BRIDGE_ARCHIVE}" \
  | awk '$2 == "T" && $3 ~ /cxxbridge1\$/ {print "--undefined=" $3}' \
  | sort -u > "${ROOTS}"
sed 's/^--undefined=//' "${ROOTS}" > "${EXPORTS}"

ROOT_COUNT=$(wc -l < "${EXPORTS}")
if [ "${ROOT_COUNT}" -eq 0 ]; then
  echo "No cxxbridge symbols found in ${BRIDGE_ARCHIVE}" >&2
  exit 1
fi

echo "Prelinking ${#ARCHIVES[@]} archives, ${ROOT_COUNT} gc roots..."
# --force-group-allocation dissolves COMDAT groups: with them preserved, the
# final linker deduplicates identically-named groups across objects (e.g.
# against another prelinked bundle) and discards this bundle's copy, breaking
# its localized internal relocations.
ld -r --gc-sections --force-group-allocation "@${ROOTS}" \
  --start-group "${ARCHIVES[@]}" --end-group \
  -o "${BUNDLE}"

objcopy --strip-debug --strip-unneeded "${BUNDLE}"
objcopy --keep-global-symbols="${EXPORTS}" "${BUNDLE}"

# Prebuilt system archives (e.g. Boost) contain STB_GNU_UNIQUE symbols that
# objcopy cannot localize; rename them per bundle so they cannot clash with
# other prelinked bundles (e.g. beekeeper's) in the same binary.
UNIQUE_RENAMES="${WORK_DIR}/unique_renames.txt"
nm "${BUNDLE}" | awk '$2 == "u" {print $3 " wax_native$" $3}' > "${UNIQUE_RENAMES}"
if [ -s "${UNIQUE_RENAMES}" ]; then
  objcopy --redefine-syms="${UNIQUE_RENAMES}" "${BUNDLE}"
fi

# Self-containment check: an undefined Boost/OpenSSL/zlib/bz2 symbol here
# means a static archive was incomplete and the requirement would leak to
# consumers.
LEAKED=$(nm -u "${BUNDLE}" | grep -cE 'boost|SSL_|EVP_|CRYPTO_|BZ2_|inflate|deflate' || true)
if [ "${LEAKED}" -ne 0 ]; then
  echo "Bundle leaks ${LEAKED} undefined Boost/OpenSSL/zlib/bz2 symbols:" >&2
  nm -u "${BUNDLE}" | grep -E 'boost|SSL_|EVP_|CRYPTO_|BZ2_|inflate|deflate' | head >&2
  exit 1
fi

EXPORTED=$(nm "${BUNDLE}" | awk '$2 == "T"' | wc -l)
if [ "${EXPORTED}" -ne "${ROOT_COUNT}" ]; then
  echo "Expected ${ROOT_COUNT} exported symbols, got ${EXPORTED}" >&2
  exit 1
fi

rm -f "${ARTIFACT}"
ar rcs "${ARTIFACT}" "${BUNDLE}"

# The cxx crate compiles its C++ runtime (rust::cxxbridge1::String/Str/...)
# in its own build script and cargo links it into every consumer, so the
# bundle deliberately leaves those symbols undefined — the final binary must
# hold exactly one copy, the one matching the resolved cxx crate version.
# The smoke test stands in for cargo here and supplies it explicitly.
CXXBRIDGE_RUNTIME=$(ls -dt "${TARGET_DIR}/${WAX_PROFILE}"/build/cxx-*/out/libcxxbridge1.a 2>/dev/null | head -1)
if [ -z "${CXXBRIDGE_RUNTIME}" ]; then
  echo "libcxxbridge1.a not found under ${TARGET_DIR}/${WAX_PROFILE}/build" >&2
  exit 1
fi

# The remaining undefined cxxbridge symbols are implemented in Rust (the
# extern "Rust" half of the bridge plus cxx's Vec/String intrinsics); the wax
# rlib provides them in real builds, the smoke test stubs them — they are
# referenced by the link but never called.
RUST_SIDE="${WORK_DIR}/rust_side_symbols.txt"
{ nm -u "${BUNDLE}"; nm -u "${CXXBRIDGE_RUNTIME}"; } \
  | awk '{print $NF}' | grep -E 'cxxbridge1\$' | sort -u > "${RUST_SIDE}"

# Smoke test: reference every bridge symbol from a C++ program and link it
# against the bundle plus system libs only — no Boost, no OpenSSL, no hive.
# Running it executes the bundled C++ static initializers (.init_array). The
# try/catch forces this TU to define the exception personality reference
# (DW.ref.__gxx_personality_v0) the bundle's unwind tables need under PIE.
SMOKE_SRC="${WORK_DIR}/smoke_test.cc"
SMOKE_BIN="${WORK_DIR}/smoke_test"
{
  awk '{printf "extern \"C\" char sym_%d __asm__(\"%s\");\n", NR, $0}' "${EXPORTS}"
  awk '{printf "extern \"C\" void stub_%d() __asm__(\"%s\"); extern \"C\" void stub_%d() {}\n", NR, $0, NR}' "${RUST_SIDE}"
  echo "static const void* const refs[] = {"
  awk '{printf "    &sym_%d,\n", NR}' "${EXPORTS}"
  echo "};"
  echo "int main() { try { if (refs[0] == nullptr) throw 1; } catch (...) { return 1; } return 0; }"
} > "${SMOKE_SRC}"

"${CXX_BIN}" "${SMOKE_SRC}" "${ARTIFACT}" "${CXXBRIDGE_RUNTIME}" \
  -lpthread -ldl -o "${SMOKE_BIN}"
"${SMOKE_BIN}"

if ldd "${SMOKE_BIN}" | grep -qEi 'boost|libssl|libcrypto'; then
  echo "Smoke test binary dynamically links Boost/OpenSSL:" >&2
  ldd "${SMOKE_BIN}" | grep -Ei 'boost|libssl|libcrypto' >&2
  exit 1
fi

# Install the bundle into the crate and package it. A .crate file is what
# `cargo package` produces (a gzipped source tarball); crates.io enforces its
# 10 MB upload limit on exactly this file. The published crate carries the
# bundle at lib/libwax_native.a and build.rs links it whenever the hive
# sources are absent — i.e. on every consumer machine. The `cargo package`
# verify build compiles the packaged copy (which has no hive/), so it
# exercises exactly that prebuilt path.
CRATE_LIB_DIR="${SCRIPT_DIR}/lib"
mkdir -p "${CRATE_LIB_DIR}"
cp "${ARTIFACT}" "${CRATE_LIB_DIR}/libwax_native.a"

CRATE_VERSION=$(awk -F'"' '/^version = / {print $2; exit}' "${SCRIPT_DIR}/Cargo.toml")

# --allow-dirty: lib/libwax_native.a is a build artifact and stays untracked.
# The verify build gets its own target dir: the packaged copy has the same
# name+version as the repo crate, so sharing a target dir poisons cargo's
# fingerprints (the build script gets compiled against the packaged snapshot
# and never invalidates again).
(cd "${SCRIPT_DIR}" && CARGO_TARGET_DIR="${TARGET_DIR}/package-verify" \
  cargo package --allow-dirty --quiet)

CRATE_FILE="${TARGET_DIR}/package-verify/package/hiveio-wax-${CRATE_VERSION}.crate"
CRATE_BYTES=$(stat -c%s "${CRATE_FILE}")
if [ "${CRATE_BYTES}" -ge $((10 * 1024 * 1024)) ]; then
  echo "${CRATE_FILE} exceeds the crates.io 10 MB limit (${CRATE_BYTES} bytes)" >&2
  exit 1
fi

INPUT_TOTAL=$(du -ch "${ARCHIVES[@]}" | awk 'END {print $1}')
TEXT_BYTES=$(size "${BUNDLE}" | awk 'NR == 2 {print $1}')

echo
echo "OK: ${ARTIFACT}"
echo "  input archives:  ${INPUT_TOTAL} (${#ARCHIVES[@]} files)"
echo "  live code:       $(awk "BEGIN {printf \"%.1f\", ${TEXT_BYTES} / 1024 / 1024}") MB text"
echo "  artifact:        $(du -h "${ARTIFACT}" | cut -f1)"
echo "  exported syms:   ${EXPORTED} (bridge roots)"
echo "  smoke test:      linked against system libs only, ran OK"
echo "  crate:           ${CRATE_FILE}"
echo "  crate size:      $(awk "BEGIN {printf \"%.1f\", ${CRATE_BYTES} / 1024 / 1024}") MB (crates.io limit: 10 MB)"
