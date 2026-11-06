PROJECT( WaxWASM )
cmake_minimum_required( VERSION 3.22.1 )

set( CMAKE_CXX_STANDARD 17 )
set( CMAKE_CXX_EXTENSIONS OFF )
set( CMAKE_CXX_STANDARD_REQUIRED ON )

set( CMAKE_C_STANDARD 99 )
set( CMAKE_C_STANDARD_REQUIRED ON )
set( CMAKE_EXECUTABLE_SUFFIX "" )

# Use sccache or ccache for distributed compiler caching when available
# NO_CMAKE_FIND_ROOT_PATH needed because Emscripten toolchain restricts find_program to sysroot
find_program(SCCACHE_PROGRAM sccache NO_CMAKE_FIND_ROOT_PATH)
find_program(CCACHE_PROGRAM ccache NO_CMAKE_FIND_ROOT_PATH)
if(DEFINED ENV{WAX_DISABLE_COMPILER_CACHE})
  message(STATUS "Compiler cache disabled via WAX_DISABLE_COMPILER_CACHE")
elseif(SCCACHE_PROGRAM)
  message(STATUS "Found sccache: ${SCCACHE_PROGRAM}")
  set(CMAKE_C_COMPILER_LAUNCHER "${SCCACHE_PROGRAM}")
  set(CMAKE_CXX_COMPILER_LAUNCHER "${SCCACHE_PROGRAM}")
elseif(CCACHE_PROGRAM)
  message(STATUS "Found ccache: ${CCACHE_PROGRAM}")
  set(CMAKE_C_COMPILER_LAUNCHER "${CCACHE_PROGRAM}")
  set(CMAKE_CXX_COMPILER_LAUNCHER "${CCACHE_PROGRAM}")
endif()

set( CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -ftime-trace" )
set( CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -ftime-trace" )

set(WAX_ROOT_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../../..")
SET(HIVE_ROOT_PATH "${WAX_ROOT_PATH}/hive")

# Exclude VOPs from wasm build
add_compile_definitions(HIVE_PROTOCOL_SKIP_VOPS)

include( ${HIVE_ROOT_PATH}/cmake/hive_targets.cmake )
include( ${CMAKE_CURRENT_SOURCE_DIR}/wasm_project.cmake )

set( GENERATED_ASSERT_ID_DIR ${CMAKE_CURRENT_BINARY_DIR}/protocol )
add_subdirectory( ${HIVE_ROOT_PATH}/libraries/schema build_schema_minimal )
add_subdirectory( ${HIVE_ROOT_PATH}/libraries/protocol build_protocol_minimal )
set( SKIP_COMPRESSION_DICTIONARIES "TRUE" )
add_subdirectory( ${HIVE_ROOT_PATH}/libraries/chain build_no_chain EXCLUDE_FROM_ALL)
add_subdirectory( ${HIVE_ROOT_PATH}/assertion_id_verifier build_assertion_id_verifier_minimal )

file(GLOB HEADERS "core/*.hpp" "${CMAKE_CURRENT_SOURCE_DIR}/*.hpp")

set( SOURCES
      ${WAX_ROOT_PATH}/core/exception.cpp
      ${WAX_ROOT_PATH}/core/foundation.cpp
      ${WAX_ROOT_PATH}/core/utils.cpp
      ${WAX_ROOT_PATH}/core/binary_view_helper.cpp
      foundation_wasm.cpp
      wasm_interface.cpp
)

set( INCLUDES "${WAX_ROOT_PATH}"
              "${WAX_ROOT_PATH}/core"
              "${HIVE_ROOT_PATH}/libraries/chain/include"
              "${GENERATED_ASSERT_ID_DIR}"
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

# Both links install their wax.common.wasm to the same destination, so they must
# produce the same binary: keep the wasm-level passes shared and put only
# JS-glue options in each target's LINK_OPTIONS.
set( WAX_BINARYEN_EXTRA_PASSES
  -sBINARYEN_EXTRA_PASSES="--converge,--all-features,-Oz,--strip-debug,--strip-dwarf,--strip-producers,--remove-unused-names,--remove-unused-module-elements,--vacuum,--duplicate-function-elimination,--merge-similar-functions"
)

DEFINE_WASM_TARGET_FOR( wax
  TARGET_ENVIRONMENT "web"
  LINK_LIBRARIES hive_protocol
  LINK_OPTIONS -sNO_DYNAMIC_EXECUTION=1 -sALLOW_MEMORY_GROWTH=1 #-gsource-map=inline
  ${WAX_BINARYEN_EXTRA_PASSES}
  # show function names:
  # -O0 -g3 --profiling-funcs
)

DEFINE_WASM_TARGET_FOR( wax
  TARGET_ENVIRONMENT "node"
  LINK_LIBRARIES hive_protocol
  LINK_OPTIONS -sALLOW_MEMORY_GROWTH=1 #-gsource-map=inline
  ${WAX_BINARYEN_EXTRA_PASSES}
  # show function names:
  # -O0 -g3 --profiling-funcs
)

add_custom_target( wax.common.wasm.identity_check ALL
  COMMAND "${CMAKE_COMMAND}"
    "-DWEB_WASM=$<TARGET_FILE_DIR:wax.web>/wax.common.wasm"
    "-DNODE_WASM=$<TARGET_FILE_DIR:wax.node>/wax.common.wasm"
    -P "${CMAKE_CURRENT_SOURCE_DIR}/compare_wasm_binaries.cmake"
  COMMENT "Checking that the web and node wax.common.wasm are identical"
  VERBATIM
)
add_dependencies( wax.common.wasm.identity_check wax.web wax.node )

target_link_libraries( protocol_assertion_id_generator PUBLIC nodefs.js )
target_link_options( protocol_assertion_id_generator PUBLIC
    -sENVIRONMENT=node -sNODERAWFS=1
 )

set_target_properties( protocol_assertion_id_generator PROPERTIES
  OUTPUT_NAME "protocol_assertion_id_generator.cjs"
  )

target_link_libraries( chain_assertion_id_generator PUBLIC nodefs.js )
target_link_options( chain_assertion_id_generator PUBLIC
    -sENVIRONMENT=node -sNODERAWFS=1
 )

set_target_properties( chain_assertion_id_generator PROPERTIES
  OUTPUT_NAME "chain_assertion_id_generator.cjs"
  )

add_dependencies( wax.web protocol_assertion_id_verifier chain_assertion_id_verifier )
add_dependencies( wax.node protocol_assertion_id_verifier chain_assertion_id_verifier )
