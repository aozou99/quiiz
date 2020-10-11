import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Avatar, fade, InputBase, Tooltip, useTheme } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import LoginedMenu from "components/common/header/sub/LoginedMenu";
import GuestMenu from "components/common/header/sub/GuestMenu";
import PostAddIcon from "@material-ui/icons/PostAdd";
import firebase from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { SignInButton } from "components/common/button/SignInButton";
import Skeleton from "@material-ui/lab/Skeleton";
import { useQuery } from "utils/helper/queryParameter";

type State = {
  handleDrawer: (event: {}) => void;
};

const useStyles = makeStyles(theme => ({
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
    maxWidth: theme.spacing(82),
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
  buttons: {
    minWidth: theme.spacing(24),
    "&>*": {
      margin: theme.spacing(0.5),
    },
  },
}));

const DeskTopHeader: React.FC<State> = ({ handleDrawer }) => {
  const classes = useStyles();
  const theme = useTheme();
  const query = useQuery();
  const history = useHistory();
  const { url } = useRouteMatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [user, loading] = useAuthState(firebase.auth());
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const queryKeyword = query.get("keyword");
  const [keyword, setKeyword] = useState(queryKeyword);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    setKeyword(queryKeyword);
  }, [queryKeyword]);

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
            placeholder="キーワードを入力"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search", maxLength: 30 }}
            onChange={e => {
              setKeyword(e.target.value);
              history.push(`/search?keyword=${e.target.value}`);
            }}
            value={keyword || ""}
          />
        </div>
        <div className={classes.grow} />
        {!loading && !user && (
          <div className={classes.buttons}>
            <IconButton
              aria-label="display more actions"
              edge="end"
              color="inherit"
              onClick={handleMenu}
            >
              <MoreIcon />
            </IconButton>
            <SignInButton />
            <GuestMenu
              anchorEl={anchorEl}
              open={open}
              handleClose={handleClose}
            />
          </div>
        )}
        {user && (
          <div>
            <Tooltip title="クイズを作成する">
              <IconButton
                className={clsx(classes.menuButton, classes.smDisplayNone)}
                onClick={() => history.push("/studio/quiz")}
              >
                <PostAddIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="マイメニュー">
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
            </Tooltip>
            <LoginedMenu
              anchorEl={anchorEl}
              open={open}
              handleClose={handleClose}
              userId={user.uid}
            />
          </div>
        )}
        {loading && (
          <>
            <Skeleton
              animation="wave"
              variant="circle"
              width={40}
              height={40}
              style={{ marginRight: theme.spacing(1.5) }}
            />
            <Skeleton
              animation="wave"
              variant="circle"
              width={40}
              height={40}
            />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default DeskTopHeader;
