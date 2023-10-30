import { useEffect, useState } from 'react';
import { uploadToGCloud } from 'src/gcloud/clientMethods';
import { api } from 'src/utils/api';
import { v4 } from 'uuid';

type UseGCloudUploadProps = {
  path: string;
  file?: File | null;
  filename: string;
  onUploadSuccess?: (url: string) => void;
};

type UseGCloudUploadReturn = {
  newFileUrl: string | null;
  isUploading: boolean;
};

export const useGCloudUpload = ({
  path,
  file,
  filename,
  onUploadSuccess
}: UseGCloudUploadProps): UseGCloudUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [newFileUrl, setNewFileUrl] = useState('');

  useEffect(() => {
    if (file && filename) {
      const fileExtension = file.name.split('.').pop();
      setNewFileUrl(`${path}/${filename}-${v4()}.${fileExtension}`);
    } else if (!file) {
      setNewFileUrl('');
    }
  }, [file, filename, path]);

  // Queries and Mutations
  const { data: presignedWriteUrl } = api.gcloud.generateWriteUrl.useQuery(
    { fileName: newFileUrl },
    { enabled: !!newFileUrl, refetchOnMount: false, refetchOnReconnect: false, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (presignedWriteUrl && file && newFileUrl) {
      const upload = async () => {
        setIsUploading(true);
        try {
          await uploadToGCloud(presignedWriteUrl, file);
          setIsUploading(false);
          if (onUploadSuccess) {
            onUploadSuccess(newFileUrl);
          }
        } catch (error) {
          setIsUploading(false);
          console.error(error);
        }
      };
      upload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presignedWriteUrl, file, newFileUrl]);

  return {
    isUploading,
    newFileUrl
  };
};
