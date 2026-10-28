import proxy from 'express-http-proxy';
import express from 'express';
import cors from 'cors';
import type { Server } from 'http';
import { AProxyMockResolver } from './api-mock';
import { TARGET_HOST_HEADER } from './api-traffic';

/**
 * Starts a server answering the requests `mockInstance` has a handler for and proxying the others to `target` (or the host in the `x-hive-target` header).
 * When `upstream` (`host:port`) is given, the other requests are proxied to it over plain HTTP instead, with their intended host in the `x-hive-target` header.
 */
export const createServer = async (mockInstance: AProxyMockResolver, target: string = "api.hive.blog", port: number = 3000, upstream?: string) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/', async (req, res, next) => {
    const isJsonRpc = req.method === 'POST' && typeof req.body === 'object' && typeof req.body.method === 'string';
    const methodStr = isJsonRpc ? ` [${req.body.method}]` : '';

    console.log('Request URL:', req.originalUrl, methodStr);

    if (mockInstance.hasHandler(req)) {
      try {
        await mockInstance.handle(req, res);
      } catch (error) {
        next(error);

        return;
      }

      if (!res.headersSent)
        res.status(200).end();

      return;
    }

    console.log(`No mock data found ${methodStr} - proxying to "${req.headers[TARGET_HOST_HEADER] as string || target}"${upstream === undefined ? '' : ` through ${upstream}`}...`);
    next();
  });

  // Create a transparent proxy
  app.use('/', proxy(req => upstream ?? (req.headers[TARGET_HOST_HEADER] as string || target), {
    https: upstream === undefined,
    memoizeHost: false,
    preserveHostHdr: false,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (upstream !== undefined)
        proxyReqOpts.headers = { ...proxyReqOpts.headers, [TARGET_HOST_HEADER]: srcReq.headers[TARGET_HOST_HEADER] as string || target };

      return proxyReqOpts;
    }
  }));

  let server: Server;

  await new Promise<void>((resolve, reject) => {
    server = app.listen(port, (error?: Error) => {
      if(error != undefined)
        reject(error);
      else
        resolve();
    })
  });

  return () => new Promise<void>((resolve, reject) => {
    server.close(err => {
      if (err)
        reject(err);
      else
        resolve();
    });
  });
};
