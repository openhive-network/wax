/// <reference types="node" />

/**
 * How the tests reach the public Hive API nodes.
 *
 * - `replay` (default): requests to {@link REPLAYED_HOSTS} are answered by the API replay server
 *   from the responses recorded in `assets/mock/recordings`. A request with no recording fails, nothing reaches the network.
 * - `record`: the API replay server forwards such requests to the live node and stores the responses.
 * - `live`: requests go to the live nodes, retried on timeouts and 5xx responses.
 *
 * Selected by the `WAX_TEST_API_MODE` environment variable.
 */
export type TApiTrafficMode = 'replay' | 'record' | 'live';

const API_TRAFFIC_MODES: readonly TApiTrafficMode[] = ['replay', 'record', 'live'];

export const getApiTrafficMode = (): TApiTrafficMode => {
  const mode = process.env.WAX_TEST_API_MODE ?? 'replay';

  if (!(API_TRAFFIC_MODES as readonly string[]).includes(mode))
    throw new Error(`Invalid WAX_TEST_API_MODE "${mode}", expected one of: ${API_TRAFFIC_MODES.join(', ')}`);

  return mode as TApiTrafficMode;
};

/** Public nodes the tests call, by default or explicitly */
const REPLAYED_HOSTS: readonly string[] = [
  'api.hive.blog',
  'api.syncad.com',
  'api.openhive.network',
  'api.fake.openhive.network'
];

/** Header carrying the original host of a request redirected to the API replay server */
export const TARGET_HOST_HEADER = 'x-hive-target';

export const API_REPLAY_PORT = Number(process.env.WAX_TEST_API_REPLAY_PORT ?? 8010);

export const API_REPLAY_URL = `http://localhost:${API_REPLAY_PORT}`;

/**
 * Endpoint used by the tests which check behaviour of a live node (`healthchecker_tests`).
 * Set `WAX_TEST_LIVE_API_ENDPOINT` to point them at another node.
 */
export const LIVE_API_ENDPOINT = process.env.WAX_TEST_LIVE_API_ENDPOINT ?? 'https://api.hive.blog';

export const LIVE_REQUEST_ATTEMPTS = 3;

export const LIVE_REQUEST_ATTEMPT_TIMEOUT_MS = 10_000;

export const isReplayedHost = (url: URL): boolean => url.protocol === 'https:' && REPLAYED_HOSTS.includes(url.hostname);

/**
 * Calls `fetchFn`, retrying on a 5xx response, a network error or when an attempt takes longer than {@link LIVE_REQUEST_ATTEMPT_TIMEOUT_MS}.
 * An abort requested by the caller through `init.signal` is never retried.
 */
export const fetchWithRetry = async (fetchFn: typeof fetch, input: string | URL, init: RequestInit = {}): Promise<Response> => {
  for (let attempt = 1; ; ++attempt) {
    const attemptSignal = AbortSignal.timeout(LIVE_REQUEST_ATTEMPT_TIMEOUT_MS);
    const signal = init.signal ? AbortSignal.any([init.signal, attemptSignal]) : attemptSignal;
    const isLastAttempt = attempt === LIVE_REQUEST_ATTEMPTS;

    try {
      const response = await fetchFn(input, { ...init, signal });

      if (response.status < 500 || isLastAttempt)
        return response;

      await response.body?.cancel();
      console.warn(`HTTP ${response.status} from "${init.method ?? 'GET'} ${input}", retrying (attempt ${attempt}/${LIVE_REQUEST_ATTEMPTS})`);
    } catch (error) {
      const isRetriable = attemptSignal.aborted || error instanceof TypeError;

      if (!isRetriable || init.signal?.aborted || isLastAttempt)
        throw error;

      console.warn(`Request "${init.method ?? 'GET'} ${input}" failed (${(error as Error).name}), retrying (attempt ${attempt}/${LIVE_REQUEST_ATTEMPTS})`);
    }

    await new Promise(resolve => setTimeout(resolve, attempt * 500));
  }
};
