import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 500 },
    { duration: '10s', target: 2000 },
    { duration: '10s', target: 3000 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  const response = http.get(
    'http://localhost:8001/api/v3/product/'
  );

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response under 1 second': (r) => r.timings.duration < 1000,
  });

  if (response.status !== 200) {
    console.log(
      `FAILED: status=${response.status}, ` +
      `duration=${response.timings.duration}ms`
    );
  }

  sleep(1);
}