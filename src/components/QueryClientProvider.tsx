import React, { type FC, type ReactNode } from 'react';

import { QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '../queryClient/queryClient';

type Props = {
  children: ReactNode;
};

const QueryClientProvider: FC<Props> = ({ children }) => {
  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
    </TanStackQueryClientProvider>
  );
};

export default QueryClientProvider;
