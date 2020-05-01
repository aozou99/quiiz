import React, { Suspense } from "react";
import theme from "./components/core/CustomeTheme";
import MuiThemeProvider from "@material-ui/styles/ThemeProvider";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, Theme, createStyles, Backdrop } from "@material-ui/core";
import ContentRouter from "components/core/Router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

const App = () => {
  const classes = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <Suspense
        fallback={
          <Backdrop className={classes.backdrop} open>
            <CircularProgress color="inherit" />
          </Backdrop>
        }
      >
        <ContentRouter />
      </Suspense>
    </MuiThemeProvider>
  );
};

export default App;
