import { GetSignedUrlConfig } from '@google-cloud/storage';
import { gcloudStorage } from './storage';

export async function generateSignedUrl(
  fileName: string,
  action: 'read' | 'write' | 'delete',
  contentType?: string
) {
  const options = {
    version: 'v4',
    action: action,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    ...(contentType && { contentType })
  } as GetSignedUrlConfig;

  const [url] = await gcloudStorage.bucket('rapking_secure').file(fileName).getSignedUrl(options);

  return url;
}

export async function moveGCloudFile(
  bucketName: string,
  srcFilename: string,
  destFilename: string
) {
  const bucket = gcloudStorage.bucket(bucketName);
  const file = bucket.file(srcFilename);
  try {
    const response = file.move(destFilename);

    return response;
  } catch (error) {
    return null;
  }
}

export async function deleteGloudFile(bucketName: string, filename: string) {
  const bucket = gcloudStorage.bucket(bucketName);
  const file = bucket.file(filename);
  try {
    const response = file.delete();

    return response;
  } catch (error) {
    return null;
  }
}
