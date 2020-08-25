import React from "react";
import {
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AuthService from "services/auth/AuthService";

type State = {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: (event: {}) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listIcon: {
      minWidth: "inherit",
      marginRight: theme.spacing(2),
    },
    smDisplayNone: {
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
  })
);

const LoginedMenu: React.FC<State> = ({ anchorEl, open, handleClose }) => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={open}
      onClose={handleClose}
    >
      <MenuItem className={classes.smDisplayNone}>
        <ListItemIcon className={classes.listIcon}>
          <PostAddIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body1" color="textSecondary">
          クイズを作成する
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon className={classes.listIcon}>
          <AccountBoxIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body1" color="textSecondary">
          アカウント
        </Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          AuthService.signOut().then(() => {
            history.push("/signin");
          });
        }}
      >
        <ListItemIcon className={classes.listIcon}>
          <ExitToAppIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body1" color="textSecondary">
          ログアウト
        </Typography>
      </MenuItem>
    </Menu>
  );
};

export default LoginedMenu;
