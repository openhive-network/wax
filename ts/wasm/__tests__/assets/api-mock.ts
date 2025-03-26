import type { Request, Response } from 'express';

export type TTestAnySerializableTypeExceptUndefined = string | number | boolean | Record<string, any> | Array<any>;

export type IJsonRpcResponse = {
  id: number;
  jsonrpc: string;
  result: TTestAnySerializableTypeExceptUndefined;
};

export interface IApiMockData {
  [key: string]: (params: Record<string, any>) => TTestAnySerializableTypeExceptUndefined | void;
}

export interface IJsonRpcMockData {
  [key: string]: (params: Record<string, any>) => IJsonRpcResponse | void;
}

export type TMockData = IApiMockData | IJsonRpcMockData;

export abstract class AProxyMockResolver {
  public abstract hasHandler(req: Request): boolean;

  public abstract handle(req: Request, res: Response): void;
}

export class JsonRpcMock extends AProxyMockResolver {
  public constructor(
    private readonly mockData: TMockData
  ) {
    super();
  }

  public hasHandler(req: Request): boolean {
    if (req.method !== 'POST' || typeof req.body !== 'object' )
      return false;

    const { method, params } = req.body;

    if (typeof method !== 'string' || typeof params !== 'object')
      return false;

    if (method in this.mockData && this.mockData[method](params))
      return true;

    return false;
  }

  public handle(req: Request, res: Response): void {
    // here we assume that the request is valid
    const { method, params } = req.body;

    const mockFn = this.mockData[method];

    if (typeof mockFn !== "function")
      throw new Error(`Method ${method} is not implemented`);

    const response = mockFn(params);

    res.json(response);
  }
}

// XXX: In future we may want to implement REST API mock
