import React, { lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'modules/core/rootReducer';
import { isLoaded, isEmpty, FirebaseReducer } from 'react-redux-firebase'
import { Backdrop, CircularProgress } from '@material-ui/core';

const Exercises = lazy(() => import('components/main/quiz/exercises/Main'))
const Index = lazy(() => import('components/main/quiz/index/Main'))
const Workbook = lazy(() => import('components/main/quiz/workbook/Main'))
const Signup = lazy(() => import('components/main/auth/signUp/Main'))
const Signin = lazy(() => import('components/main/auth/signIn/Main'))

const authRedirectTop = (el: JSX.Element, auth:FirebaseReducer.AuthState) => {
  return ({ location }: any) => {
    if (isLoaded(auth)) {
      return !isEmpty(auth) ? (<Redirect to={{
        pathname: "/",
        state: { from: location }
      }} />) : (el)
    } else {
      return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
      )
    }
  }
}

export default () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);

  return (
    <Switch>
      <Route path="/exercise/:exercisesId" component={Exercises} />
      <Route path="/workbook/:workbookId" component={Workbook} />
      <Route path="/signup" render={authRedirectTop(<Signup/>, auth)} />
      <Route path="/signin" render={authRedirectTop(<Signin/>, auth)} />
      <Route path="/" component={Index} />
    </Switch>
  )
};