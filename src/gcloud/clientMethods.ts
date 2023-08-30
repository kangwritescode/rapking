import axios from "axios";

export async function uploadFile(signedUrl: string, file: File) {
  return axios.put(signedUrl, file, {
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  })
}

export async function deleteFile(signedUrl: string) {
  return axios.delete(signedUrl);
}
