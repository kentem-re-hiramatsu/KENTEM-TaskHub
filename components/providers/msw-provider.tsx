'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

export const MswProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(process.env.NEXT_PUBLIC_MSW !== 'true');

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MSW !== 'true') {
      setReady(true);
      return;
    }

    const startMsw = async () => {
      const { worker } = await import('@/mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
      });
      setReady(true);
    };

    void startMsw();
  }, []);

  if (!ready) return null;

  return <>{children}</>;
};
