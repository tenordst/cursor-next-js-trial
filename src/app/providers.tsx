'use client';

import { ReactNode, useEffect } from 'react';

// Import the Amplify configuration
import '@/lib/amplify';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
} 