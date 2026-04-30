import React, { type FC, type ReactNode, createContext, useContext } from 'react';

type AuthState = {
  loading: boolean;
  username: string;
  createdAt: Date;
};

const AuthContext = createContext<{ state: AuthState }>({
  state: {
    loading: false,
    username: '',
    createdAt: new Date(2020, 0, 1),
  },
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{ state: { loading: false, username: '', createdAt: new Date(2020, 0, 1) } }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): { state: AuthState } => useContext(AuthContext);
