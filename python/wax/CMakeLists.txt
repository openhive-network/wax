SET(HIVE_ROOT_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../../hive")
# Main facade module (cpp_python_bridge.pyx → cpp_python_bridge.cpp)
SET(WAX_CPP_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cpp_python_bridge.cpp")

# Directory containing generated .cpp files from Cython sub-modules
SET(CYTHON_BUILD_DIR "${CMAKE_CURRENT_SOURCE_DIR}/.cython_build")

# List all sub-module .cpp files explicitly (required for Ninja)
# Cython generates files in flat structure: .cython_build/cython_modules_<name>.cpp
SET(CYTHON_MODULE_SOURCES
  ${WAX_CPP_PATH}
  "${CYTHON_BUILD_DIR}/cython_modules_common.cpp"
  "${CYTHON_BUILD_DIR}/cython_modules_handles.cpp"
  "${CYTHON_BUILD_DIR}/cython_modules_validation.cpp"
  "${CYTHON_BUILD_DIR}/cython_modules_crypto.cpp"
  "${CYTHON_BUILD_DIR}/cython_modules_assets.cpp"
  "${CYTHON_BUILD_DIR}/cython_modules_transactions.cpp"
  "${CYTHON_BUILD_DIR}/cython_modules_operations.cpp"
  "${CYTHON_BUILD_DIR}/cython_modules_proto.cpp"
  "${CYTHON_BUILD_DIR}/cython_modules_witness.cpp"
  "${CYTHON_BUILD_DIR}/cython_modules_memo.cpp"
  "${CYTHON_BUILD_DIR}/cython_modules_authority.cpp"
  "${CYTHON_BUILD_DIR}/cython_modules_testing.cpp"
)

LIST(APPEND CMAKE_MODULE_PATH
  "${CMAKE_CURRENT_SOURCE_DIR}/cmake"
  "${HIVE_ROOT_PATH}/cmake"
  "${HIVE_ROOT_PATH}/libraries/fc/CMakeModules"
  "${HIVE_ROOT_PATH}/libraries/fc/GitVersionGen"
)

project(wax)
cmake_minimum_required(VERSION 3.22.1)

find_package(PythonExtensions REQUIRED)

SET(CMAKE_POSITION_INDEPENDENT_CODE ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
#set(CMAKE_CXX_FLAGS -g)

set(CMAKE_EXPORT_COMPILE_COMMANDS "ON")
set(CMAKE_VERBOSE_MAKEFILE "ON")

# Set OpenSSL paths from environment variables (set in Docker image)
# These must be set before including hive_targets which calls find_package(OpenSSL)
if(DEFINED ENV{OPENSSL_ROOT_DIR})
  set(OPENSSL_ROOT_DIR "$ENV{OPENSSL_ROOT_DIR}" CACHE PATH "OpenSSL root directory")
endif()
if(DEFINED ENV{OPENSSL_INCLUDE_DIR})
  set(OPENSSL_INCLUDE_DIR "$ENV{OPENSSL_INCLUDE_DIR}" CACHE PATH "OpenSSL include directory")
endif()

include(hive_targets)

SET( BOOST_COMPONENTS )
LIST( APPEND  BOOST_COMPONENTS
      # atomic
      chrono
      context
      coroutine
      # date_time
      filesystem
      # iostreams
      # locale
      # regex
      # system: header-only since boost 1.69; stub + cmake config removed in 1.89
      thread
      # program_options
      unit_test_framework )

set( GENERATED_ASSERT_ID_DIR ${CMAKE_CURRENT_BINARY_DIR}/generated_assert_id )
add_subdirectory("${HIVE_ROOT_PATH}/libraries/protocol" ${CMAKE_CURRENT_BINARY_DIR}/protocol)
add_subdirectory("${HIVE_ROOT_PATH}/libraries/fc" ${CMAKE_CURRENT_BINARY_DIR}/fc)
add_subdirectory("${HIVE_ROOT_PATH}/libraries/schema" ${CMAKE_CURRENT_BINARY_DIR}/schema)
add_subdirectory("${HIVE_ROOT_PATH}/libraries/chain" ${CMAKE_CURRENT_BINARY_DIR}/chain EXCLUDE_FROM_ALL)
add_subdirectory("${HIVE_ROOT_PATH}/assertion_id_verifier" ${CMAKE_CURRENT_BINARY_DIR}/assertion_id_verifier)

file(GLOB HEADERS "${CMAKE_CURRENT_SOURCE_DIR}/../../core/*.hpp" "cpython_interface.hpp")

add_python_library("cpp_python_bridge" MODULE SOURCES
  ${CYTHON_MODULE_SOURCES}
  ${CMAKE_CURRENT_SOURCE_DIR}/../../core/exception.cpp
  ${CMAKE_CURRENT_SOURCE_DIR}/../../core/foundation.cpp
  ${CMAKE_CURRENT_SOURCE_DIR}/../../core/utils.cpp
  ${CMAKE_CURRENT_SOURCE_DIR}/../../core/binary_view_helper.cpp
  ${CMAKE_CURRENT_SOURCE_DIR}/../../core/signing_keys_collector.cpp
  ${CMAKE_CURRENT_SOURCE_DIR}/../../core/minimize_required_signatures_helper.cpp
  cpython_interface.cpp
  ${HEADERS}
  LINK_LIBRARIES hive_protocol)

target_include_directories("cpp_python_bridge" PRIVATE
  "${CMAKE_CURRENT_SOURCE_DIR}"
  "${CMAKE_CURRENT_SOURCE_DIR}/../../"
  "${CMAKE_CURRENT_SOURCE_DIR}/../../core"
  "${CYTHON_BUILD_DIR}"
  "${HIVE_ROOT_PATH}/libraries/chain/include"
  "${GENERATED_ASSERT_ID_DIR}"
)

add_dependencies( "cpp_python_bridge" assertion_id_verifier )

python_extension_module("cpp_python_bridge")

file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/cpython_interface.hpp DESTINATION ${CMAKE_CURRENT_BINARY_DIR})

# Export PyInit_* symbols for Python module loading
# PythonExtensions generates a version script at:
#   ${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/cpp_python_bridge-version-script.map
# that only exports PyInit_cpp_python_bridge and hides everything else.
#
# We need to also export PyInit_* for all Cython sub-modules so Python can load them
# via hard links to the main .so file.
#
# Solution: Overwrite the auto-generated version script with one that exports all PyInit_* symbols.
# Using file(GENERATE ...) ensures this happens at generation time, after PythonExtensions creates its file.
set(VERSION_SCRIPT_PATH "${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/cpp_python_bridge-version-script.map")
file(GENERATE OUTPUT "${VERSION_SCRIPT_PATH}" CONTENT "{global: PyInit_cpp_python_bridge; PyInit_cython_modules_*; local: *;};\n")

target_link_options("cpp_python_bridge" PRIVATE -static-libgcc -static-libstdc++)

# Link static versions of OpenSSL, ZLIB, and BZip2 for wheel portability
# Use --as-needed to avoid recording unused dynamic library dependencies
# Static libs linked first so their symbols take precedence over dynamic ones from hive_protocol
target_link_options("cpp_python_bridge" PRIVATE "LINKER:--as-needed")
target_link_libraries("cpp_python_bridge"
  /usr/local/lib/libssl.a
  /usr/local/lib/libcrypto.a
  /usr/local/lib/libz.a
  /usr/local/lib/libbz2.a
)

INSTALL(TARGETS
  "cpp_python_bridge"

  RUNTIME DESTINATION bin
  LIBRARY DESTINATION lib
  ARCHIVE DESTINATION lib
)
