import { useState, useEffect } from 'react';
import { deleteFile, uploadFile } from 'src/gcloud/clientMethods';
import { api } from 'src/utils/api';
import { v4 } from 'uuid';

type UseGCloudUploadProps = {
  directory?: string;
  entityID?: string;
  currFileUrl?: string;
  file?: File | null;
  namePrefix?: string;
};

type UseGCloudUploadReturn = {
  newFileUrl: string | null;
  status: 'idle' | 'uploading' | 'success' | 'error';
};

export const useGCloudUpload = ({ entityID, currFileUrl, directory, file, namePrefix }: UseGCloudUploadProps): UseGCloudUploadReturn => {

  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  let newFileUrl = '';

  if (file && entityID && directory && namePrefix) {
    const fileExtension = file.name.split('.').pop();
    newFileUrl = `${directory}/${entityID}/${namePrefix}-${v4()}.${fileExtension}`;
  }

  // Queries and Mutations
  const { data: presignedWriteUrl } = api.gcloud.generateWriteUrl.useQuery({ fileName: newFileUrl }, { enabled: !!newFileUrl });
  const { data: presignedDeleteUrl } = api.gcloud.generateDeleteUrl.useQuery({ fileName: currFileUrl || '' }, { enabled: !!newFileUrl && !!currFileUrl });

  useEffect(() => {
    if (presignedWriteUrl && file && newFileUrl) {
      setStatus('uploading');
      const upload = async () => {
        try {
          await uploadFile(presignedWriteUrl, file);
          setStatus('success');
          if (presignedDeleteUrl) {
            await deleteFile(presignedDeleteUrl);
          }
        } catch (error) {
          setStatus('error');
          console.error(error);
        }
      };

      upload();
    }
  }, [presignedWriteUrl, file, newFileUrl, presignedDeleteUrl]);

  return {
    status,
    newFileUrl,
  };
};
