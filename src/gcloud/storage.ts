import { Storage } from '@google-cloud/storage';
import { env } from 'src/env.mjs';

export const gcloudStorage = new Storage({
  credentials: {
    "private_key": env.GCLOUD_PRIVATE_KEY,
    "client_email": env.GCLOUD_CLIENT_EMAIL,
    "client_id": env.GCLOUD_CLIENT_ID,
  }
});

gcloudStorage.bucket('rapking').setCorsConfiguration([
  {
    maxAgeSeconds: 3600,
    method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    origin: ['*'],
    responseHeader: ['*'],
  },
]);