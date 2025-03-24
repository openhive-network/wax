import { createServer } from './proxy-mock-server';
import { JsonRpcMock } from './api-mock';
import jsonRpcMock from './mock/jsonRpcMock';

const args = process.argv.slice(2);
const port = parseInt(args[0], 10);

try {
  await createServer(new JsonRpcMock(jsonRpcMock), 'api.hive.blog', port);
  console.log(`Server is running on port ${port}`);
} catch (err) {
  console.error('Error starting the server:', err);
}