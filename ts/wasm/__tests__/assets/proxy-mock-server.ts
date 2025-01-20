import proxy from 'express-http-proxy';
import express from 'express';
import cors from 'cors';
import type { Server } from 'http';
import { AProxyMockResolver } from './api-mock';

export const createServer = async (mockInstance: AProxyMockResolver, target: string = "api.hive.blog", port: number = 3000) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/', (req, res, next) => {
    console.log('Request URL:', req.originalUrl);

    if (mockInstance.hasHandler(req)) {
      mockInstance.handle(req, res);

      res.status(200).end();

      return;
    }

    console.log(`No mock data found - proxying to "${req.headers['x-hive-target'] as string || target}"...`);
    next();
  });

  // Create a transparent proxy
  app.use('/', proxy(req => req.headers['x-hive-target'] as string || target, {
    https: true,
    preserveHostHdr: true,
    parseReqBody: false,
    reqBodyEncoding: null
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
