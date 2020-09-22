import firebase from "firebase/app";
import "firebase/auth";
import clsx from "clsx";
import PostAddIcon from "@material-ui/icons/PostAdd";
import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Avatar, Box, fade, useTheme, InputBase } from "@material-ui/core";
import "firebase/auth";
import { Skeleton } from "@material-ui/lab";
import { useAuthState } from "react-firebase-hooks/auth";
import SearchIcon from "@material-ui/icons/Search";
import { useQuery } from "utils/helper/queryParameter";
import GuestMenu from "components/common/header/sub/GuestMenu";
import LoginedMenu from "components/common/header/sub/LoginedMenu";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    fontFamily: "Chalkboard",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolBar: {
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0, 0),
    },
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(0, 3),
    },
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  search: {
    flexGrow: 3,
    position: "relative",
    borderRadius: theme.spacing(3),
    backgroundColor: fade(theme.palette.grey[500], 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.grey[500], 0.25),
    },
    margin: theme.spacing(0, 1),
    [theme.breakpoints.down("sm")]: {
      maxWidth: 250,
    },
    [theme.breakpoints.up("sm")]: {
      maxWidth: 360,
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
  buttons: {
    display: "flex",
    placeContent: "flex",
    placeItems: "center",
    marginLeft: "auto",
  },
}));

const MobileHeader: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { url } = useRouteMatch();
  const theme = useTheme();
  const query = useQuery();
  const [user, loading] = useAuthState(firebase.auth());
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <AppBar
      position="fixed"
      className={classes.appBar}
      color="inherit"
      elevation={1}
    >
      <Toolbar className={classes.toolBar}>
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
            placeholder="キーワード入力"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search", maxLength: 30 }}
            onChange={(e) => {
              history.push(`/search?keyword=${e.target.value}`);
            }}
            defaultValue={query.get("keyword")}
          />
        </div>
        <div className={classes.grow} />
        <Box className={classes.buttons}>
          {user && (
            <>
              <IconButton
                className={clsx(classes.menuButton, classes.smDisplayNone)}
                onClick={() => history.push("/studio/quiz")}
              >
                <PostAddIcon fontSize="large" />
              </IconButton>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  alt={user.displayName || ""}
                  src={user.photoURL || ""}
                />
              </IconButton>
              <LoginedMenu
                anchorEl={anchorEl}
                open={open}
                handleClose={handleClose}
                userId={user.uid}
              />
            </>
          )}
          {!loading && !user && (
            <>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenu}
              >
                <Avatar alt={""} src={"guest user"} />
              </IconButton>
              <GuestMenu
                anchorEl={anchorEl}
                open={open}
                handleClose={handleClose}
              />
            </>
          )}
          {loading && (
            <Skeleton
              animation="wave"
              variant="circle"
              width={40}
              height={40}
              style={{ margin: theme.spacing(1.5) }}
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MobileHeader;
