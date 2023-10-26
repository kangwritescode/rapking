import { GetSignedUrlConfig } from '@google-cloud/storage';
import { gcloudStorage } from './storage';

export async function generateSignedUrl(fileName: string, action: 'read' | 'write' | 'delete', contentType?: string) {
  const options = {
    version: 'v4',
    action: action,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    ...(contentType && { contentType })
  } as GetSignedUrlConfig;

  const [url] = await gcloudStorage.bucket('rapking').file(fileName).getSignedUrl(options);

  return url;
}
