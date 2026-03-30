import { test, expect } from '../fixtures/api.fixtures';

// TC_API_CAT_UPDATE_002 — PATCH to change only description, name unchanged
test('TC_API_CAT_UPDATE_002: Partial update (PATCH) to change only description', async ({
  apiCall,
  partCategoryListEndpoint,
  partCategoryDetailEndpoint,
}) => {
  const originalName = `Update_Cat_${Date.now()}`;

  const createRes = await apiCall('post', partCategoryListEndpoint, {
    name: originalName,
    description: 'Original description',
  });
  expect(createRes.status()).toBe(201);
  const categoryId: number = (await createRes.json()).pk;
  const detailUrl = partCategoryDetailEndpoint.replace('{id}', String(categoryId));

  const patchRes = await apiCall('patch', detailUrl, {
    description: 'Patched description only',
  });
  expect(patchRes.status()).toBe(200);

  const patchBody = await patchRes.json();
  expect(patchBody.description).toBe('Patched description only');
  expect(patchBody.name).toBe(originalName);

  // Confirm persistence via GET
  const getBody = await (await apiCall('get', detailUrl)).json();
  expect(getBody.description).toBe('Patched description only');
  expect(getBody.name).toBe(originalName);
});
