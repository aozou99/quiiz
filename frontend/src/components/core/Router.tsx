import React, { lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";

const Index = lazy(() => import("components/main/quiz/Main"));
const Signup = lazy(() => import("components/main/auth/signUp/Main"));
const Signin = lazy(() => import("components/main/auth/signIn/Main"));
const Studio = lazy(() => import("components/main/studio/pc/Main"));
const NotFound = lazy(() => import("components/main/errors/NotFound"));
const InternalError = lazy(() =>
  import("components/main/errors/InternalError")
);

export default () => {
  const [user, loading] = useAuthState(firebase.auth());

  const authRedirectTop = (el: JSX.Element) => {
    return authRedirect(!!user, "/", el);
  };

  const guestRedirectSignin = (el: JSX.Element) => {
    return authRedirect(!user, "/signin", el);
  };

  const authRedirect = (
    authState: boolean,
    redirectTo: string,
    el: JSX.Element
  ) => {
    return ({ location }: any) => {
      if (!loading) {
        return authState ? (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: location },
            }}
          />
        ) : (
          el
        );
      } else {
        return (
          <Backdrop open>
            <CircularProgress color="inherit" />
          </Backdrop>
        );
      }
    };
  };

  return (
    <Switch>
      <Route path="/signup" render={authRedirectTop(<Signup />)} />
      <Route path="/signin" render={authRedirectTop(<Signin />)} />
      <Route path="/studio" render={guestRedirectSignin(<Studio />)} />
      <Route path="/404" component={NotFound} />
      <Route path="/500" component={InternalError} />
      <Route path="/" component={Index} />
    </Switch>
  );
};
