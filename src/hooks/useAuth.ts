import { useState, useEffect } from 'react';
import { signIn, signOut, getCurrentUser, updateUserAttributes, fetchUserAttributes, type AuthUser, type UserAttributeKey } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

interface UseAuthReturn {
  user: AuthUser | null;
  userAttributes: Partial<Record<UserAttributeKey, string>> | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (attributes: { given_name?: string; family_name?: string }) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userAttributes, setUserAttributes] = useState<Partial<Record<UserAttributeKey, string>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkAuthState = async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);
      const attributes = await fetchUserAttributes();
      setUserAttributes(attributes);
    } catch (error) {
      setUser(null);
      setUserAttributes(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { isSignedIn } = await signIn({ username: email, password });
      if (isSignedIn) {
        const user = await getCurrentUser();
        setUser(user);
        const attributes = await fetchUserAttributes();
        setUserAttributes(attributes);
        router.push('/dashboard');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred during sign in');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ global: true });
      setUser(null);
      setUserAttributes(null);
      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred during sign out');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (attributes: { given_name?: string; family_name?: string }) => {
    setLoading(true);
    setError(null);
    try {
      await updateUserAttributes({
        userAttributes: attributes
      });
      // Refresh user data
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
      const updatedAttributes = await fetchUserAttributes();
      setUserAttributes(updatedAttributes);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while updating profile');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    userAttributes,
    signIn: handleSignIn,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    loading,
    error,
  };
}; 