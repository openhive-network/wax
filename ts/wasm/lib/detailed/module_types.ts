export interface IOptionalModuleArgs {
  wasmBinary?: Buffer;
  locateFile?: (path: string, scriptDirectory: string) => string;
}
