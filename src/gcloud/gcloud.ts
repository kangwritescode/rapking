import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';

// Creates a client
const storage = new Storage({
  credentials: {
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnw/Pa7VTib0yj\n3Dfotnlkkxi2LuWvJFhED4WxRoQxc/IxMib9Tb2KZFWVFu7jpuiJ3yEAwFP/cpkL\nNfIPNEUs+zCpjdI6ubM1ACcpm7NmI9gEsrYpMHy1TG9jQ12d8V/iJEvvl20+0mHS\nn15DLVSRLyd08fw4PoaTmz3ZlH61ey/i9UVAa/twb67AGm5Waeh9v8qt45ltikQd\nTFvymr8N+MGs9q2d+DFrkoNR7nBXkoibJg16DvbVdmLnuE3NLeEwpnei1gw9UHiy\n1e4W8J8duT5hTTIk4r6PTOHDAcBEmnsRJKe3CJZhfdjHHIF7sKq86feOxdI3dlmf\nW8zNAulTAgMBAAECggEAPakcXilfyw/cS9ebZvl2WZxk90T6X2qM1Isd+L+xw5lZ\neXJ0+SHTGePxvqfcqqiEjHQJpcSKuvdMP94Wdzcfe75hLth03ee18bN6MWVMRSzE\nb0meATqUg3Ax+npelLgMJUpw7IEsAmyBzs+LbkZhcDE0H9v291cn0GW9EFTvU1T4\ncN0hGf+9ErDFOWl36dSSqZh6vOaiBPEHuv5OHvt6Uad5ox7aAkJLqcuTVYBRA1Pp\nidgo97NOM2FAAsvgf6yzmDuvG0F89CWJpz4YnrGkl2EjGtJp/CPtIqgcgS+7j1tv\n/aOWM+Tb4yzJZ04vegQRwNjMZvgIvITdYMZ7d8uo0QKBgQDcKw2F4XToyg15+rCN\n2yr2Io1ExK+PxyVC8PW9wM+sJufiozpi6jtS5ynM7c1hIYkHrvLqEddECd4ieu0T\ndg8PgcaTI5qXaga4HBFlrz9cKAOFtYIn9l9jL6IFjwHprJj/UpXhkDip1DKy2pUP\nhx4BEcI0BpJ1lspoIOUFX2xeMQKBgQDDEaAa6GmSbMK9jO9NN8I9II5p8eHhIVfV\nsw62quRcGdqFtDvpFV+L2NRRmxLp25QRB3llayiaPioKkqQdL/hmzze6jJtCbn+R\noxqkRhAaIeX3i9hsIMWsFigj7t9zzmpbIbyTpINlC6xwypUi3vHRJZlaM4HmZDay\nfX417c1KwwKBgQCp2bDqCv/FIzN4WfTgyyb+kbNITTBfjDPry7bZN6k+1xjnWCOP\n8cHoeBtgVEiwWU28lrQh7beTbsVm9kx1SgveW7DVDI+TpiEe4dBuEN+heeEVwuxx\nZfk6rKGjBitkmVnDB3RHepqsMd8W6dg7DXMRQiD/P963RqhJ4q6sEWyp0QKBgHsP\nI3HWLMOy2Se7QTv1cRQe9bjgXx8nacHms+GI7YcsyC6RBTqFwUD4CPlyWvwtCbu0\ne2D/uR2VGfCRkfbXzF0PXJjTGx9NlizKOIRprr7No8YG8wFDq3Bkie4hQ9ZK4c2b\n+tspbbrRIngFVRAqlWLb1WKSG+C8V8VCZdyfqGMBAoGBAJ5yYBP5stO9DMQ4lMYm\nExjb/Ac6f5sT1KMKMFEBB0J4XLawJkwq4iSBWvf+w9cYgAkxDm3JIF5lskdStL9U\nQJuNYbDK+/2qDRyVMCCFp6G/jJXmfvupoJqqe5RuiSF9pXB8AOzIGAOyemmB5V99\nR2i5S4hTyl+9r7IWx3jH2KSG\n-----END PRIVATE KEY-----\n",
    "client_email": "461350252166-compute@developer.gserviceaccount.com",
    "client_id": "105375713532649390181",
    "universe_domain": "googleapis.com"
  }
});

storage.bucket('rapking').setCorsConfiguration([
  {
    maxAgeSeconds: 3600,
    method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    origin: ['*'],
    responseHeader: ['*'],
  },
]);

export async function generateV4UploadSignedUrl(fileName: string) {
  const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: 'application/octet-stream',
  } as GetSignedUrlConfig;

  const [url] = await storage
    .bucket('rapking')
    .file(fileName)
    .getSignedUrl(options);

  return url;
}

export async function uploadFile(fileName: string, destination: string) {
  await storage.bucket('rapking').upload(fileName, {
    destination: destination,
  });
}

