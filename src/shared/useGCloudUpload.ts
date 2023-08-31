import { useEffect, useState } from 'react';
import { deleteFile, uploadFile } from 'src/gcloud/clientMethods';
import { api } from 'src/utils/api';
import { v4 } from 'uuid';

type UseGCloudUploadProps = {
  directory?: string;
  entityID?: string;
  currFileUrl: string | null;
  file?: File | null;
  namePrefix?: string;
  onUploadSuccess?: (url: string) => void;
};

type UseGCloudUploadReturn = {
  newFileUrl: string | null;
  isUploading: boolean;
};

export const useGCloudUpload = ({
  entityID,
  currFileUrl,
  directory,
  file,
  namePrefix,
  onUploadSuccess
}: UseGCloudUploadProps): UseGCloudUploadReturn => {

  const [isUploading, setIsUploading] = useState(false);
  const [newFileUrl, setNewFileUrl] = useState('');

  useEffect(() => {
    if (file && entityID && directory && namePrefix) {
      const fileExtension = file.name.split('.').pop();
      setNewFileUrl(`${directory}/${entityID}/${namePrefix}-${v4()}.${fileExtension}`);
    }
    else if (!file) {
      setNewFileUrl('');
    }
  }, [file, entityID, directory, namePrefix]);

  // Queries and Mutations
  const { data: presignedWriteUrl } = api.gcloud.generateWriteUrl.useQuery({ fileName: newFileUrl }, { enabled: !!newFileUrl });
  const { data: presignedDeleteUrl } = api.gcloud.generateDeleteUrl.useQuery({ fileName: currFileUrl || '' }, { enabled: !!newFileUrl && !!currFileUrl });

  useEffect(() => {
    if (presignedWriteUrl && file && newFileUrl) {
      const upload = async () => {
        setIsUploading(true);
        try {
          await uploadFile(presignedWriteUrl, file);
          setIsUploading(false);
          if (onUploadSuccess) {
            onUploadSuccess(newFileUrl);
          }
          if (presignedDeleteUrl) {
            await deleteFile(presignedDeleteUrl);
          }
        } catch (error) {
          setIsUploading(false);
          console.error(error);
        }
      };
      upload();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presignedWriteUrl, file, newFileUrl, presignedDeleteUrl]);

  return {
    isUploading,
    newFileUrl,
  };
};
