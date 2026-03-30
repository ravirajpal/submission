import { test as base, expect } from '@playwright/test';

export { expect };

export const test = base.extend<{
  allAccessAuthToken: string;
  readerAuthToken: string;
  engineerAuthToken: string;
  adminAuthToken: string;
  partListEndpoint: string;
  partDetailEndpoint: string;
  partPricingEndpoint: string;
  partRequirementsEndpoint: string;
  partBomEndpoint: string;
  partBomValidateEndpoint: string;
  stockListEndpoint: string;
  partCategoryListEndpoint: string;
  partCategoryDetailEndpoint: string;
  apiCall: (method: 'get' | 'post' | 'put' | 'patch' | 'delete', endpoint: string, payload?: any) => Promise<any>;
  unauthApiCall: (method: 'get' | 'post' | 'put' | 'patch' | 'delete', endpoint: string, payload?: any) => Promise<any>;
  readerApiCall: (method: 'get' | 'post' | 'put' | 'patch' | 'delete', endpoint: string, payload?: any) => Promise<any>;
}>({ 
  allAccessAuthToken: ({}, use) => {
    const username = process.env.USER_ALLACCESS_USERNAME ?? 'allaccess';
    const password = process.env.USER_ALLACCESS_PASSWORD ?? 'nolimits';
    use(Buffer.from(`${username}:${password}`).toString('base64'));
  },
  readerAuthToken: ({}, use) => {
    const username = process.env.USER_READER_USERNAME ?? 'reader';
    const password = process.env.USER_READER_PASSWORD ?? 'readonly';
    use(Buffer.from(`${username}:${password}`).toString('base64'));
  },
  engineerAuthToken: ({}, use) => {
    const username = process.env.USER_ENGINEER_USERNAME ?? 'engineer';
    const password = process.env.USER_ENGINEER_PASSWORD ?? 'partsonly';
    use(Buffer.from(`${username}:${password}`).toString('base64'));
  },
  adminAuthToken: ({}, use) => {
    const username = process.env.USER_ADMIN_USERNAME ?? 'admin';
    const password = process.env.USER_ADMIN_PASSWORD ?? 'inventree';
    use(Buffer.from(`${username}:${password}`).toString('base64'));
  },
  partListEndpoint: process.env.ENDPOINT_PART_LIST ?? '/api/part/',
  partDetailEndpoint: process.env.ENDPOINT_PART_DETAIL ?? '/api/part/{id}/',
  partPricingEndpoint: process.env.ENDPOINT_PART_PRICING ?? '/api/part/{id}/pricing/',
  partRequirementsEndpoint: process.env.ENDPOINT_PART_REQUIREMENTS ?? '/api/part/{id}/requirements/',
  partBomEndpoint: process.env.ENDPOINT_PART_BOM ?? '/api/part/{id}/bom/',
  partBomValidateEndpoint: process.env.ENDPOINT_PART_BOM_VALIDATE ?? '/api/part/{id}/bom-validate/',
  stockListEndpoint: process.env.ENDPOINT_STOCK_LIST ?? '/api/stock/',
  partCategoryListEndpoint: process.env.ENDPOINT_PART_CATEGORY_LIST ?? '/api/part/category/',
  partCategoryDetailEndpoint: process.env.ENDPOINT_PART_CATEGORY_DETAIL ?? '/api/part/category/{id}/',
  apiCall: async ({ request }, use) => {
    const authToken = Buffer.from(`${process.env.USER_ALLACCESS_USERNAME ?? 'allaccess'}:${process.env.USER_ALLACCESS_PASSWORD ?? 'nolimits'}`).toString('base64');
    const makeCall = async (method: 'get' | 'post' | 'put' | 'patch' | 'delete', endpoint: string, payload?: any) => {
      const headers: Record<string, string> = {
        'Authorization': `Basic ${authToken}`,
      };
      if (payload !== undefined) {
        headers['Content-Type'] = 'application/json';
      }
      return await request[method](endpoint, { headers, data: payload });
    };
    await use(makeCall);
  },
  unauthApiCall: async ({ request }, use) => {
    const makeCall = async (method: 'get' | 'post' | 'put' | 'patch' | 'delete', endpoint: string, payload?: any) => {
      const headers: Record<string, string> = {};
      if (payload !== undefined) {
        headers['Content-Type'] = 'application/json';
      }
      return await request[method](endpoint, { headers, data: payload });
    };
    await use(makeCall);
  },
  readerApiCall: async ({ request }, use) => {
    const authToken = Buffer.from(`${process.env.USER_READER_USERNAME ?? 'reader'}:${process.env.USER_READER_PASSWORD ?? 'readonly'}`).toString('base64');
    const makeCall = async (method: 'get' | 'post' | 'put' | 'patch' | 'delete', endpoint: string, payload?: any) => {
      const headers: Record<string, string> = {
        'Authorization': `Basic ${authToken}`,
      };
      if (payload !== undefined) {
        headers['Content-Type'] = 'application/json';
      }
      return await request[method](endpoint, { headers, data: payload });
    };
    await use(makeCall);
  },
});