import { CircularProgress } from "@mui/material";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../config/config";
import { userConverter, Users } from "../model/Users";
import { doc, getDoc } from "firebase/firestore";
interface IAuthContextProps {
  currentUser: User | null;
}

const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: any;
}

const AuthProvider: React.FunctionComponent<AuthProviderProps> = (props) => {
  const { children } = props;
  const [currentUser, setCurrentuser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((users) => {
      setCurrentuser(users);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser: currentUser,
  };
  if (loading) return <CircularProgress />;
  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
