import { test, expect } from '../fixtures/api.fixtures';

// TC_API_CAT_GET_001 — paginated list of part categories
test('TC_API_CAT_GET_001: Retrieve paginated list of part categories', async ({
  apiCall,
  partCategoryListEndpoint,
}) => {
  // Create 5 categories to guarantee enough records for pagination at limit=3
  const ts = Date.now();
  await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      apiCall('post', partCategoryListEndpoint, {
        name: `Paged_Cat_${ts}_${i}`,
        description: `Pagination test category ${i}`,
      })
    )
  );

  const response = await apiCall('get', `${partCategoryListEndpoint}?limit=3&offset=0`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toHaveProperty('count');
  expect(body).toHaveProperty('results');
  expect(body).toHaveProperty('next');
  expect(body).toHaveProperty('previous');
  expect(body.count).toBeGreaterThanOrEqual(5);
  expect(Array.isArray(body.results)).toBe(true);
  expect(body.results).toHaveLength(3);
  expect(body.next).not.toBeNull();
  expect(body.previous).toBeNull();

  for (const item of body.results) {
    expect(item).toHaveProperty('pk');
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('pathstring');
    expect(item).toHaveProperty('level');
  }
});

// TC_API_CAT_GET_004 — search categories by name keyword
test('TC_API_CAT_GET_004: Search categories by name keyword', async ({
  apiCall,
  partCategoryListEndpoint,
}) => {
  const uniqueToken = `SearchTarget_${Date.now()}`;

  const createRes = await apiCall('post', partCategoryListEndpoint, {
    name: uniqueToken,
    description: 'Category for search test',
  });
  expect(createRes.status()).toBe(201);

  const response = await apiCall(
    'get',
    `${partCategoryListEndpoint}?search=${encodeURIComponent(uniqueToken)}&limit=20&offset=0`
  );
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.count).toBeGreaterThanOrEqual(1);
  const match = body.results.find((c: any) => c.name === uniqueToken);
  expect(match).toBeDefined();
});

// TC_API_CAT_GET_005 — retrieve single category by valid pk
test('TC_API_CAT_GET_005: Retrieve a single part category by valid pk', async ({
  apiCall,
  partCategoryListEndpoint,
  partCategoryDetailEndpoint,
}) => {
  const createRes = await apiCall('post', partCategoryListEndpoint, {
    name: `Detail_Cat_${Date.now()}`,
    description: 'Category for detail GET validation',
  });
  expect(createRes.status()).toBe(201);
  const categoryId: number = (await createRes.json()).pk;

  const response = await apiCall('get', partCategoryDetailEndpoint.replace('{id}', String(categoryId)));
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.pk).toBe(categoryId);
  expect(body).toHaveProperty('name');
  expect(body).toHaveProperty('description');
  expect(body).toHaveProperty('parent');
  expect(body).toHaveProperty('pathstring');
  expect(body).toHaveProperty('level');
  expect(body).toHaveProperty('part_count');
  expect(body).toHaveProperty('subcategories');
  expect(body).toHaveProperty('starred');
  expect(body).toHaveProperty('structural');
  expect(body).toHaveProperty('icon');
  expect(body).toHaveProperty('default_location');
});

// TC_API_CAT_GET_006 — retrieve category with non-existent pk → 404
test('TC_API_CAT_GET_006: Retrieve a category with non-existent pk returns 404', async ({
  apiCall,
  partCategoryDetailEndpoint,
}) => {
  const response = await apiCall('get', partCategoryDetailEndpoint.replace('{id}', '99999'));
  expect(response.status()).toBe(404);

  const body = await response.json();
  expect(body).toHaveProperty('detail');
  expect(typeof body.detail).toBe('string');
  expect(body.detail.length).toBeGreaterThan(0);
});
