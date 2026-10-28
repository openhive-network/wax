/// <reference types="node" />

import fs from 'fs';
import path from 'path';
import type { Request, Response } from 'express';

import { AProxyMockResolver } from './api-mock';
import { fetchWithRetry, TARGET_HOST_HEADER } from './api-traffic';

interface IRecordedExchange {
  request: {
    method: string;
    path: string;
    body?: unknown;
  };
  response: {
    status: number;
    json?: unknown;
    text?: string;
  };
}

export interface IRecordedApiMockStats {
  replayed: number;
  recorded: number;
  missing: number;
}

const stableStringify = (value: unknown): string => {
  if (Array.isArray(value))
    return `[${value.map(stableStringify).join(',')}]`;

  if (typeof value === 'object' && value !== null)
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`).join(',')}}`;

  return JSON.stringify(value);
};

/** JSON-RPC ids differ between runs of the same call, so they are not part of the recorded request */
const withoutJsonRpcId = (body: unknown): unknown => {
  if (typeof body !== 'object' || body === null || Array.isArray(body) || !('jsonrpc' in body))
    return body;

  const { id: _id, ...rest } = body as Record<string, unknown>;

  return rest;
};

const exchangeKey = ({ method, path, body }: IRecordedExchange['request']): string =>
  `${method} ${path} ${body === undefined ? '' : stableStringify(body)}`;

/**
 * Serves the responses of public API nodes recorded in `<recordingsDir>/<host>.json`.
 * The host is taken from the {@link TARGET_HOST_HEADER} request header.
 *
 * In record mode requests are forwarded to `https://<host>` and their responses stored (5xx responses are not stored).
 * In replay mode a request with no recording is answered with HTTP 501 and never reaches the network.
 */
export class RecordedApiMock extends AProxyMockResolver {
  private readonly recordings = new Map<string, Map<string, IRecordedExchange>>();

  public readonly stats: IRecordedApiMockStats = { replayed: 0, recorded: 0, missing: 0 };

  public constructor(
    private readonly recordingsDir: string,
    private readonly record: boolean
  ) {
    super();

    for (const file of fs.readdirSync(recordingsDir).filter(name => name.endsWith('.json'))) {
      const exchanges = JSON.parse(fs.readFileSync(path.join(recordingsDir, file), 'utf-8')) as IRecordedExchange[];

      this.recordings.set(path.basename(file, '.json'), new Map(exchanges.map(exchange => [exchangeKey(exchange.request), exchange])));
    }
  }

  public hasHandler(): boolean {
    return true;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const host = req.headers[TARGET_HOST_HEADER];

    if (typeof host !== 'string') {
      res.status(400).json({ error: `Missing ${TARGET_HOST_HEADER} header` });

      return;
    }

    const request: IRecordedExchange['request'] = {
      method: req.method,
      path: req.originalUrl,
      ...(typeof req.body === 'object' && Object.keys(req.body).length > 0 ? { body: withoutJsonRpcId(req.body) } : {})
    };
    const key = exchangeKey(request);

    let exchange = this.recordings.get(host)?.get(key);

    if (exchange === undefined) {
      if (!this.record) {
        ++this.stats.missing;
        console.error(`No recorded response for ${host}: ${key}`);
        res.status(501).json({ error: `No recorded response for ${host}: ${key}. Re-record the API responses (see ts/README.md).` });

        return;
      }

      exchange = await this.recordExchange(host, request, req.body);
    } else
      ++this.stats.replayed;

    res.status(exchange.response.status);

    if (exchange.response.json === undefined) {
      res.type('text/plain').send(exchange.response.text);

      return;
    }

    const requestId = typeof req.body === 'object' ? req.body.id : undefined;
    const { json } = exchange.response;

    res.json(requestId !== undefined && typeof json === 'object' && json !== null && 'jsonrpc' in json ? { ...json, id: requestId } : json);
  }

  private async recordExchange(host: string, request: IRecordedExchange['request'], body: unknown): Promise<IRecordedExchange> {
    const response = await fetchWithRetry(fetch, `https://${host}${request.path}`, {
      method: request.method,
      headers: request.body === undefined ? undefined : { 'content-type': 'application/json' },
      body: request.body === undefined ? undefined : JSON.stringify(body)
    });
    const text = await response.text();

    let json: unknown;
    try {
      json = text.length > 0 ? JSON.parse(text) : undefined;
    } catch {
      json = undefined;
    }

    const exchange: IRecordedExchange = {
      request,
      response: { status: response.status, ...(json === undefined ? { text } : { json: withoutJsonRpcId(json) }) }
    };

    if (response.status >= 500) {
      console.error(`Not recording HTTP ${response.status} from ${host}: ${exchangeKey(request)}`);

      return exchange;
    }

    ++this.stats.recorded;

    let hostRecordings = this.recordings.get(host);
    if (hostRecordings === undefined)
      this.recordings.set(host, hostRecordings = new Map());

    hostRecordings.set(exchangeKey(request), exchange);
    this.save(host, hostRecordings);

    return exchange;
  }

  private save(host: string, hostRecordings: Map<string, IRecordedExchange>): void {
    const sorted = [...hostRecordings.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, exchange]) => exchange);

    fs.writeFileSync(path.join(this.recordingsDir, `${host}.json`), `${JSON.stringify(sorted, undefined, 2)}\n`);
  }
}
