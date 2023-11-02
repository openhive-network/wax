/**
 * @internal
 */
export class WaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WaxError";
  }
}
