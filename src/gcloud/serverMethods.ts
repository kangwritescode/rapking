import { GetSignedUrlConfig } from '@google-cloud/storage';
import { gcloudStorage } from './storage';

export async function generateV4UploadSignedUrl(fileName: string) {
  const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: 'application/octet-stream',
  } as GetSignedUrlConfig;

  const [url] = await gcloudStorage
    .bucket('rapking')
    .file(fileName)
    .getSignedUrl(options);

  return url;
}

