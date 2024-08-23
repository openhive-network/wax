SET(HIVE_ROOT_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../hive")
# this file is generated while performing a cythonize'ing process of the Python extension
SET(WAX_CPP_PATH "${CMAKE_CURRENT_SOURCE_DIR}/wax.cpp")

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
      system
      thread
      # program_options
      unit_test_framework )

add_subdirectory("${HIVE_ROOT_PATH}/libraries/protocol" ${CMAKE_CURRENT_BINARY_DIR}/protocol)
add_subdirectory("${HIVE_ROOT_PATH}/libraries/fc" ${CMAKE_CURRENT_BINARY_DIR}/fc)
add_subdirectory("${HIVE_ROOT_PATH}/libraries/schema" ${CMAKE_CURRENT_BINARY_DIR}/schema)

file(GLOB HEADERS "${CMAKE_CURRENT_SOURCE_DIR}/../core/*.hpp" "cpython_interface.hpp")

add_python_library(${PROJECT_NAME} MODULE SOURCES ${WAX_CPP_PATH} ${CMAKE_CURRENT_SOURCE_DIR}/../core/foundation.cpp ${CMAKE_CURRENT_SOURCE_DIR}/../core/signing_keys_collector.cpp cpython_interface.cpp ${HEADERS}
  LINK_LIBRARIES hive_protocol)

target_include_directories(${PROJECT_NAME} PRIVATE
  "${CMAKE_CURRENT_SOURCE_DIR}"
  "${CMAKE_CURRENT_SOURCE_DIR}/../"
  "${CMAKE_CURRENT_SOURCE_DIR}/../core"
  "${HIVE_ROOT_PATH}/libraries/chain/include"
)

python_extension_module(${PROJECT_NAME})

file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/cpython_interface.hpp DESTINATION ${CMAKE_CURRENT_BINARY_DIR})

target_link_options(${PROJECT_NAME} PRIVATE -static-libgcc -static-libstdc++)

INSTALL(TARGETS
  ${PROJECT_NAME}

  RUNTIME DESTINATION bin
  LIBRARY DESTINATION lib
  ARCHIVE DESTINATION lib
)
