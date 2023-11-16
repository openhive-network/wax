#! /bin/bash

echo "Building Boost..."

set -xeuo pipefail

TMP_SRC=${1:?"Missing arg #1 to specify source temp directory"}
INSTALL_PREFIX=${2:?"Missing arg #2 to specify prebuilt libraries install prefix"}

echo "Entering directory: ${TMP_SRC}/boost/tools/build"

cd "${TMP_SRC}/boost/tools/build"

# Clean local mods if any
git checkout .

rm -vrf "${TMP_SRC}/boost_build/"

mkdir -vp "${TMP_SRC}/boost_build/"

echo "Entering directory: ${TMP_SRC}/boost"

cd "${TMP_SRC}/boost"

./bootstrap.sh --without-icu --prefix="${INSTALL_PREFIX}"

./b2 \
  --build-dir="${TMP_SRC}/boost_build/" \
  --prefix="${INSTALL_PREFIX}" \
  -j "$(nproc)" \
  -q \
  cxxflags=-fPIC \
  runtime-link=static \
  link=static \
  threading=multi \
  --with-chrono \
  --with-context \
  --with-coroutine \
  --with-filesystem \
  --with-system \
  --with-thread \
  --with-test \
  install

echo "Boost build finished."