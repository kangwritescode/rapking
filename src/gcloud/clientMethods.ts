import axios from "axios";

export async function uploadToGCloud(signedUrl: string, file: File) {
  return axios.put(signedUrl, file, {
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  })
}

export async function deleteFromGCloud(signedUrl: string) {
  return axios.delete(signedUrl);
}
