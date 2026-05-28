# CLAUDE.md

When rewriting TS / Python to Rust, write 'idiomatic' Rust, don't try to mirror 1:1 features from other languages.
Don't create your own logic or guards unless TS / Python provide some guarantee (guard) by default (language constraint) - then add `NOTE: ` comment.
Use style guidelines defined in `.rustfmt.toml`

When writing documentation, follow these rules:
- for types: `Represents...`,
- for functions: e.g. `Converts...`, `Calculates...`,
- for traits: `Provides...`,
- for constants: `Used for/in/to...`
- for TS- / Python-Rust comparisions: `TS NOTE: ` or `Python NOTE: `.

Define types in dependency order, with higher-level types above the types they use, e.g.
```rs
struct Foo(Bar);

struct Bar(i32, Baz);

type Baz = String;
```
