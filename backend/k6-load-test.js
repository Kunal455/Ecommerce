import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';
const TEST_EMAIL = __ENV.TEST_EMAIL || 'testuser@example.com';
const TEST_PASSWORD = __ENV.TEST_PASSWORD || 'password123';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up to 50 VUs
    { duration: '30s', target: 100 }, // Ramp-up to 100 VUs
    { duration: '1m', target: 250 },  // Ramp-up to 250 VUs
    { duration: '1m', target: 500 },  // Ramp-up to 500 VUs
    { duration: '1m', target: 1000 }, // Peak at 1000 VUs
    { duration: '30s', target: 0 },   // Ramp-down to 0 VUs
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1s
  },
};

export function setup() {
  // Login to get token for subsequent requests
  const loginRes = http.post(`${BASE_URL}/api/v3/user/login`, JSON.stringify({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  let token = null;
  if (loginRes.status === 200) {
    token = loginRes.json('token');
  } else {
    console.error('Login failed in setup. Continuing without auth token.');
  }

  // Fetch some initial products to use their IDs for details test
  const productsRes = http.get(`${BASE_URL}/api/v3/product?limit=10`);
  let productIds = [];
  if (productsRes.status === 200 && productsRes.json('products')) {
    productIds = productsRes.json('products').map(p => p._id);
  }

  return { token, productIds };
}

export default function (data) {
  const { token, productIds } = data;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  // 1. Fetch Filters (Simulate opening the shop page)
  const filterRes = http.get(`${BASE_URL}/api/v3/product/filters`);
  check(filterRes, {
    'Filters fetched successfully': (r) => r.status === 200,
  });
  sleep(randomIntBetween(1, 3));

  // 2. Fetch Products with random pagination/search (Simulate browsing)
  const pages = [1, 2, 3];
  const randomPage = pages[Math.floor(Math.random() * pages.length)];
  const productRes = http.get(`${BASE_URL}/api/v3/product?page=${randomPage}&limit=20`);
  check(productRes, {
    'Products fetched successfully': (r) => r.status === 200,
  });
  sleep(randomIntBetween(1, 3));

  // 3. Fetch Product Details (Simulate clicking on a product)
  if (productIds && productIds.length > 0) {
    const randomProductId = productIds[Math.floor(Math.random() * productIds.length)];
    const detailsRes = http.get(`${BASE_URL}/api/v3/product/${randomProductId}`);
    check(detailsRes, {
      'Product details fetched successfully': (r) => r.status === 200,
    });
    sleep(randomIntBetween(1, 3));
  }

  // 4. Fetch Cart (If logged in)
  if (token) {
    const cartRes = http.get(`${BASE_URL}/api/v3/cart`, { headers });
    check(cartRes, {
      'Cart fetched successfully': (r) => r.status === 200 || r.status === 404, // 404 if cart is empty
    });
  }
  
  // Note: Add/Remove cart and Checkout are omitted from massive concurrent tests 
  // to avoid database bloating, since 1000 VUs would create ~5000 records per minute.
  // For write-heavy testing, limit the VU count or use a separate script.
  sleep(randomIntBetween(2, 5));
}
