import { Storage } from '@google-cloud/storage';
import { env } from 'src/env.mjs';

export const gcloudStorage = new Storage({
  credentials: {
    private_key: env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: env.GCLOUD_CLIENT_EMAIL,
    client_id: env.GCLOUD_CLIENT_ID
  }
});

const corsConfiguration = [
  {
    maxAgeSeconds: 3600,
    method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    origin: ['https://rapking.io', 'https://www.rapking.io', 'http://localhost:3000'],
    responseHeader: [
      'Content-Type',
      'Access-Control-Allow-Origin',
      'Authorization',
      'Content-Length',
      'User-Agent',
      'X-Requested-With',
      'If-Modified-Since',
      'Cache-Control',
      'Range'
    ]
  }
];

const bucketName = 'rapking_secure';

gcloudStorage
  .bucket(bucketName)
  .setCorsConfiguration(corsConfiguration)
  .then(() => {
    console.log(`CORS configuration updated for bucket ${bucketName}`);
  })
  .catch(error => {
    console.error('Failed to update CORS configuration:', error);
  });
