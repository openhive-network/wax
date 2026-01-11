import { createServer } from './proxy-mock-server';
import { JsonRpcMock, type IJsonRpcMockData } from './api-mock';
import jsonRpcMock from './mock/jsonRpcMock';

const args = process.argv.slice(2);
const port = parseInt(args[0], 10);
const targetApi = 'api.hive.blog';

// Fetch and cache dynamic global properties at startup to avoid
// repeated API calls during tests while keeping data in sync with real API
async function fetchAndCacheDgpo(): Promise<IJsonRpcMockData> {
  console.log(`Fetching dynamic global properties from ${targetApi}...`);

  try {
    const response = await fetch(`https://${targetApi}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'database_api.get_dynamic_global_properties',
        params: {},
        id: 1
      })
    });

    const data = await response.json();
    console.log('Cached dynamic global properties successfully');

    return {
      ...jsonRpcMock,
      'database_api.get_dynamic_global_properties': () => data
    };
  } catch (err) {
    console.warn('Failed to fetch DGPO, falling back to static mock:', err);
    return jsonRpcMock;
  }
}

try {
  const mockData = await fetchAndCacheDgpo();
  await createServer(new JsonRpcMock(mockData), targetApi, port);
  console.log(`Server is running on port ${port}`);
} catch (err) {
  console.error('Error starting the server:', err);
}