import React, { type FC, type ReactNode } from 'react';

import { SQLiteProvider } from 'expo-sqlite';

import { runMigrations } from './migrations';

type Props = {
  children: ReactNode;
};

const DatabaseProvider: FC<Props> = ({ children }) => {
  return (
    <SQLiteProvider databaseName="pace.db" onInit={runMigrations}>
      {children}
    </SQLiteProvider>
  );
};

export default DatabaseProvider;
