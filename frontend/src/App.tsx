import React, { Suspense } from 'react';
import Header from './components/common/header/Main';
import theme from './components/core/CustomeTheme';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import Container from '@material-ui/core/Container';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme, createStyles, Backdrop } from '@material-ui/core';
import ContentRouter from 'components/core/Router';
import AuthService from 'services/auth/AuthService';
import { setUser } from 'modules/auth/authModule';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);
const noHeaderPathList = [
  "/signup",
  "/signin"
];

const App = () => {
  const location = useLocation();
  const classes = useStyles();
  const dispatch = useDispatch();

  AuthService.onAuthStateChanged((user: firebase.User | null) => {
    if (user) {
      dispatch(setUser({ user }));
    }
  });

  return (
    <MuiThemeProvider theme={theme}>
      {!noHeaderPathList.includes(location.pathname) &&
        (
          <div>
            <Header />
          </div>
        )
      }
      <Container maxWidth="lg">
        <Suspense fallback={
          <Backdrop className={classes.backdrop} open>
            <CircularProgress color="inherit" />
          </Backdrop>
        }>
          <ContentRouter />
        </Suspense>
      </Container>
    </MuiThemeProvider>
  );
}

export default App;
