fn main() {
    cxx_build::bridge("src/lib.rs")
        .file("src/cpp/foundation.cpp")
        .file("src/cpp/transaction.cpp")
        .file("src/cpp/operation.cpp")
        .include("inc")
        .std("c++17")
        .compile("cpp_rust_bridge");

    println!("cargo:rerun-if-changed=src/lib.rs");
    println!("cargo:rerun-if-changed=src/cpp/foundation.cpp");
    println!("cargo:rerun-if-changed=src/cpp/transaction.cpp");
    println!("cargo:rerun-if-changed=src/cpp/operation.cpp");
    println!("cargo:rerun-if-changed=inc/foundation.h");
    println!("cargo:rerun-if-changed=inc/transaction.h");
    println!("cargo:rerun-if-changed=inc/operation.h");
}
