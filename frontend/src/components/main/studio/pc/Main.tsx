import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Header from './sub/Header';
import Sidebar from 'components/main/studio/pc/sub/SideBar';
import { useRouteMatch, Route, Switch } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { path } = useRouteMatch();

  const handleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header handleDrawer={handleDrawer} />
      <Sidebar open={open} />
      <Switch>
        <Route exact path={path}>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            abc
          </main>
        </Route>
        <Route path={`${path}/quiz`}>
          <main className={classes.content}>
          <div className={classes.toolbar} />
            quiz
          </main>
        </Route>
      </Switch>
    </div>
  );
}
