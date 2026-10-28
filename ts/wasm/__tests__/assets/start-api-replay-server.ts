/// <reference types="node" />

import { fileURLToPath } from 'url';

import { createServer } from './proxy-mock-server';
import { RecordedApiMock } from './recorded-api-mock';
import { API_REPLAY_PORT, getApiTrafficMode } from './api-traffic';

// Resolves to the same source directory from both wasm/__tests__/assets and its compiled copy in wasm/dist/assets
const recordingsDir = fileURLToPath(new URL('../../__tests__/assets/mock/recordings', import.meta.url));

const mode = getApiTrafficMode();
const mock = new RecordedApiMock(recordingsDir, mode === 'record');

await createServer(mock, 'api.hive.blog', API_REPLAY_PORT);

console.error(`API replay server (${mode === 'record' ? 'recording' : 'replaying'} ${recordingsDir}) is running on port ${API_REPLAY_PORT}`);

for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.on(signal, () => {
    // Shows in the test job log that no request left for a public node unless recording
    console.error(`API replay server: ${mock.stats.replayed} replayed, ${mock.stats.recorded} recorded, ${mock.stats.missing} without a recording`);
    process.exit(0);
  });
