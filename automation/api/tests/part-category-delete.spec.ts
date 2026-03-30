import { test, expect } from '../fixtures/api.fixtures';

// TC_API_CAT_DELETE_001 — delete an empty category (no parts, no subcategories)
test('TC_API_CAT_DELETE_001: Delete an empty part category', async ({
  apiCall,
  partCategoryListEndpoint,
  partCategoryDetailEndpoint,
}) => {
  // Create a fresh empty category to delete
  const createRes = await apiCall('post', partCategoryListEndpoint, {
    name: `Delete_Cat_${Date.now()}`,
    description: 'Category to be deleted',
  });
  expect(createRes.status()).toBe(201);
  const categoryId: number = (await createRes.json()).pk;
  const detailUrl = partCategoryDetailEndpoint.replace('{id}', String(categoryId));

  const deleteRes = await apiCall('delete', detailUrl);
  expect(deleteRes.status()).toBe(204);

  // Confirm deletion — subsequent GET must return 404
  const getRes = await apiCall('get', detailUrl);
  expect(getRes.status()).toBe(404);
});

// TC_API_CAT_DELETE_002 — delete non-existent category → 404
test('TC_API_CAT_DELETE_002: Delete a non-existent part category returns 404', async ({
  apiCall,
  partCategoryDetailEndpoint,
}) => {
  const response = await apiCall('delete', partCategoryDetailEndpoint.replace('{id}', '99999'));
  expect(response.status()).toBe(404);

  const body = await response.json();
  expect(body).toHaveProperty('detail');
  expect(typeof body.detail).toBe('string');
  expect(body.detail.length).toBeGreaterThan(0);
});
