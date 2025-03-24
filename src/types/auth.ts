export interface AuthUser {
  username: string;
  userId: string;
  signInDetails?: {
    loginId: string;
  };
  attributes?: {
    given_name?: string;
    family_name?: string;
    email?: string;
  };
} 