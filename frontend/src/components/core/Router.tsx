import React, { lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "modules/core/rootReducer";
import { isLoaded, isEmpty, FirebaseReducer } from "react-redux-firebase";
import { Backdrop, CircularProgress } from "@material-ui/core";

const Exercises = lazy(() => import("components/main/quiz/single/Main"));
const Index = lazy(() => import("components/main/quiz/Main"));
const Workbook = lazy(() => import("components/main/quiz/series/Main"));
const Signup = lazy(() => import("components/main/auth/signUp/Main"));
const Signin = lazy(() => import("components/main/auth/signIn/Main"));
const Studio = lazy(() => import("components/main/studio/pc/Main"));

const authRedirectTop = (el: JSX.Element, auth: FirebaseReducer.AuthState) => {
  return authRedirect(!isEmpty(auth), "/", el, auth);
};

const guestRedirectSignin = (
  el: JSX.Element,
  auth: FirebaseReducer.AuthState
) => {
  return authRedirect(isEmpty(auth), "/signin", el, auth);
};

const authRedirect = (
  authState: boolean,
  redirectTo: string,
  el: JSX.Element,
  auth: FirebaseReducer.AuthState
) => {
  return ({ location }: any) => {
    if (isLoaded(auth)) {
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

export default () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);

  return (
    <Switch>
      <Route path="/exercise/:exercisesId" component={Exercises} />
      <Route path="/series/:seriesId" component={Workbook} />
      <Route path="/signup" render={authRedirectTop(<Signup />, auth)} />
      <Route path="/signin" render={authRedirectTop(<Signin />, auth)} />
      <Route path="/studio" render={guestRedirectSignin(<Studio />, auth)} />
      <Route path="/" component={Index} />
    </Switch>
  );
};
