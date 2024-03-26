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

set( INCLUDES "${WAX_ROOT_PATH}"
              "${WAX_ROOT_PATH}/core"
              "${HIVE_ROOT_PATH}/libraries/chain/include"
)

function( DEFINE_WAX_TARGET_FOR env )
      set( exec_wasm_name "wax_wasm_${env}" )
      set( exec_ts_gen "wax_ts_gen_${env}" )

      message(NOTICE "Configuring '${exec_wasm_name}' and '${exec_ts_gen}'")

      ADD_EXECUTABLE( ${exec_wasm_name} ${SOURCES} )

      target_compile_options( ${exec_wasm_name} PUBLIC -fwasm-exceptions )

      target_include_directories( ${exec_wasm_name} PUBLIC ${INCLUDES} )

      target_link_libraries( ${exec_wasm_name} PUBLIC embind hive_protocol )
      # add -sASSERTIONS to `target_link_options` if you want more information
      # INITIAL_MEMORY by default = 16777216
      target_link_options( ${exec_wasm_name} PUBLIC -fwasm-exceptions -sEXPORT_EXCEPTION_HANDLING_HELPERS -sASSERTIONS
                                                    -sEXPORTED_RUNTIME_METHODS=["FS"] -sMODULARIZE=1 -sSINGLE_FILE=1
                                                    -sEXPORT_ES6=1 -sINITIAL_MEMORY=67108864 -sENVIRONMENT="${env}"
                         )
      set_target_properties( ${exec_wasm_name} PROPERTIES OUTPUT_NAME "wax.${env}.js" )
      INSTALL( TARGETS ${exec_wasm_name}
        COMPONENT "${exec_wasm_name}_runtime"
        RUNTIME DESTINATION .
        )

      # Helper target, just to perform TypeScript wrapper generation
      ADD_EXECUTABLE( ${exec_ts_gen} ${SOURCES} )

      # target_compile_options( ${exec_ts_gen} PUBLIC -fwasm-exceptions )

      target_include_directories( ${exec_ts_gen} PUBLIC ${INCLUDES} )
      target_link_libraries( ${exec_ts_gen} PUBLIC embind hive_protocol )

      set_target_properties( ${exec_ts_gen} PROPERTIES OUTPUT_NAME "wax_ts_gen.${env}.cjs" )
      target_link_options( ${exec_ts_gen} PUBLIC # -fwasm-exceptions -sEXPORT_EXCEPTION_HANDLING_HELPERS -sASSERTIONS
                                                 --embind-emit-tsd "${CMAKE_CURRENT_BINARY_DIR}/wax.${env}.d.ts" )
      INSTALL( FILES  "${CMAKE_CURRENT_BINARY_DIR}/wax.${env}.d.ts"
        COMPONENT "${exec_wasm_name}_dts"
        DESTINATION .
        )
endfunction()

DEFINE_WAX_TARGET_FOR(node)
DEFINE_WAX_TARGET_FOR(web)

target_link_options( wax_wasm_node PUBLIC -sUSE_ES6_IMPORT_META=1 -sNODERAWFS=1 )
target_link_libraries( wax_wasm_node PUBLIC nodefs.js )
target_link_libraries( wax_ts_gen_node PUBLIC nodefs.js )

target_link_options( wax_wasm_web PUBLIC -sUSE_ES6_IMPORT_META=0 )
target_link_libraries( wax_wasm_web PUBLIC idbfs.js )
target_link_libraries( wax_ts_gen_web PUBLIC idbfs.js )
