import axios from "axios";

// Client side
export async function uploadFile(signedUrl: string, file: File) {
  return axios.put(signedUrl, file, {
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  })
}
