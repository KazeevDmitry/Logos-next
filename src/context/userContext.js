import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { auth, users } from '../../lib/api';

export const UserContext = createContext({
  currentUser: undefined,
  loading: true,
  isExpert: false,
  isAdmin: false,
});

/**
 * Who is signed in.
 *
 * `currentUser` is `undefined` while the session is being checked, `null`
 * for an anonymous visitor, and the user object from GET /users/me
 * otherwise. The session itself lives in httpOnly cookies; no token is
 * ever held in JavaScript.
 */
export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined);

  const refreshUser = useCallback(async () => {
    try {
      const user = await users.me();
      setCurrentUser(user);
      return user;
    } catch {
      setCurrentUser(null);
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } finally {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      refreshUser,
      logout,
      loading: currentUser === undefined,
      isExpert: currentUser?.role === 'EXPERT',
      isAdmin: currentUser?.role === 'ADMIN',
    }),
    [currentUser, refreshUser, logout],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  return useContext(UserContext);
}
