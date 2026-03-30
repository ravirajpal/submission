import { test, expect } from '../fixtures/api.fixtures';

// Helper: create a minimal part and return its pk
async function createPart(apiCall: any, endpoint: string, overrides: Record<string, any> = {}): Promise<number> {
  const response = await apiCall('post', endpoint, {
    name: `Endpoint_Test_Part_${Date.now()}`,
    description: 'Part for endpoint tests',
    ...overrides,
  });
  expect(response.status()).toBe(201);
  return (await response.json()).pk;
}

// TC_API_PART_PRICING_001 ─ retrieve pricing information for a part
test('TC_API_PART_PRICING_001: Retrieve part pricing information', async ({
  apiCall,
  partListEndpoint,
  partPricingEndpoint,
}) => {
  const partId = await createPart(apiCall, partListEndpoint);
  const pricingUrl = partPricingEndpoint.replace('{id}', String(partId));

  const response = await apiCall('get', pricingUrl);
  expect(response.status()).toBe(200);

  const body = await response.json();
  // Assert all schema-defined pricing fields are present
  expect(body).toHaveProperty('currency');
  expect(body).toHaveProperty('updated');
  expect(body).toHaveProperty('scheduled_for_update');
  expect(body).toHaveProperty('bom_cost_min');
  expect(body).toHaveProperty('bom_cost_max');
  expect(body).toHaveProperty('purchase_cost_min');
  expect(body).toHaveProperty('purchase_cost_max');
  expect(body).toHaveProperty('supplier_price_min');
  expect(body).toHaveProperty('supplier_price_max');
  expect(body).toHaveProperty('overall_min');
  expect(body).toHaveProperty('overall_max');
  expect(body.scheduled_for_update).toEqual(expect.any(Boolean));
});

// TC_API_PART_REQ_001 ─ retrieve part requirements (stock & allocation data)
test('TC_API_PART_REQ_001: Retrieve part requirements', async ({
  apiCall,
  partListEndpoint,
  partRequirementsEndpoint,
}) => {
  const partId = await createPart(apiCall, partListEndpoint);
  const reqUrl = partRequirementsEndpoint.replace('{id}', String(partId));

  const response = await apiCall('get', reqUrl);
  expect(response.status()).toBe(200);

  const body = await response.json();
  // All fields are numerics per the OpenAPI PartRequirements schema
  expect(body).toHaveProperty('total_stock');
  expect(body).toHaveProperty('unallocated_stock');
  expect(body).toHaveProperty('can_build');
  expect(body).toHaveProperty('ordering');
  expect(body).toHaveProperty('building');
  expect(body).toHaveProperty('scheduled_to_build');
  expect(body).toHaveProperty('required_for_build_orders');
  expect(body).toHaveProperty('allocated_to_build_orders');
  expect(body).toHaveProperty('required_for_sales_orders');
  expect(body).toHaveProperty('allocated_to_sales_orders');
  expect(typeof body.total_stock).toBe('number');
  expect(typeof body.allocated_to_build_orders).toBe('number');
  expect(typeof body.allocated_to_sales_orders).toBe('number');
});

// TC_API_PART_BOM_001 ─ validate BOM for an assembly part
test('TC_API_PART_BOM_001: Validate BOM for an assembly part', async ({
  apiCall,
  partListEndpoint,
  partBomValidateEndpoint,
}) => {
  // BOM validation applies to assembly parts
  const partId = await createPart(apiCall, partListEndpoint, { assembly: true });
  const bomValidateUrl = partBomValidateEndpoint.replace('{id}', String(partId));

  // PUT with valid=true — InvenTree runs this as a background task and may return
  // a task envelope { task_id, pending, complete, ... } instead of the schema directly.
  const response = await apiCall('put', bomValidateUrl, { valid: true });
  expect(response.status()).toBe(200);

  const body = await response.json();

  if (body.task_id !== undefined) {
    // Async path: poll the bom-validate GET until it returns the PartBomValidate object
    const maxAttempts = 10;
    const delayMs = 1000;
    let resultBody: any = null;

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, delayMs));
      const pollRes = await apiCall('get', bomValidateUrl);
      expect(pollRes.status()).toBe(200);
      const pollBody = await pollRes.json();
      // Task is done when the response contains bom_validated (PartBomValidate schema)
      // rather than the task envelope { task_id, pending, complete, ... }
      if (pollBody.bom_validated !== undefined) {
        resultBody = pollBody;
        break;
      }
    }

    expect(resultBody).not.toBeNull();
    expect(resultBody.bom_validated).toBe(true);
    expect(resultBody).toHaveProperty('bom_checked_date');
    expect(resultBody).toHaveProperty('bom_checksum');
  } else {
    // Sync path: response is PartBomValidate directly
    expect(body).toHaveProperty('bom_validated');
    expect(body.bom_validated).toBe(true);
    expect(body).toHaveProperty('bom_checked_date');
    expect(body).toHaveProperty('bom_checksum');
  }
});
