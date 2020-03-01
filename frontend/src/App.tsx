import React, { Suspense } from 'react';
import Header from './components/common/header/Main';
import theme from './components/core/CustomeTheme';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import Container from '@material-ui/core/Container';
import DebugConfig from 'components/common/DebugSetting';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme, createStyles, Backdrop } from '@material-ui/core';
import ContentRouter from 'components/core/Router';

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
  console.log(location.pathname);
  return (
    <MuiThemeProvider theme={theme}>
      {!noHeaderPathList.includes(location.pathname) &&
        (
          <div>
            <DebugConfig />
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
