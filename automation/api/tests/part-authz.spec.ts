import { test, expect } from '../fixtures/api.fixtures';

// TC_API_AUTHZ_001 — view-only user cannot POST to create a part
test('TC_API_AUTHZ_001: View-only user cannot POST to create a part', async ({
  readerApiCall,
  partListEndpoint,
}) => {
  const response = await readerApiCall('post', partListEndpoint, {
    name: `AuthZ_Test_Part_${Date.now()}`,
    description: 'Should be forbidden',
  });

  expect(response.status()).toBe(403);
  const body = await response.json();
  expect(body).toHaveProperty('detail');
  expect(typeof body.detail).toBe('string');
  expect(body.detail.length).toBeGreaterThan(0);
});

// TC_API_AUTHZ_002 — view-only user cannot DELETE a part
test('TC_API_AUTHZ_002: View-only user cannot DELETE a part', async ({
  apiCall,
  readerApiCall,
  partListEndpoint,
  partDetailEndpoint,
}) => {
  // Create a part with the full-access user to ensure a target exists
  const createRes = await apiCall('post', partListEndpoint, {
    name: `AuthZ_Delete_Target_${Date.now()}`,
    description: 'Part for authz delete test',
  });
  expect(createRes.status()).toBe(201);
  const partId: number = (await createRes.json()).pk;
  const detailUrl = partDetailEndpoint.replace('{id}', String(partId));

  // Attempt DELETE as reader
  const response = await readerApiCall('delete', detailUrl);
  expect(response.status()).toBe(403);
});

// TC_API_AUTHZ_003 — view-only user cannot PUT to update a part
test('TC_API_AUTHZ_003: View-only user cannot PUT to update a part', async ({
  apiCall,
  readerApiCall,
  partListEndpoint,
  partDetailEndpoint,
}) => {
  // Create a part with the full-access user to ensure a target exists
  const createRes = await apiCall('post', partListEndpoint, {
    name: `AuthZ_Update_Target_${Date.now()}`,
    description: 'Part for authz update test',
  });
  expect(createRes.status()).toBe(201);
  const partId: number = (await createRes.json()).pk;
  const detailUrl = partDetailEndpoint.replace('{id}', String(partId));

  // Attempt PUT as reader
  const response = await readerApiCall('put', detailUrl, {
    name: 'ShouldFail',
    description: 'Should be forbidden',
  });
  expect(response.status()).toBe(403);
});
