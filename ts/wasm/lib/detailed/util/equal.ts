// Deep comparison of defaultCommentOptions and this.commentOptions
// There is no built-in or standard deep equality method in JavaScript/TypeScript.
// Libraries like lodash.isEqual can be used, but for portability, a custom function is common.
export function deepEqual(obj1: any, obj2: any): boolean {
if (obj1 === obj2) return true;
if (typeof obj1 !== typeof obj2) return false;
if (obj1 === null || obj2 === null) return obj1 === obj2;
if (typeof obj1 !== "object") return obj1 === obj2;

if (Array.isArray(obj1)) {
    if (!Array.isArray(obj2) || obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
if (!deepEqual(obj1[i], obj2[i])) return false;
    }
    return true;
}

const keys1 = Object.keys(obj1);
const keys2 = Object.keys(obj2);
if (keys1.length !== keys2.length) return false;

for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
}
return true;
}
