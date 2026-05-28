# CLAUDE.md

When rewriting TS / Python to Rust, write 'idiomatic' Rust, don't try to mirror 1:1 features from other languages.
Don't create your own logic or guards unless TS / Python provide some guarantee (guard) by default (language constraint) - then add `NOTE: ` comment.

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

## Style
Use style guidelines defined in `.rustfmt.toml`

If function has more than 2 lines, add 1 blank line before 'return'. E.g.
```rs
fn foo() -> i32 {
    let x = 2;
    let y = x;

    y
}
```
but
```rs
fn foo() -> i32 {
    let x = 2;
    x
}
```

Each 'logic group' should be separated, e.g.
```rs
let res = fetch("x").await?;

if res.status != 200 {...}

let body = res.body().await?;
let x = body.get("x");
```
