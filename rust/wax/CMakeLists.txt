cmake_minimum_required(VERSION 3.22.1)

list(APPEND CMAKE_MODULE_PATH
  "${CMAKE_CURRENT_SOURCE_DIR}/../../hive/cmake"
  "${CMAKE_CURRENT_SOURCE_DIR}/../../hive/libraries/fc/CMakeModules"
  "${CMAKE_CURRENT_SOURCE_DIR}/../../hive/libraries/fc/GitVersionGen"
)

# wax_core is the C++ static-library target consumed by the `wax` crate's
# build.rs (cmake build_target("wax_core")).
project(wax_core C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

set(WAX_ROOT "${CMAKE_CURRENT_SOURCE_DIR}/../..")
set(HIVE_ROOT_PATH "${WAX_ROOT}/hive")

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

if(DEFINED ENV{OPENSSL_ROOT_DIR})
  set(OPENSSL_ROOT_DIR "$ENV{OPENSSL_ROOT_DIR}" CACHE PATH "OpenSSL root directory")
endif()
if(DEFINED ENV{OPENSSL_INCLUDE_DIR})
  set(OPENSSL_INCLUDE_DIR "$ENV{OPENSSL_INCLUDE_DIR}" CACHE PATH "OpenSSL include directory")
endif()

include(hive_targets)

set(BOOST_COMPONENTS
  chrono
  context
  coroutine
  filesystem
  system
  thread
  unit_test_framework
)

set(GENERATED_ASSERT_ID_DIR ${CMAKE_CURRENT_BINARY_DIR}/generated_assert_id)

add_subdirectory("${HIVE_ROOT_PATH}/libraries/protocol"     ${CMAKE_CURRENT_BINARY_DIR}/protocol)
add_subdirectory("${HIVE_ROOT_PATH}/libraries/fc"           ${CMAKE_CURRENT_BINARY_DIR}/fc)
add_subdirectory("${HIVE_ROOT_PATH}/libraries/schema"       ${CMAKE_CURRENT_BINARY_DIR}/schema)
add_subdirectory("${HIVE_ROOT_PATH}/libraries/chain"        ${CMAKE_CURRENT_BINARY_DIR}/chain EXCLUDE_FROM_ALL)
add_subdirectory("${HIVE_ROOT_PATH}/assertion_id_verifier"  ${CMAKE_CURRENT_BINARY_DIR}/assertion_id_verifier)

add_library(wax_core STATIC
  ${WAX_ROOT}/core/exception.cpp
  ${WAX_ROOT}/core/foundation.cpp
  ${WAX_ROOT}/core/utils.cpp
  ${WAX_ROOT}/core/binary_view_helper.cpp
  ${WAX_ROOT}/core/signing_keys_collector.cpp
  ${WAX_ROOT}/core/minimize_required_signatures_helper.cpp
)

target_include_directories(wax_core PUBLIC
  ${WAX_ROOT}
  ${WAX_ROOT}/core
  ${HIVE_ROOT_PATH}/libraries/chain/include
  ${GENERATED_ASSERT_ID_DIR}
)

target_link_libraries(wax_core PUBLIC hive_protocol)
add_dependencies(wax_core assertion_id_verifier)
