export const bucketPATH = 'http://34.36.116.199'

export const generateAssetUrl = (fileName: string) => {
  return `${bucketPATH}/${fileName}`
}
