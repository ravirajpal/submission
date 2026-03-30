import { test, expect } from '../fixtures/api.fixtures';

// TC_API_PART_DELETE_001 ─ delete a part with no stock or orders
test('TC_API_PART_DELETE_001: Delete a part with no associated stock or orders', async ({
  apiCall,
  partListEndpoint,
  partDetailEndpoint,
}) => {
  // Create a fresh part with no stock
  const createResponse = await apiCall('post', partListEndpoint, {
    name: `Part_To_Delete_${Date.now()}`,
    description: 'Part to be deleted',
  });
  expect(createResponse.status()).toBe(201);
  const partId: number = (await createResponse.json()).pk;
  const detailUrl = partDetailEndpoint.replace('{id}', String(partId));

  // Mark part as inactive before deletion (InvenTree requires active=false to delete)
  const deactivateResponse = await apiCall('patch', detailUrl, { active: false });
  expect(deactivateResponse.status()).toBe(200);

  // Delete the part
  const deleteResponse = await apiCall('delete', detailUrl);
  expect(deleteResponse.status()).toBe(204);

  // Confirm deletion — subsequent GET must return 404
  const getResponse = await apiCall('get', detailUrl);
  expect(getResponse.status()).toBe(404);
});

// TC_API_PART_DELETE_002 ─ delete non-existent part → 404
test('TC_API_PART_DELETE_002: Delete non-existent part', async ({ apiCall, partDetailEndpoint }) => {
  const response = await apiCall('delete', partDetailEndpoint.replace('{id}', '999999'));

  expect(response.status()).toBe(404);

  const body = await response.json();
  expect(body).toHaveProperty('detail');
  expect(typeof body.detail).toBe('string');
  expect(body.detail.length).toBeGreaterThan(0);
});
