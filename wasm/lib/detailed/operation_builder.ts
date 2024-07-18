import { operation } from '../protocol';
import type { ITransactionBuilder, IWaxBaseInterface } from '../interfaces';
import type { TransactionBuilder } from './transaction_builder';
import { WaxError } from '../errors';

export interface IOperationFactorySink {
  api: IWaxBaseInterface;
}

export interface IBuiltHiveAppsOperation {
  /**
   * Retrieves number of custom operations in the container that will be pushed into the TransactionBuilder
   *
   * @type {number}
   */
  length: number;
}

export class BuiltHiveAppsOperation implements IBuiltHiveAppsOperation {
  /**
   * @internal
   */
  public readonly customJsonContainer: Array<operation> = [];

  public get length(): number {
    return this.customJsonContainer.length;
  }

  /**
   * @internal
   */
  public push(op: operation): BuiltHiveAppsOperation {
    this.customJsonContainer.push(op);

    return this;
  }

  /**
   * Flushes (pushes) the staged operations to the TransactionBuilder
   *
   * @param {TransactionBuilder} tx transaction builder instance
   *
   * @internal
   */
  public flushOperations(tx: TransactionBuilder): void {
    this.customJsonContainer.forEach(tx.pushRawOperation.bind(tx));
  }
}

export class OperationBuilder {
  protected readonly builtOperations: BuiltHiveAppsOperation = new BuiltHiveAppsOperation();

  private _api?: IWaxBaseInterface;

  public get api (): IWaxBaseInterface {
    if (this._api === undefined)
      throw new WaxError('Requested api object on builder, but builder has not been initialized using useBuilder');

    return this._api;
  }

  public set api (otherApi: IWaxBaseInterface) {
    if (this._api !== undefined)
      throw new WaxError('Builder has already been initialized with an api object');

    this._api = otherApi;
  }

  /**
   * @internal
   */
  protected push(op: operation): OperationBuilder {
    this.builtOperations.push(op);

    return this;
  }

  /**
   * Marks the current set of the hive apps operations as ready push
   *
   * @returns {IBuiltHiveAppsOperation} instance of the hive apps operation class that you can pass to the {@link ITransactionBuilder.push}
   */
  public build(): IBuiltHiveAppsOperation {
    return this.builtOperations;
  }
}

export abstract class AOperationFactory {
  abstract finalize(sink: IOperationFactorySink): Iterable<operation>;
}
