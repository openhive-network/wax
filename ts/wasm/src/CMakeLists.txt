PROJECT( WaxWASM )
cmake_minimum_required( VERSION 3.22.1 )

set( CMAKE_CXX_STANDARD 17 )
set( CMAKE_CXX_EXTENSIONS OFF )
set( CMAKE_CXX_STANDARD_REQUIRED ON )

set( CMAKE_C_STANDARD 99 )
set( CMAKE_C_STANDARD_REQUIRED ON )
set( CMAKE_EXECUTABLE_SUFFIX "" )

set(WAX_ROOT_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../../..")
SET(HIVE_ROOT_PATH "${WAX_ROOT_PATH}/hive")

include( ${HIVE_ROOT_PATH}/cmake/hive_targets.cmake )
include( ${HIVE_ROOT_PATH}/programs/beekeeper/beekeeper_wasm/cmake/wasm_project.cmake )

add_subdirectory( ${HIVE_ROOT_PATH}/libraries/schema build_schema_minimal )
add_subdirectory( ${HIVE_ROOT_PATH}/libraries/protocol build_protocol_minimal )

file(GLOB HEADERS "core/*.hpp")

set( SOURCES
      ${WAX_ROOT_PATH}/core/foundation.cpp
      ${WAX_ROOT_PATH}/core/binary_view_helper.cpp
      wasm_interface.cpp
)

set( INCLUDES "${WAX_ROOT_PATH}"
              "${WAX_ROOT_PATH}/core"
              "${HIVE_ROOT_PATH}/libraries/chain/include"
)

include("${CMAKE_CURRENT_SOURCE_DIR}/../../../hive/libraries/protocol/get_config.d/generate_get_config.cmake")
generate_get_config(
  "${CMAKE_CURRENT_SOURCE_DIR}/../../../hive/libraries/protocol/include/hive/protocol/config.hpp"  # path to config.hpp
  "${CMAKE_CURRENT_SOURCE_DIR}/get_config.d/config.ts.in"    # path to get_config template file
  "${CMAKE_CURRENT_BINARY_DIR}/config.ts"                    # output path
)
INSTALL( FILES  "${CMAKE_CURRENT_BINARY_DIR}/config.ts"
  COMPONENT "wax_config_ts"
  DESTINATION .
)

DEFINE_WASM_TARGET_FOR( wax
  TARGET_ENVIRONMENT "web"
  LINK_LIBRARIES hive_protocol
  LINK_OPTIONS -sALLOW_MEMORY_GROWTH=1 #-gsource-map=inline
  # show function names: -O0 -g3 --profiling-funcs -sDEMANGLE_SUPPORT=1
)

DEFINE_WASM_TARGET_FOR( wax
  TARGET_ENVIRONMENT "node"
  LINK_LIBRARIES hive_protocol
  LINK_OPTIONS -sALLOW_MEMORY_GROWTH=1 #-gsource-map=inline
  # show function names: -O0 -g3 --profiling-funcs -sDEMANGLE_SUPPORT=1
)
