import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 100 },
    { duration: '20s', target: 500 },
    { duration: '20s', target: 1000 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  const response = http.get(
    'https://ecommerce-ybq0.onrender.com/api/v3/product/'
  );

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response under 1 second': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}