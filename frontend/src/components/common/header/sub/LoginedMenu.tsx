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
import AuthService from "services/auth/AuthService";
import TvIcon from "@material-ui/icons/Tv";
import { AboutSiteMenu } from "components/common/header/sub/AboutSiteMenu";

type State = {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: (event: {}) => void;
  userId: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listIcon: {
      minWidth: "inherit",
      marginRight: theme.spacing(2),
    },
    aboutSite: {
      display: "flex",
      placeContent: "center",
      placeItems: "center",
    },
    divider: {
      marginBottom: theme.spacing(1),
    },
  })
);

const LoginedMenu: React.FC<State> = ({
  anchorEl,
  open,
  handleClose,
  userId,
}) => {
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
      <MenuItem
        onClick={(e) => {
          history.push(`/channel/${userId}`);
          handleClose(e);
        }}
      >
        <ListItemIcon className={classes.listIcon}>
          <TvIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body1" color="textSecondary">
          マイチャンネル
        </Typography>
      </MenuItem>
      <MenuItem
        onClick={(e) => {
          history.push(`/channel/${userId}?tabIndex=2`);
          handleClose(e);
        }}
      >
        <ListItemIcon className={classes.listIcon}>
          <AccountBoxIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body1" color="textSecondary">
          プロフィール設定
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
      <AboutSiteMenu handleClose={handleClose} />
    </Menu>
  );
};

export default React.memo(LoginedMenu);
