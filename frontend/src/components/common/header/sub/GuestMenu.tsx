import React from 'react';
import { Menu, MenuItem, Typography, Link, makeStyles, Theme, createStyles, ListItemIcon } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import InputIcon from '@material-ui/icons/Input';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

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

const GuestMenu: React.FC<State> = ({ anchorEl, open, handleClose }) => {
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
          <PersonAddIcon fontSize="small" />
        </ListItemIcon>
        <Link component={RouterLink} to="/signup" underline="none">
          <Typography variant="body1" color="textSecondary">
            ユーザ登録
          </Typography>
        </Link>
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon className={classes.listIcon}>
          <InputIcon fontSize="small" />
        </ListItemIcon>
        <Link component={RouterLink} to="/signin" underline="none">
          <Typography variant="body1" color="textSecondary">
            ログイン
          </Typography>
        </Link>
      </MenuItem>
    </Menu>
  );
}

export default GuestMenu;