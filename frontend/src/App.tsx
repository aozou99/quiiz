import React, { Suspense } from 'react';
import Header from './components/common/header/Main';
import theme from './components/core/CustomeTheme';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
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
  "/signin",
  "/studio"
];

const App = () => {
  const location = useLocation();
  const classes = useStyles();
  const isShowHeader = noHeaderPathList.filter(el => location.pathname.indexOf(el) === 0).length === 0;

  return (
    <MuiThemeProvider theme={theme}>
      {isShowHeader && (<Header />)}
      <Suspense fallback={
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      }>
        <ContentRouter />
      </Suspense>
    </MuiThemeProvider>
  );
}

export default App;
