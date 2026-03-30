import { test, expect } from '../fixtures/api.fixtures';

// TC_API_CAT_CREATE_001 — top-level category with required fields
test('TC_API_CAT_CREATE_001: Create a top-level part category with required fields', async ({
  apiCall,
  partCategoryListEndpoint,
}) => {
  const payload = {
    name: `Resistors_${Date.now()}`,
    description: 'All resistor types',
  };

  const response = await apiCall('post', partCategoryListEndpoint, payload);
  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.pk).toEqual(expect.any(Number));
  expect(body.pk).toBeGreaterThan(0);
  expect(body.name).toBe(payload.name);
  expect(body.description).toBe(payload.description);
  expect(body.parent).toBeNull();
  expect(body).toHaveProperty('pathstring');
  expect(body).toHaveProperty('level');
  expect(body).toHaveProperty('part_count');
  expect(body).toHaveProperty('subcategories');
  expect(body).toHaveProperty('starred');
});

// TC_API_CAT_CREATE_002 — child category under existing parent
test('TC_API_CAT_CREATE_002: Create a child category under an existing parent', async ({
  apiCall,
  partCategoryListEndpoint,
  partCategoryDetailEndpoint,
}) => {
  // Create a dedicated parent to avoid relying on a fixed server pk
  const parentRes = await apiCall('post', partCategoryListEndpoint, {
    name: `Parent_Cat_${Date.now()}`,
    description: 'Parent for child category test',
  });
  expect(parentRes.status()).toBe(201);
  const parentId: number = (await parentRes.json()).pk;

  const payload = {
    name: `Capacitors_${Date.now()}`,
    description: 'Ceramic and electrolytic capacitors',
    parent: parentId,
  };

  const createRes = await apiCall('post', partCategoryListEndpoint, payload);
  expect(createRes.status()).toBe(201);

  const body = await createRes.json();
  expect(body.parent).toBe(parentId);
  expect(body.level).toBeGreaterThanOrEqual(1);
  expect(body.pathstring).toContain(payload.name);

  // Confirm via GET
  const getRes = await apiCall('get', partCategoryDetailEndpoint.replace('{id}', String(body.pk)));
  expect(getRes.status()).toBe(200);
  expect((await getRes.json()).parent).toBe(parentId);
});

// TC_API_CAT_CREATE_004 — missing required 'name' → 400
test('TC_API_CAT_CREATE_004: Create a category without required name field', async ({
  apiCall,
  partCategoryListEndpoint,
}) => {
  const response = await apiCall('post', partCategoryListEndpoint, {
    description: 'No name given',
  });

  expect(response.status()).toBe(400);
  const errorBody = await response.json();
  expect(errorBody).toHaveProperty('name');
  const nameErrors: string[] = errorBody.name;
  expect(nameErrors.some((msg: string) => msg.toLowerCase().includes('required'))).toBe(true);
});

// TC_API_CAT_CREATE_005 — name exceeding max length (100 chars) → 400
test('TC_API_CAT_CREATE_005: Create a category with name exceeding max length of 100 characters', async ({
  apiCall,
  partCategoryListEndpoint,
}) => {
  const overLengthName = 'A'.repeat(101);

  const response = await apiCall('post', partCategoryListEndpoint, {
    name: overLengthName,
  });

  expect(response.status()).toBe(400);
  const errorBody = await response.json();
  expect(errorBody).toHaveProperty('name');
  const nameErrors: string[] = errorBody.name;
  expect(
    nameErrors.some(
      (msg: string) =>
        msg.toLowerCase().includes('100') ||
        msg.toLowerCase().includes('max') ||
        msg.toLowerCase().includes('ensure this field')
    )
  ).toBe(true);
});

// TC_API_CAT_AUTH_001 — create category without authentication → 401
test('TC_API_CAT_AUTH_001: Attempt to create a category without authentication', async ({
  unauthApiCall,
  partCategoryListEndpoint,
}) => {
  const response = await unauthApiCall('post', partCategoryListEndpoint, {
    name: 'Unauthenticated',
  });

  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body).toHaveProperty('detail');
  expect(typeof body.detail).toBe('string');
  expect(body.detail.length).toBeGreaterThan(0);
});
