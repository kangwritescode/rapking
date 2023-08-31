import { deleteFromGCloud } from 'src/gcloud/clientMethods';
import { api } from 'src/utils/api';

type UseGCloudDeleteProps = {
  url: string;
};

type UseGCloudDeleteReturn = {
  deleteFile: () => void;
};

export const useGCloudDelete = ({ url }: UseGCloudDeleteProps): UseGCloudDeleteReturn => {

  // Queries and Mutations
  const { data: presignedDeleteUrl } = api.gcloud.generateDeleteUrl.useQuery({ fileName: url || '' }, { enabled: !!url });

  const deleteFile = () => {
    if (presignedDeleteUrl) {
      deleteFromGCloud(presignedDeleteUrl);
    }
  };

  return {
    deleteFile
  };
};
