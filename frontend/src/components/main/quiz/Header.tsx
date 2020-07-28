import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { RootState } from "modules/core/rootReducer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Avatar, fade, InputBase, Tooltip } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import LoginedMenu from "components/common/header/sub/LoginedMenu";
import GuestMenu from "components/common/header/sub/GuestMenu";
import PostAddIcon from "@material-ui/icons/PostAdd";

type State = {
  handleDrawer: (event: {}) => void;
};

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
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
  search: {
    flexGrow: 3,
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.grey[500], 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.grey[500], 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(3),
      width: 250,
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
  },
  smDisplayNone: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}));

const Header: React.FC<State> = ({ handleDrawer }) => {
  const classes = useStyles();
  const history = useHistory();
  const { url } = useRouteMatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const auth = useSelector((state: RootState) => state.firebase.auth);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      className={classes.appBar}
      color="inherit"
      elevation={0}
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
            Quiiz
          </Typography>
        </IconButton>
        <div className={classes.grow} />
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="検索"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
          />
        </div>
        <div className={classes.grow} />
        {auth.isEmpty && (
          <div>
            <IconButton
              aria-label="display more actions"
              edge="end"
              color="inherit"
              onClick={handleMenu}
            >
              <MoreIcon />
            </IconButton>
            <GuestMenu
              anchorEl={anchorEl}
              open={open}
              handleClose={handleClose}
            />
          </div>
        )}
        {!auth.isEmpty && (
          <div>
            <Tooltip title="クイズを作成する">
              <IconButton
                className={clsx(classes.menuButton, classes.smDisplayNone)}
                onClick={() => history.push("/studio/quiz")}
              >
                <PostAddIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="アカウント">
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  alt={auth.displayName || ""}
                  src={auth.photoURL || ""}
                />
              </IconButton>
            </Tooltip>
            <LoginedMenu
              anchorEl={anchorEl}
              open={open}
              handleClose={handleClose}
            />
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
