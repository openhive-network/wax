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

# Override common options specific to exception handling for **WHOLE SET OF HIVE SPECIFIC MODULES**
TARGET_COMPILE_OPTIONS( CommonBuildOptions INTERFACE -fwasm-exceptions )
TARGET_LINK_OPTIONS( CommonBuildOptions INTERFACE -fwasm-exceptions
  -sEXPORT_EXCEPTION_HANDLING_HELPERS=1
  -sEXCEPTION_STACK_TRACES=1
 )

file(GLOB HEADERS "core/*.hpp")

set( SOURCES
      ${WAX_ROOT_PATH}/core/foundation.cpp
      wasm_interface.cpp
)

set( INCLUDES "${WAX_ROOT_PATH}"
              "${WAX_ROOT_PATH}/core"
              "${HIVE_ROOT_PATH}/libraries/chain/include"
)

function( DEFINE_WAX_TARGET_FOR env )
      set( exec_wasm_name "wax_wasm_${env}" )
      set( exec_ts_gen "wax_ts_gen_${env}" )

      message(NOTICE "Configuring '${exec_wasm_name}' and '${exec_ts_gen}'")

      ADD_EXECUTABLE( ${exec_wasm_name} ${SOURCES} )

      target_include_directories( ${exec_wasm_name} PUBLIC ${INCLUDES} )

      target_link_libraries( ${exec_wasm_name} PUBLIC embind hive_protocol )

      target_link_options( ${exec_wasm_name} PUBLIC
        -sMODULARIZE=1
        -sSINGLE_FILE=1
        -sEXPORT_ES6=1
        -sINITIAL_MEMORY=67108864
        # Decreases runtime performance for 50kB decrease in packed .tgz code size
        # --closure 1
        # -Os
      )
      set_target_properties( ${exec_wasm_name} PROPERTIES OUTPUT_NAME "wax.${env}.js" )
      INSTALL( TARGETS ${exec_wasm_name}
        COMPONENT "${exec_wasm_name}_runtime"
        RUNTIME DESTINATION .
        )

      # Helper target, just to perform TypeScript wrapper generation
      ADD_EXECUTABLE( ${exec_ts_gen} ${SOURCES} )

      target_include_directories( ${exec_ts_gen} PUBLIC ${INCLUDES} )
      target_link_libraries( ${exec_ts_gen} PUBLIC embind hive_protocol )

      set_target_properties( ${exec_ts_gen} PROPERTIES OUTPUT_NAME "wax_ts_gen.${env}.cjs" )
      target_link_options( ${exec_ts_gen} PUBLIC --embind-emit-tsd "${CMAKE_CURRENT_BINARY_DIR}/wax.${env}.d.ts" )
      INSTALL( FILES  "${CMAKE_CURRENT_BINARY_DIR}/wax.${env}.d.ts"
        COMPONENT "${exec_wasm_name}_dts"
        DESTINATION .
        )
endfunction()

DEFINE_WAX_TARGET_FOR(common)

target_link_options( wax_wasm_common PUBLIC -sUSE_ES6_IMPORT_META=1 -sENVIRONMENT="web,node" )
