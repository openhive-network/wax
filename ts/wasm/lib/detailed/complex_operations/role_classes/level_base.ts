/**
 * All of the levels included in authority category should extend this class.
 * Its main purpose is to differentiate between different role levels.
 */
export abstract class LevelBase<TRole extends string> {
  /**
   * Role level name. It should be unique and marked `as const` for proper type narrowing
   * (See: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
   */
  public level: TRole;

  protected constructor(level: TRole) {
    this.level = level;
  }

  public abstract get value(): any;
}
