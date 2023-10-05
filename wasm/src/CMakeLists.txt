PROJECT( WaxWASM )
cmake_minimum_required( VERSION 3.22.1 )

set( CMAKE_CXX_STANDARD 17 )
set( CMAKE_CXX_EXTENSIONS OFF )
set( CMAKE_CXX_STANDARD_REQUIRED ON )

set( CMAKE_C_STANDARD 99 )
set( CMAKE_C_STANDARD_REQUIRED ON )
set( CMAKE_EXECUTABLE_SUFFIX "" )

#SET( CMAKE_VERBOSE_MAKEFILE ON )

cmake_policy(SET CMP0057 NEW)

set(WAX_ROOT_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../..")
SET(HIVE_ROOT_PATH "${WAX_ROOT_PATH}/hive")

include( ${HIVE_ROOT_PATH}/cmake/hive_targets.cmake )

set(BOOST_COMPONENTS)
LIST(APPEND BOOST_COMPONENTS
      atomic
      chrono
      date_time
      filesystem
      program_options
      system)

set(HIVE_BUILD_ON_MINIMAL_FC ON)

add_subdirectory( ${HIVE_ROOT_PATH}/libraries/fc build_fc_minimal )
add_subdirectory( ${HIVE_ROOT_PATH}/libraries/schema build_schema_minimal )
add_subdirectory( ${HIVE_ROOT_PATH}/libraries/protocol build_protocol_minimal )

file(GLOB HEADERS "core/*.hpp")

set( SOURCES
      ${WAX_ROOT_PATH}/core/foundation.cpp
      wasm_interface.cpp
)

ADD_EXECUTABLE( wax_wasm ${SOURCES} ${HEADERS} )

set( INCLUDES "${WAX_ROOT_PATH}"
              "${WAX_ROOT_PATH}/core"
              "${HIVE_ROOT_PATH}/libraries/chain/include"
)

target_include_directories( wax_wasm PUBLIC ${INCLUDES} )
target_compile_options( wax_wasm PUBLIC -fexceptions )
target_link_libraries( wax_wasm PUBLIC embind hive_protocol idbfs.js )
# -sFORCE_FILESYSTEM=1 -sMODULARIZE=1 -sFILESYSTEM=1
target_link_options( wax_wasm PUBLIC -fexceptions -sMODULARIZE=1 -sEXPORT_ES6=1
                                     -sINITIAL_MEMORY=134217728 -sSINGLE_FILE=1 -sENVIRONMENT="web"
                                     -sUSE_ES6_IMPORT_META=0)

set_target_properties( wax_wasm PROPERTIES OUTPUT_NAME wax_wasm.js )

# Helper target, just to perform TypeScript wrapper generation
ADD_EXECUTABLE( wax_ts_gen ${SOURCES} )

target_include_directories( wax_ts_gen PUBLIC ${INCLUDES} )
target_compile_options( wax_ts_gen PUBLIC -fexceptions )
target_link_libraries( wax_ts_gen PUBLIC embind hive_protocol idbfs.js )

target_link_options( wax_ts_gen PUBLIC -fexceptions --embind-emit-tsd ${CMAKE_CURRENT_BINARY_DIR}/wax.d.ts )
set_target_properties( wax_ts_gen PROPERTIES OUTPUT_NAME wax_ts_gen.cjs )
