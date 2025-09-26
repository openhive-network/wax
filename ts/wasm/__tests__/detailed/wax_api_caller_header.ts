import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';

interface CapturedHeadersData {
  [key: string]: string;
}

test.describe('Wax API Caller Header Tests', () => {
  test('Should set x-wax-api-caller header in REST API requests when configured', async ({ waxTest }) => {
    const capturedHeaders = await waxTest.dynamic(async({ chain }) => {
      let interceptedHeaders: CapturedHeadersData = {};

      const extended = chain.extendRest({
        'hafbe-api': {
          operationTypeCounts: {
            params: { "result-limit": "number" }
          }
        }
      });

      const headerCapturingPromise = new Promise<CapturedHeadersData>((resolve, reject) => {
        ((extended.restApi['hafbe-api'].operationTypeCounts as any)._target.withProxy(
          (requestData: any) => {
            interceptedHeaders = { 'waxApiCaller': requestData.waxApiCaller };

            return requestData;
          })({ "result-limit": 1 }) as Promise<any>).then(() => {
          resolve(interceptedHeaders);
        }).catch(error => {
          if (Object.keys(interceptedHeaders).length > 0) {
            resolve(interceptedHeaders);
          } else {
            reject(error);
          }
        });
      });

      return await headerCapturingPromise;
    });

    expect(capturedHeaders['waxApiCaller']).toBe('test-wax-client-v1.0');
  });

  test('Should set x-wax-api-caller header in standard API requests when configured', async ({ waxTest }) => {
    const capturedHeaders = await waxTest.dynamic(async({ chain }) => {
      let interceptedHeaders: CapturedHeadersData = {};

      const headerCapturingPromise = new Promise<CapturedHeadersData>((resolve, reject) => {
        ((chain.api.database_api.get_dynamic_global_properties as any)._target.withProxy(
          (requestData: any) => {
            interceptedHeaders = { 'waxApiCaller': requestData.waxApiCaller };

            return requestData;
          })({}) as Promise<any>).then(() => {
          resolve(interceptedHeaders);
        }).catch(error => {
          if (Object.keys(interceptedHeaders).length > 0) {
            resolve(interceptedHeaders);
          } else {
            reject(error);
          }
        });
      });

      return await headerCapturingPromise;
    });

    expect((capturedHeaders as CapturedHeadersData)['waxApiCaller']).toBe('test-wax-client-v1.0');
  });
});