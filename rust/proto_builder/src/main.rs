use std::env;
use std::fs;
use std::path::PathBuf;

fn main() {
    let manifest_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
    let workspace_root = manifest_dir.parent().expect("proto-build must live inside the rust workspace");

    let proto_src = workspace_root
        .join("..")
        .join("hive")
        .join("libraries")
        .join("protocol")
        .join("proto");
    let out_dir = workspace_root.join("protobuf_patterns");

    fs::create_dir_all(&out_dir).expect("create rust/protobuf_patterns output dir");

    let mut protos: Vec<PathBuf> = fs::read_dir(&proto_src)
        .expect("read hive proto dir")
        .filter_map(|e| e.ok().map(|e| e.path()))
        .filter(|p| p.extension().and_then(|s| s.to_str()) == Some("proto"))
        .collect();
    protos.sort();

    let descriptor_path = out_dir.join("hive.protocol.buffers.bin");

    let mut config = prost_build::Config::new();
    config.out_dir(&out_dir);
    config.file_descriptor_set_path(&descriptor_path);
    config
        .compile_protos(&protos, &[&proto_src])
        .expect("prost-build failed to compile .proto files");

    // Generate serde::Serialize/Deserialize impls alongside the prost types so
    // proto messages can be JSON-encoded/decoded directly via serde_json rather
    // than routed through prost-reflect's DynamicMessage at runtime.
    let descriptors = fs::read(&descriptor_path).expect("read generated descriptor set");
    pbjson_build::Builder::new()
        .register_descriptors(&descriptors)
        .expect("pbjson-build: register descriptors")
        .out_dir(&out_dir)
        .build(&[".hive.protocol.buffers"])
        .expect("pbjson-build failed to emit serde impls");
}
