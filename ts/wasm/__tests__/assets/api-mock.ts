import type { Request, Response } from 'express';

export interface IMockData {
  [key: string]: (params: Record<string, any>) => any | void;
}

export abstract class AProxyMockResolver {
  public abstract hasHandler(req: Request): boolean;

  public abstract handle(req: Request, res: Response): void;
}

export class JsonRpcMock extends AProxyMockResolver {
  public constructor(
    private readonly mockData: IMockData
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

    const response = this.mockData[method](params);

    res.json(response);
  }
}

// XXX: In future we may want to implement REST API mock
