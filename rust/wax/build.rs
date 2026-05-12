fn collect_archives(dir: &std::path::Path, out: &mut Vec<std::path::PathBuf>) {
    let Ok(entries) = std::fs::read_dir(dir) else { return };
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
    let with_cpp_core = std::env::var_os("CARGO_FEATURE_WITH_CPP_CORE").is_some();

    let mut build = cxx_build::bridge("src/lib.rs");
    build.std("c++17").include("inc");

    if with_cpp_core {
        let manifest_dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let repo_root = manifest_dir
            .ancestors()
            .nth(2)
            .expect("expected repo root three levels above rust/wax/Cargo.toml")
            .to_path_buf();

        let mut cmake_cfg = cmake::Config::new(&manifest_dir);
        cmake_cfg
            .build_target("wax_core")
            .define("CMAKE_BUILD_TYPE", "Release");

        for var in ["OPENSSL_ROOT_DIR", "OPENSSL_INCLUDE_DIR"] {
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
        println!("cargo:rustc-link-arg=-Wl,--start-group");
        for a in &archives {
            println!("cargo:rustc-link-arg={}", a.display());
            println!("cargo:rerun-if-changed={}", a.display());
        }
        println!("cargo:rustc-link-arg=-Wl,--end-group");

        for component in ["chrono", "context", "coroutine", "filesystem", "system", "thread"] {
            println!("cargo:rustc-link-arg=-lboost_{component}");
        }
        for sys in ["ssl", "crypto", "z", "bz2", "pthread", "dl", "stdc++"] {
            println!("cargo:rustc-link-arg=-l{sys}");
        }

        build.file("src/cpp/rust_protocol.cpp");
        build.include(&repo_root);
        build.include(repo_root.join("hive/libraries/protocol/include"));
        build.include(repo_root.join("hive/libraries/fc/include"));
        build.include(repo_root.join("hive/libraries/chain/include"));
        build.include(build_dir.join("protocol/include"));
        build.include(build_dir.join("generated_assert_id"));

        println!("cargo:rerun-if-changed=src/cpp/rust_protocol.cpp");
        println!("cargo:rerun-if-changed=inc/rust_protocol.hpp");
        println!("cargo:rerun-if-changed=inc/rust_managed_object.hpp");
        println!("cargo:rerun-if-changed=CMakeLists.txt");
    }

    build.compile("cpp_rust_bridge");

    println!("cargo:rerun-if-changed=src/lib.rs");
    println!("cargo:rerun-if-changed=src/managed_object.rs");
    println!("cargo:rerun-if-changed=src/operation.rs");
    println!("cargo:rerun-if-changed=src/transaction.rs");
    println!("cargo:rerun-if-changed=../protobuf_patterns/hive.protocol.buffers.bin");
    println!("cargo:rerun-if-changed=../protobuf_patterns/hive.protocol.buffers.rs");
}
