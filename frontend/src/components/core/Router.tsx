import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

const Exercises = lazy(() => import('components/main/quiz/exercises/Main'))
const Index = lazy(() => import('components/main/quiz/index/Main'))
const Workbook = lazy(() => import('components/main/quiz/workbook/Main'))
const signup = lazy(() => import('components/main/auth/signUp/Main'))
const signin = lazy(() => import('components/main/auth/signIn/Main'))

export default () => {
  return (
    <Switch>
      <Route path="/exercise/:exercisesId" component={Exercises} />
      <Route path="/workbook/:workbookId" component={Workbook} />
      <Route path="/signup" component={signup} />
      <Route path="/signin" component={signin} />
      <Route path="/" component={Index} />
    </Switch>
  )
};