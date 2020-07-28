import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useHistory, useRouteMatch } from "react-router-dom";

type State = {
  handleDrawer: (event: {}) => void;
};

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Chalkboard",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
}));

const Header: React.FC<State> = ({ handleDrawer }) => {
  const classes = useStyles();
  const history = useHistory();
  const { url } = useRouteMatch();
  return (
    <AppBar
      position="fixed"
      className={classes.appBar}
      color="inherit"
      elevation={1}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawer}
          edge="start"
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <IconButton onClick={() => history.push(url)}>
          <Typography variant="h5" color="primary" className={classes.title}>
            Quiiz Studio
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
