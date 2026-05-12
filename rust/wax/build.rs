fn main() {
    let with_cpp_core = std::env::var_os("CARGO_FEATURE_WITH_CPP_CORE").is_some();

    let mut build = cxx_build::bridge("src/lib.rs");
    build.std("c++17").include("inc");

    if with_cpp_core {
        // TODO(build-wiring): wire fc + hive_protocol + boost into cxx-build,
        // mirroring python/wax/CMakeLists.txt. Until that lands, enabling
        // the `with_cpp_core` feature will compile rust_protocol.cpp but
        // fail to link the hive_protocol / fc symbols.
        build.file("src/cpp/rust_protocol.cpp");
        let repo_root = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
            .ancestors()
            .nth(2)
            .expect("expected repo root three levels above rust/wax/Cargo.toml");
        build.include(repo_root);
        build.include(repo_root.join("hive/libraries/protocol/include"));
        build.include(repo_root.join("hive/libraries/fc/include"));

        println!("cargo:rerun-if-changed=src/cpp/rust_protocol.cpp");
        println!("cargo:rerun-if-changed=inc/rust_protocol.hpp");
        println!("cargo:rerun-if-changed=inc/rust_managed_object.hpp");
    }

    build.compile("cpp_rust_bridge");

    println!("cargo:rerun-if-changed=src/lib.rs");
    println!("cargo:rerun-if-changed=src/managed_object.rs");
    println!("cargo:rerun-if-changed=src/operation.rs");
    println!("cargo:rerun-if-changed=src/transaction.rs");
    println!("cargo:rerun-if-changed=../protobuf_patterns/hive.protocol.buffers.bin");
    println!("cargo:rerun-if-changed=../protobuf_patterns/hive.protocol.buffers.rs");
}
