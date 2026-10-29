/// <reference types="node" />

import { fileURLToPath } from 'url';

import { createServer } from './proxy-mock-server';
import { JsonRpcMock, type IJsonRpcMockData } from './api-mock';
import { RecordedApiMock } from './recorded-api-mock';
import { API_REPLAY_PORT, getApiTrafficMode } from './api-traffic';
import jsonRpcMock from './mock/jsonRpcMock';

const args = process.argv.slice(2);
const port = parseInt(args[0], 10);
const targetApi = 'api.hive.blog';
// Must stay well below run_tests.sh's TIMEOUT_PROXY_MOCK_SERVER_SECONDS, so a slow
// upstream falls back to the static DGPO instead of keeping the server from starting
const dgpoFetchTimeoutMs = 10_000;

// Resolves to the same source directory from both wasm/__tests__/assets and its compiled copy in wasm/dist/assets
const recordingsDir = fileURLToPath(new URL('../../__tests__/assets/mock/recordings', import.meta.url));

const mode = getApiTrafficMode();

// Only used in `live` mode: the other modes answer with the static DGPO from jsonRpcMock,
// so that transactions built by the tests (and requests recorded from them) do not depend on the chain head
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
      }),
      signal: AbortSignal.timeout(dgpoFetchTimeoutMs)
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
  if (mode === 'live') {
    await createServer(new JsonRpcMock(await fetchAndCacheDgpo()), targetApi, port);
  } else {
    // Calls with no mock data in jsonRpcMock get the responses recorded from the public nodes, see api-traffic.ts
    const replay = new RecordedApiMock(recordingsDir, mode === 'record');
    await createServer(replay, targetApi, API_REPLAY_PORT);
    await createServer(new JsonRpcMock(jsonRpcMock), targetApi, port, `localhost:${API_REPLAY_PORT}`);

    for (const signal of ['SIGINT', 'SIGTERM'] as const)
      process.on(signal, () => {
        console.log(`API replay: ${replay.stats.replayed} replayed, ${replay.stats.recorded} recorded, ${replay.stats.missing} without a recording`);
        process.exit(0);
      });
  }

  console.log(`Server is running on port ${port} (WAX_TEST_API_MODE=${mode})`);
} catch (err) {
  console.error('Error starting the server:', err);
  process.exit(1);
}
