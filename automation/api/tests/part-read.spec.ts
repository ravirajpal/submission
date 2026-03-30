import { test, expect } from '../fixtures/api.fixtures';

// TC_API_PART_GET_001 ─ paginated list with at least 10 parts
test('TC_API_PART_GET_001: Retrieve paginated list of parts', async ({ apiCall, partListEndpoint }) => {
  // Ensure at least 10 parts exist
  const ts = Date.now();
  await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      apiCall('post', partListEndpoint, {
        name: `Paged_Part_${ts}_${i}`,
        description: `Pagination test part ${i}`,
      })
    )
  );

  const response = await apiCall('get', `${partListEndpoint}?limit=5&offset=0`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toHaveProperty('count');
  expect(body).toHaveProperty('results');
  expect(body).toHaveProperty('next');
  expect(body).toHaveProperty('previous');
  expect(body.count).toBeGreaterThanOrEqual(10);
  expect(Array.isArray(body.results)).toBe(true);
  expect(body.results).toHaveLength(5);
  expect(body.next).not.toBeNull();
  expect(body.previous).toBeNull();

  // Each item in results has the expected list-level fields
  for (const item of body.results) {
    expect(item).toHaveProperty('pk');
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('full_name');
    expect(item).toHaveProperty('thumbnail');
    expect(item).toHaveProperty('barcode_hash');
    expect(item).toHaveProperty('starred');
  }
});

// TC_API_PART_GET_002 ─ filter by category
test('TC_API_PART_GET_002: Filter parts by category', async ({ apiCall, partListEndpoint }) => {
  // Find an existing part that has a category assigned
  const listRes = await apiCall('get', `${partListEndpoint}?limit=50&offset=0`);
  expect(listRes.status()).toBe(200);
  const listBody = await listRes.json();
  const partWithCategory = listBody.results.find((p: any) => p.category !== null);

  if (!partWithCategory) {
    test.skip(true, 'No parts with a category assignment found on this server — skipping filter test');
    return;
  }

  const categoryId: number = partWithCategory.category;
  const response = await apiCall('get', `${partListEndpoint}?category=${categoryId}&limit=10&offset=0`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.count).toBeGreaterThanOrEqual(1);
  // The part we found must appear somewhere in the filtered results
  const allPks: number[] = body.results.map((p: any) => p.pk);
  expect(allPks).toContain(partWithCategory.pk);
});

// TC_API_PART_GET_003 ─ filter by assembly flag
test('TC_API_PART_GET_003: Filter parts by assembly flag', async ({ apiCall, partListEndpoint }) => {
  const ts = Date.now();
  const names = Array.from({ length: 3 }, (_, i) => `Assembly_Part_${ts}_${i}`);

  await Promise.all(
    names.map((name, i) =>
      apiCall('post', partListEndpoint, {
        name,
        description: `Assembly test part ${i}`,
        assembly: true,
      })
    )
  );

  const response = await apiCall('get', `${partListEndpoint}?assembly=true&limit=10&offset=0`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.count).toBeGreaterThanOrEqual(3);
  // All returned results must have assembly=true (filter correctness)
  for (const item of body.results) {
    expect(item.assembly).toBe(true);
  }
});

// TC_API_PART_GET_004 ─ filter by active=false
test('TC_API_PART_GET_004: Filter parts by active status (inactive)', async ({ apiCall, partListEndpoint }) => {
  const ts = Date.now();
  const names = Array.from({ length: 3 }, (_, i) => `Inactive_Part_${ts}_${i}`);

  await Promise.all(
    names.map((name, i) =>
      apiCall('post', partListEndpoint, {
        name,
        description: `Inactive test part ${i}`,
        active: false,
      })
    )
  );

  const response = await apiCall('get', `${partListEndpoint}?active=false&limit=10&offset=0`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.count).toBeGreaterThanOrEqual(3);
  // All returned results must have active=false (filter correctness)
  for (const item of body.results) {
    expect(item.active).toBe(false);
  }
});

// TC_API_PART_GET_005 ─ search by name / IPN
test('TC_API_PART_GET_005: Search parts by name and IPN', async ({ apiCall, partListEndpoint }) => {
  // Find an existing part that has an IPN set to use as the search target
  const listRes = await apiCall('get', `${partListEndpoint}?limit=50&offset=0`);
  expect(listRes.status()).toBe(200);
  const listBody = await listRes.json();
  const partWithIPN = listBody.results.find((p: any) => p.IPN && p.IPN.trim() !== '');

  if (!partWithIPN) {
    test.skip(true, 'No parts with an IPN found on this server — skipping IPN search test');
    return;
  }

  const searchIPN: string = partWithIPN.IPN;
  const response = await apiCall('get', `${partListEndpoint}?search=${encodeURIComponent(searchIPN)}&limit=20&offset=0`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.count).toBeGreaterThanOrEqual(1);
  const match = body.results.find((p: any) => p.IPN === searchIPN);
  expect(match).toBeDefined();
});

// TC_API_PART_GET_006 ─ order by name ascending then descending
test('TC_API_PART_GET_006: Order parts by name ascending and descending', async ({ apiCall, partListEndpoint }) => {
  const ascResponse = await apiCall('get', `${partListEndpoint}?ordering=name&limit=10&offset=0`);
  expect(ascResponse.status()).toBe(200);
  const ascBody = await ascResponse.json();
  expect(ascBody.results.length).toBeGreaterThan(0);

  const descResponse = await apiCall('get', `${partListEndpoint}?ordering=-name&limit=10&offset=0`);
  expect(descResponse.status()).toBe(200);
  const descBody = await descResponse.json();
  expect(descBody.results.length).toBeGreaterThan(0);

  // First result of ascending should sort before first result of descending
  const ascFirst: string = ascBody.results[0].name.toLowerCase();
  const descFirst: string = descBody.results[0].name.toLowerCase();
  expect(ascFirst <= descFirst).toBe(true);
});

// TC_API_PART_GET_007 ─ retrieve single part by valid pk
test('TC_API_PART_GET_007: Retrieve a single part by valid pk', async ({ apiCall, partListEndpoint, partDetailEndpoint }) => {
  // Use an existing part from the list to avoid relying on a POST succeeding
  const listRes = await apiCall('get', `${partListEndpoint}?limit=1&offset=0`);
  expect(listRes.status()).toBe(200);
  const listBody = await listRes.json();
  expect(listBody.results.length).toBeGreaterThan(0);
  const partId: number = listBody.results[0].pk;

  const response = await apiCall('get', `${partDetailEndpoint.replace('{id}', String(partId))}?parameters=true`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toHaveProperty('pk');
  expect(body).toHaveProperty('name');
  expect(body).toHaveProperty('description');
  expect(body).toHaveProperty('IPN');
  expect(body).toHaveProperty('category');
  expect(body).toHaveProperty('active');
  expect(body).toHaveProperty('assembly');
  expect(body).toHaveProperty('component');
  expect(body).toHaveProperty('purchaseable');
  expect(body).toHaveProperty('salable');
  expect(body).toHaveProperty('testable');
  expect(body).toHaveProperty('trackable');
  expect(body).toHaveProperty('virtual');
  expect(body).toHaveProperty('is_template');
  expect(body).toHaveProperty('variant_of');
  expect(body).toHaveProperty('revision');
  expect(body).toHaveProperty('in_stock');
  expect(body).toHaveProperty('total_in_stock');
  expect(body).toHaveProperty('allocated_to_build_orders');
  expect(body).toHaveProperty('allocated_to_sales_orders');
  expect(body).toHaveProperty('minimum_stock');
  expect(body).toHaveProperty('units');
  expect(body).toHaveProperty('full_name');
  expect(body).toHaveProperty('thumbnail');
  expect(body).toHaveProperty('starred');
  expect(body).toHaveProperty('barcode_hash');
  expect(body).toHaveProperty('parameters');
  expect(Array.isArray(body.parameters)).toBe(true);
});

// TC_API_PART_GET_008 ─ non-existent pk → 404
test('TC_API_PART_GET_008: Retrieve part with non-existent pk', async ({ apiCall, partDetailEndpoint }) => {
  const response = await apiCall('get', partDetailEndpoint.replace('{id}', '999999'));

  expect(response.status()).toBe(404);

  const body = await response.json();
  expect(body).toHaveProperty('detail');
  expect(typeof body.detail).toBe('string');
  expect(body.detail.length).toBeGreaterThan(0);
});
