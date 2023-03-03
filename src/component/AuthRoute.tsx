import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import { auth, firestore } from "../config/config";
import { getDoc, doc } from "firebase/firestore";
import { userConverter, Users } from "../model/Users";
export interface IAuthRouteProps {
  children: any;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {

  const { children } = props;
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((users) => {
      if (users != null) {
        navigate("/");
      } else {
        navigate("/login");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <NavigationBar>{children}</NavigationBar>
    </>
  );
};

export default AuthRoute;
