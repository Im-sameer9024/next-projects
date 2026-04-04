type AppWriteProps = {
  endpoint: string ;
  project_id: string;
  project_api_key: string;
};

type AppWrite = {
  appwrite: AppWriteProps;
};

const env: AppWrite = {
  appwrite: {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    project_id: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
    project_api_key: process.env.NEXT_APPWRITE_API_KEY!,
  },
};

export default env;
