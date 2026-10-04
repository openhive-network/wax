# Loaded by .aidev/run-checks.sh (CMAKE_PROJECT_INCLUDE_BEFORE) only when fc's
# own git lookup finds no HEAD in hive/libraries/fc, as in an AIDEV workflow
# container: its git metadata is missing there, or comes as link files with
# absolute gitdirs that fc's relative-path lookup can't follow. hive's fc reads
# its revision and commit time at configure time and stops the build when it
# gets no answer; this answers for it, and nothing else changes.
#
# Setting the include guard of fc's GetGitRevisionDescription.cmake makes its
# INCLUDE() a no-op, so these definitions are the ones fc calls.
set(__get_git_revision_description YES)

function(get_git_head_revision _dir _refspecvar _hashvar)
	set(${_refspecvar} "HEAD" PARENT_SCOPE)
	set(${_hashvar} "$ENV{AIDEV_FC_GIT_REVISION}" PARENT_SCOPE)
endfunction()

function(get_git_unix_timestamp _dir _var)
	set(${_var} "$ENV{AIDEV_FC_GIT_TIMESTAMP}" PARENT_SCOPE)
endfunction()
