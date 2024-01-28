import { deleteFromGCloud } from 'src/gcloud/clientMethods';
import { api } from 'src/utils/api';

type UseGCloudDeleteProps = {
  url: string;
  isAuthenticated: boolean;
};

type UseGCloudDeleteReturn = {
  deleteFile: () => void;
};

export const useGCloudDelete = ({
  url,
  isAuthenticated
}: UseGCloudDeleteProps): UseGCloudDeleteReturn => {
  // Queries and Mutations
  const { data: presignedDeleteUrl } = api.gcloud.generateDeleteUrl.useQuery(
    { fileName: url || '' },
    { enabled: !!url && isAuthenticated }
  );

  const deleteFile = () => {
    if (presignedDeleteUrl) {
      deleteFromGCloud(presignedDeleteUrl);
    }
  };

  return {
    deleteFile
  };
};
