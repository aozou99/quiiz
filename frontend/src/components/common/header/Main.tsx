import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useSelector } from "react-redux";
import { RootState } from "modules/core/rootReducer";
import MoreIcon from "@material-ui/icons/MoreVert";
import LoginedMenu from "components/common/header/sub/LoginedMenu";
import GuestMenu from "components/common/header/sub/GuestMenu";
import { Avatar, fade, InputBase, Tooltip } from "@material-ui/core";
import PostAddIcon from "@material-ui/icons/PostAdd";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(1)
    },
    title: {
      fontFamily: "Chalkboard"
    },
    search: {
      flexGrow: 3,
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.grey[500], 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.grey[500], 0.25)
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      [theme.breakpoints.down("sm")]: {
        marginLeft: theme.spacing(3),
        width: 250
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit",
      width: "100%"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create("width"),
      width: "100%"
    },
    smDisplayNone: {
      [theme.breakpoints.down("xs")]: {
        display: "none"
      }
    }
  })
);

const Main: React.FC = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const history = useHistory();
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <IconButton onClick={() => history.push("/")}>
            <Typography variant="h5" color="primary">
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
                input: classes.inputInput
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
                  onClick={() => history.push("/studio")}
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
    </div>
  );
};

export default Main;
