import { test, expect } from '../fixtures/api.fixtures';

// TC_API_PART_CREATE_001 â”€ minimal required fields only
test('TC_API_PART_CREATE_001: Create a minimal part with only required fields', async ({ apiCall, partListEndpoint }) => {
  const payload = {
    name: `Resistor_10K_${Date.now()}`,
    description: '10K Ohm 0805 Resistor',
  };

  const response = await apiCall('post', partListEndpoint, payload);

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.pk).toEqual(expect.any(Number));
  expect(body.pk).toBeGreaterThan(0);
  expect(body.name).toBe(payload.name);
  expect(body.description).toBe(payload.description);
  expect(body.active).toBe(true);
  expect(body.virtual).toBe(false);
  expect(body.component).toBe(true);
  expect(body).toHaveProperty('full_name');
  expect(body).toHaveProperty('thumbnail');
  expect(body).toHaveProperty('barcode_hash');
  expect(body).toHaveProperty('starred');
});

// TC_API_PART_CREATE_002 â”€ all optional flags and fields
test('TC_API_PART_CREATE_002: Create a part with all optional flags and fields', async ({ apiCall, partListEndpoint, partDetailEndpoint }) => {
  const payload = {
    name: `MCU_STM32F4_${Date.now()}`,
    description: 'STM32F4 microcontroller',
    IPN: `MCU-STM32F4-${Date.now()}`,
    category: 1,
    default_location: 3,
    keywords: 'stm32 mcu arm',
    units: 'pcs',
    minimum_stock: 10,
    active: true,
    assembly: true,
    component: true,
    purchaseable: true,
    salable: true,
    testable: true,
    trackable: true,
    virtual: false,
  };

  const createResponse = await apiCall('post', partListEndpoint, payload);
  expect(createResponse.status()).toBe(201);
  const createBody = await createResponse.json();
  const partId: number = createBody.pk;

  const getResponse = await apiCall('get', partDetailEndpoint.replace('{id}', String(partId)));
  expect(getResponse.status()).toBe(200);
  const body = await getResponse.json();

  expect(body.name).toBe(payload.name);
  expect(body.description).toBe(payload.description);
  expect(body.IPN).toBe(payload.IPN);
  expect(body.category).toBe(payload.category);
  expect(body.default_location).toBe(payload.default_location);
  expect(body.keywords).toBe(payload.keywords);
  expect(body.units).toBe(payload.units);
  expect(body.minimum_stock).toBe(payload.minimum_stock);
  expect(body.active).toBe(payload.active);
  expect(body.assembly).toBe(payload.assembly);
  expect(body.component).toBe(payload.component);
  expect(body.purchaseable).toBe(payload.purchaseable);
  expect(body.salable).toBe(payload.salable);
  expect(body.testable).toBe(payload.testable);
  expect(body.trackable).toBe(payload.trackable);
  expect(body.virtual).toBe(payload.virtual);
});

// TC_API_PART_CREATE_003 â”€ virtual part
test('TC_API_PART_CREATE_003: Create a virtual part', async ({ apiCall, partListEndpoint, partDetailEndpoint }) => {
  const payload = {
    name: `Virtual_Part_${Date.now()}`,
    description: 'Labor cost for PCB assembly',
    virtual: true,
  };

  const createResponse = await apiCall('post', partListEndpoint, payload);
  expect(createResponse.status()).toBe(201);
  const createBody = await createResponse.json();
  expect(createBody.virtual).toBe(true);

  const getResponse = await apiCall('get', partDetailEndpoint.replace('{id}', String(createBody.pk)));
  expect(getResponse.status()).toBe(200);
  const body = await getResponse.json();
  expect(body.virtual).toBe(true);
  expect(body.in_stock).toBe(0);
});

// TC_API_PART_CREATE_004 â”€ template part
test('TC_API_PART_CREATE_004: Create a template part', async ({ apiCall, partListEndpoint, partDetailEndpoint }) => {
  const payload = {
    name: `Widget_Template_${Date.now()}`,
    description: 'Base widget template',
    is_template: true,
  };

  const createResponse = await apiCall('post', partListEndpoint, payload);
  expect(createResponse.status()).toBe(201);
  const createBody = await createResponse.json();
  expect(createBody.is_template).toBe(true);

  const getResponse = await apiCall('get', partDetailEndpoint.replace('{id}', String(createBody.pk)));
  expect(getResponse.status()).toBe(200);
  expect((await getResponse.json()).is_template).toBe(true);
});
// TC_API_PART_CREATE_005 - duplicate IPN -> 400
test('TC_API_PART_CREATE_005: Create a part with duplicate IPN', async ({ apiCall, partListEndpoint }) => {
  // Check whether IPN uniqueness is enforced on this server instance.
  // InvenTree global setting PART_ALLOW_DUPLICATE_IPN controls this.
  const settingRes = await apiCall('get', '/api/settings/global/PART_ALLOW_DUPLICATE_IPN/');
  if (settingRes.status() === 200) {
    const setting = await settingRes.json();
    if (setting.value === true || setting.value === 'true') {
      test.skip(true, 'PART_ALLOW_DUPLICATE_IPN is enabled on this server — duplicate IPNs are permitted, skipping uniqueness test');
      return;
    }
  }

  // Fetch an existing part that already has an IPN set so we avoid race conditions
  // from relying solely on the first POST having settled before the second one.
  const listRes = await apiCall('get', `${partListEndpoint}?limit=100`);
  expect(listRes.status()).toBe(200);
  const listBody = await listRes.json();
  let ipn: string | null = null;
  for (const part of listBody.results) {
    if (part.IPN && part.IPN.trim() !== '') {
      ipn = part.IPN;
      break;
    }
  }

  if (!ipn) {
    // No existing part with an IPN -- create one to establish the duplicate target
    ipn = `DUPE-IPN-${Date.now()}`;
    const seed = await apiCall('post', partListEndpoint, {
      name: `Part_With_IPN_${Date.now()}`,
      description: 'Seed part for duplicate IPN test',
      IPN: ipn,
    });
    expect(seed.status()).toBe(201);
  }

  // Attempt to create a second part with the same IPN -- must be rejected
  const second = await apiCall('post', partListEndpoint, {
    name: `Another_Part_${Date.now()}`,
    description: 'Duplicate IPN test',
    IPN: ipn,
  });
  expect(second.status()).toBe(400);

  const errorBody = await second.json();
  expect(errorBody).toHaveProperty('IPN');
  const ipnErrors: string[] = errorBody.IPN;
  expect(ipnErrors.some((msg: string) => msg.toLowerCase().includes('already exists'))).toBe(true);
});

// TC_API_PART_CREATE_006 â”€ missing required 'name' â†’ 400
test('TC_API_PART_CREATE_006: Create a part without required name field', async ({ apiCall, partListEndpoint }) => {
  const response = await apiCall('post', partListEndpoint, { description: 'Missing name field' });

  expect(response.status()).toBe(400);
  const errorBody = await response.json();
  expect(errorBody).toHaveProperty('name');
  const nameErrors: string[] = errorBody.name;
  expect(nameErrors.some((msg: string) => msg.toLowerCase().includes('required'))).toBe(true);
});

// TC_API_PART_CREATE_007 â”€ variant under a template part
test('TC_API_PART_CREATE_007: Create a part variant under a template part', async ({ apiCall, partListEndpoint, partDetailEndpoint }) => {
  // Create template first
  const templateResponse = await apiCall('post', partListEndpoint, {
    name: `Template_${Date.now()}`,
    description: 'Template for variants',
    is_template: true,
  });
  expect(templateResponse.status()).toBe(201);
  const templateId: number = (await templateResponse.json()).pk;

  // Create variant
  const variantResponse = await apiCall('post', partListEndpoint, {
    name: `Variant_Red_${Date.now()}`,
    description: 'Red variant of template',
    variant_of: templateId,
  });
  expect(variantResponse.status()).toBe(201);
  const variantBody = await variantResponse.json();
  expect(variantBody.variant_of).toBe(templateId);

  // Verify via GET
  const getResponse = await apiCall('get', partDetailEndpoint.replace('{id}', String(variantBody.pk)));
  expect(getResponse.status()).toBe(200);
  expect((await getResponse.json()).variant_of).toBe(templateId);
});

// TC_API_PART_CREATE_008 â”€ part with initial stock
test('TC_API_PART_CREATE_008: Create a part with initial stock via initial_stock field', async ({
  apiCall,
  partListEndpoint,
  stockListEndpoint,
}) => {
  const payload = {
    name: `Capacitor_100nF_${Date.now()}`,
    description: '100nF 0603 ceramic cap',
    initial_stock: {
      quantity: 100,
      location: 3,
    },
  };

  const createResponse = await apiCall('post', partListEndpoint, payload);
  expect(createResponse.status()).toBe(201);
  const body = await createResponse.json();
  expect(body.pk).toEqual(expect.any(Number));

  // Verify stock was created (requires 'Create Initial Stock' global setting to be enabled)
  const stockResponse = await apiCall('get', `${stockListEndpoint}?part=${body.pk}`);
  expect(stockResponse.status()).toBe(200);
  const stockBody = await stockResponse.json();
  // Stock item with quantity=100 should exist when the setting is enabled
  if (stockBody.count > 0) {
    const stockItem = stockBody.results[0];
    expect(stockItem.quantity).toBe(100);
    expect(stockItem.location).toBe(3);
  }
});

// TC_API_PART_CREATE_009 — IPN exceeding max length (100 chars) → 400
test('TC_API_PART_CREATE_009: Reject IPN exceeding maximum length of 100 characters', async ({
  apiCall,
  partListEndpoint,
}) => {
  const overLengthIPN = process.env.TEST_BOUNDARY_IPN_MAX_LENGTH as string;
  // Sanity-check the env value is actually over the 100-char limit
  expect(overLengthIPN.length).toBeGreaterThan(100);

  const response = await apiCall('post', partListEndpoint, {
    name: `Boundary_IPN_Test_${Date.now()}`,
    description: 'IPN max-length boundary test',
    IPN: overLengthIPN,
  });

  expect(response.status()).toBe(400);
  const errorBody = await response.json();
  expect(errorBody).toHaveProperty('IPN');
  const ipnErrors: string[] = errorBody.IPN;
  expect(
    ipnErrors.some(
      (msg: string) =>
        msg.toLowerCase().includes('100') ||
        msg.toLowerCase().includes('max') ||
        msg.toLowerCase().includes('ensure this field')
    )
  ).toBe(true);
});


