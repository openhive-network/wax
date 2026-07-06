use std::path::{Path, PathBuf};

fn collect_archives(dir: &Path, out: &mut Vec<PathBuf>) {
    let Ok(entries) = std::fs::read_dir(dir) else {
        return;
    };
    for entry in entries.flatten() {
        let path = entry.path();
        if path.is_dir() {
            collect_archives(&path, out);
        } else if path.extension().and_then(|e| e.to_str()) == Some("a") {
            out.push(path);
        }
    }
}

fn main() {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let repo_root = manifest_dir
        .ancestors()
        .nth(2)
        .expect("expected repo root two levels above rust/wax/Cargo.toml")
        .to_path_buf();

    // The C++ sources include the generated bridge header as
    // "wax/src/core.rs.h"; pin the prefix so it doesn't follow the
    // crates.io package name (hiveio-wax).
    cxx_build::CFG.include_prefix = "wax";
    let mut build = cxx_build::bridge("src/core.rs");
    build.std("c++17").include("src/core/inc");

    let mut cmake_cfg = cmake::Config::new(&manifest_dir);
    cmake_cfg.build_target("wax_core").profile("Release");

    for var in ["OPENSSL_ROOT_DIR", "OPENSSL_INCLUDE_DIR", "BOOST_ROOT"] {
        if let Ok(v) = std::env::var(var) {
            cmake_cfg.define(var, &v);
            println!("cargo:rerun-if-env-changed={var}");
        }
    }

    let cmake_dst = cmake_cfg.build();
    let build_dir = cmake_dst.join("build");

    let mut archives = Vec::new();
    collect_archives(&build_dir, &mut archives);
    assert!(
        !archives.is_empty(),
        "no static archives produced under {}",
        build_dir.display()
    );

    let mut search_dirs = std::collections::BTreeSet::new();
    for a in &archives {
        let dir = a.parent().expect("archive has parent dir").to_path_buf();
        let stem = a
            .file_stem()
            .and_then(|s| s.to_str())
            .expect("archive has utf8 stem");
        let libname = stem
            .strip_prefix("lib")
            .expect("archive name starts with lib");

        if search_dirs.insert(dir.clone()) {
            println!("cargo:rustc-link-search=native={}", dir.display());
        }
        println!("cargo:rustc-link-lib=static={libname}");
        println!("cargo:rerun-if-changed={}", a.display());
    }

    // Boost and OpenSSL are linked dynamically below but live outside the CMake
    // build tree, so their lib directories must be on the link search path.
    // The wax library itself is an rlib (no final link), but these paths
    // propagate to downstream binaries and test executables that do perform
    // the final link.
    for var in ["BOOST_ROOT", "OPENSSL_ROOT_DIR"] {
        let Ok(root) = std::env::var(var) else {
            continue;
        };
        for sub in ["lib", "lib64"] {
            let dir = Path::new(&root).join(sub);
            if dir.is_dir() {
                println!("cargo:rustc-link-search=native={}", dir.display());
            }
        }
    }

    for component in [
        "chrono",
        "context",
        "coroutine",
        "filesystem",
        "system",
        "thread",
    ] {
        println!("cargo:rustc-link-lib=boost_{component}");
    }
    for sys in ["ssl", "crypto", "z", "bz2", "pthread", "dl", "stdc++"] {
        println!("cargo:rustc-link-lib={sys}");
    }

    build.file("src/core/cpp/rust_protocol.cpp");
    build.include(&repo_root);
    build.include(repo_root.join("hive/libraries/protocol/include"));
    build.include(repo_root.join("hive/libraries/fc/include"));
    build.include(repo_root.join("hive/libraries/chain/include"));
    build.include(build_dir.join("protocol/include"));
    build.include(build_dir.join("generated_assert_id"));

    println!("cargo:rerun-if-changed=src/core/cpp/rust_protocol.cpp");
    println!("cargo:rerun-if-changed=src/core/inc/rust_protocol.hpp");
    println!("cargo:rerun-if-changed=src/core/inc/rust_managed_object.hpp");
    println!("cargo:rerun-if-changed=CMakeLists.txt");

    build.compile("cpp_rust_bridge");

    println!("cargo:rerun-if-changed=src/core.rs");
    println!("cargo:rerun-if-changed=src/core/asset.rs");
    println!("cargo:rerun-if-changed=src/core/authority_provider.rs");
    println!("cargo:rerun-if-changed=src/core/managed_object.rs");
    println!("cargo:rerun-if-changed=src/core/operation.rs");
    println!("cargo:rerun-if-changed=src/core/transaction.rs");
}
