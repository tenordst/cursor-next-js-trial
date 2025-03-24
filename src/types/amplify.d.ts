declare module '@/amplifyconfiguration.json' {
  const config: {
    aws_project_region: string;
    aws_cognito_region: string;
    aws_user_pools_id: string;
    aws_user_pools_web_client_id: string;
    aws_mandatory_sign_in: string;
    oauth: Record<string, unknown>;
  };
  export default config;
} 