export interface IOptionalModuleArgs {
  wasmBinary?: Uint8Array;
  locateFile?: (path: string, scriptDirectory: string) => string;
}
