import proxy from 'express-http-proxy';
import express from 'express';
import cors from 'cors';
import type { Server } from 'http';
import { AProxyMockResolver } from './api-mock';

export const createServer = async (mockInstance: AProxyMockResolver, target: string = "api.hive.blog", port: number = 3000) => {
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

    console.log(`No mock data found ${methodStr} - proxying to "${req.headers['x-hive-target'] as string || target}"...`);
    next();
  });

  // Create a transparent proxy
  app.use('/', proxy(req => req.headers['x-hive-target'] as string || target, {
    https: true,
    memoizeHost: false,
    preserveHostHdr: false
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
