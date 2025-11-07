export abstract class AStorageProviderBase {
  abstract get (name: string): Promise<string>;

  abstract save (name: string, data: string): Promise<void>;

  abstract delete (name: string): Promise<void>;

  abstract exists (name: string): Promise<boolean>;
}
