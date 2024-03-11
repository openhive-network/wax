import type { HiveAppsOperationsBuilder } from "./builder.js";

export abstract class HiveAppsOperation<ChildT extends HiveAppsOperationsBuilder<any, BodyT>, BodyT extends object = object> {
  /**
   * Converts the current hive apps operation to the builder type ({@link HiveAppsOperationsBuilder})
   *
   * @returns {HiveAppsOperationsBuilder} hive chain operation builder
   */
  public abstract get builder(): HiveAppsOperationsBuilder<ChildT, BodyT>;
}
