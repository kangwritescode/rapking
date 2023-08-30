export const CDN_URL = 'http://34.36.116.199'

export const generateAssetUrl = (fileName: string) => {
  return `${CDN_URL}/${fileName}`
}
