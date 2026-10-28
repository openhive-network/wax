/// <reference types="node" />

import type { Page, Route } from '@playwright/test';

import {
  API_REPLAY_URL, LIVE_API_ENDPOINT, LIVE_REQUEST_ATTEMPTS, LIVE_REQUEST_ATTEMPT_TIMEOUT_MS, TARGET_HOST_HEADER,
  fetchWithRetry, isReplayedHost
} from './api-traffic';

const liveApiHost = new URL(LIVE_API_ENDPOINT).hostname;

const isLiveHost = (url: URL): boolean => isReplayedHost(url) || url.hostname === liveApiHost;

const replayUrlFor = (url: URL): string => `${API_REPLAY_URL}${url.pathname}${url.search}`;

const requestUrlOf = (input: RequestInfo | URL): URL => new URL(input instanceof Request ? input.url : input.toString());

/**
 * Routes the API requests made by the test code running in this Node.js process:
 * to the API replay server, or with {@link fetchWithRetry} when `live` is set.
 *
 * @returns function restoring the original `fetch`
 */
export const routeNodeApiRequests = (live: boolean): (() => void) => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = requestUrlOf(input);

    if (live) {
      if (!isLiveHost(url) || input instanceof Request)
        return originalFetch(input, init);

      return fetchWithRetry(originalFetch, url, init);
    }

    if (!isReplayedHost(url))
      return originalFetch(input, init);

    const request = new Request(input, init);
    const headers = new Headers(request.headers);
    headers.set(TARGET_HOST_HEADER, url.host);

    return originalFetch(replayUrlFor(url), {
      method: request.method,
      headers,
      body: request.body === null ? undefined : await request.text(),
      signal: request.signal
    });
  };

  return () => { globalThis.fetch = originalFetch; };
};

const fulfillFromReplayServer = async (page: Page, route: Route): Promise<void> => {
  const request = route.request();
  const url = new URL(request.url());

  const response = await page.request.fetch(replayUrlFor(url), {
    method: request.method(),
    headers: { ...request.headers(), [TARGET_HOST_HEADER]: url.host },
    data: request.postDataBuffer() ?? undefined
  });

  await route.fulfill({ response });
};

const fulfillFromLiveNode = async (route: Route): Promise<void> => {
  for (let attempt = 1; ; ++attempt) {
    const isLastAttempt = attempt === LIVE_REQUEST_ATTEMPTS;

    try {
      const response = await route.fetch({ timeout: LIVE_REQUEST_ATTEMPT_TIMEOUT_MS });

      if (response.status() < 500 || isLastAttempt) {
        await route.fulfill({ response });

        return;
      }

      console.warn(`HTTP ${response.status()} from "${route.request().method()} ${route.request().url()}", retrying (attempt ${attempt}/${LIVE_REQUEST_ATTEMPTS})`);
    } catch (error) {
      // route.fetch reports timeouts and network errors alike as a plain Error
      if (isLastAttempt) {
        console.warn(`Request "${route.request().method()} ${route.request().url()}" failed: ${(error as Error).message}`);
        await route.abort('timedout');

        return;
      }

      console.warn(`Request "${route.request().method()} ${route.request().url()}" failed, retrying (attempt ${attempt}/${LIVE_REQUEST_ATTEMPTS})`);
    }

    await new Promise(resolve => setTimeout(resolve, attempt * 500));
  }
};

/**
 * Routes the API requests made by the test code running in the browser page,
 * the same way as {@link routeNodeApiRequests} does in Node.js.
 */
export const routePageApiRequests = async (page: Page, live: boolean): Promise<void> => {
  if (live)
    await page.route(isLiveHost, fulfillFromLiveNode);
  else
    await page.route(isReplayedHost, route => fulfillFromReplayServer(page, route));
};
