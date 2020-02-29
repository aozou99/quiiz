import React, { Suspense } from 'react';
import Header from './components/common/Header';
import theme from './components/core/CustomeTheme';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import Container from '@material-ui/core/Container';
import DebugConfig from 'components/common/DebugSetting';
import { BrowserRouter } from 'react-router-dom';
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

const App = () => {
  const classes = useStyles();
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <DebugConfig />
        <Header />
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
    </BrowserRouter >
  );
}

export default App;
