import React from 'react';
import { Menu, MenuItem, Typography, ListItemIcon, makeStyles, Theme, createStyles } from '@material-ui/core';
import { signOut } from 'modules/auth/authModule';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

type State = {
  anchorEl: null | HTMLElement
  open: boolean
  handleClose: (event: {}) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listIcon: {
      minWidth: "inherit",
      marginRight: theme.spacing(2),
    },
  }),
);

const LoginedMenu: React.FC<State> = ({ anchorEl, open, handleClose }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={handleClose}
    >
      <MenuItem onClick={handleClose}>
        <ListItemIcon className={classes.listIcon}>
          <AccountBoxIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body1" color="textSecondary">
          アカウント
        </Typography>
      </MenuItem>
      <MenuItem onClick={() => {
        dispatch(signOut());
        history.push('/signin');
      }}>
        <ListItemIcon className={classes.listIcon}>
          <ExitToAppIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body1" color="textSecondary">
          ログアウト
        </Typography>
      </MenuItem>
    </Menu>
  );
}

export default LoginedMenu;