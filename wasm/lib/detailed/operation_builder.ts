import { operation } from '../protocol';
import type { IWaxBaseInterface } from '../interfaces';

export interface IOperationSink {
  api: IWaxBaseInterface;
}

export abstract class OperationBase {
  abstract finalize(sink: IOperationSink): Iterable<operation>;
}
