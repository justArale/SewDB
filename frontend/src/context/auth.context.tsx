import React, { useState, useEffect, ReactNode } from "react";
import {
  User,
  AuthContextType,
  authenticateUser,
  logoutUser,
} from "../service/user.service";

const AuthContext = React.createContext<AuthContextType | null>(null);

const AuthContextWrapper = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    authenticateUser()
      .then((user) => {
        if (user) {
          setIsLoggedIn(true);
          setUser(user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setAuthError(error?.message || "An error occurred");
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
      });
  }, []);

  const logoutClick = () => {
    logoutUser().then(() => {
      setIsLoggedIn(false);
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        authenticateUser,
        authError,
        logoutClick,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextWrapper, AuthContext };
