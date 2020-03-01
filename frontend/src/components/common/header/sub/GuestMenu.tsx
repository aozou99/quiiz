import React from 'react';
import { Menu, MenuItem, Typography, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

type State = {
  anchorEl: null | HTMLElement
  open: boolean
  handleClose: (event: {}) => void
}

const GuestMenu: React.FC<State> = ({ anchorEl, open, handleClose }) => {
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
        <Link component={RouterLink} to="/signup" underline="none">
          <Typography variant="body1" color="textSecondary">
            ユーザ登録
          </Typography>
        </Link>
      </MenuItem>
      <MenuItem onClick={handleClose}>
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