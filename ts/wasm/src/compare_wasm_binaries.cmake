# Usage: cmake -DWEB_WASM=<path> -DNODE_WASM=<path> -P compare_wasm_binaries.cmake
#
# Both wasm targets install their wax.common.wasm to the same destination and
# `cmake --install` skips the second copy when both share an mtime second, so
# the shipped binary is only independent of link timing while the two are
# identical.

foreach( var WEB_WASM NODE_WASM )
  if( NOT EXISTS "${${var}}" )
    message( FATAL_ERROR "${var} does not name an existing file: '${${var}}'" )
  endif()
endforeach()

execute_process(
  COMMAND "${CMAKE_COMMAND}" -E compare_files "${WEB_WASM}" "${NODE_WASM}"
  RESULT_VARIABLE compare_result
)

if( NOT compare_result EQUAL 0 )
  file( SIZE "${WEB_WASM}" web_size )
  file( SIZE "${NODE_WASM}" node_size )
  message( FATAL_ERROR
    "The web and node wax.common.wasm differ:\n"
    "  ${WEB_WASM} (${web_size} bytes)\n"
    "  ${NODE_WASM} (${node_size} bytes)\n"
    "Both are installed to the same destination, so which one ships would depend on link timing. "
    "Wasm-level link options must be shared by both targets through WAX_BINARYEN_EXTRA_PASSES "
    "in ts/wasm/src/CMakeLists.txt; only JS-glue options may differ between the targets' LINK_OPTIONS."
  )
endif()

message( STATUS "wax.common.wasm identity check passed: ${WEB_WASM} and ${NODE_WASM} are identical" )
