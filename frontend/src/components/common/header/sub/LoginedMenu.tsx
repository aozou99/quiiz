import React from 'react';
import { Menu, MenuItem, Typography } from '@material-ui/core';

type State = {
  anchorEl: null | HTMLElement
  open: boolean
  handleClose: (event: {}) => void
}

const LoginedMenu: React.FC<State> = ({ anchorEl, open, handleClose }) => {
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
        <Typography variant="body1" color="textSecondary">
          プロフィール
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <Typography variant="body1" color="textSecondary">
          アカウント
        </Typography>
      </MenuItem>
    </Menu>
  );
}

export default LoginedMenu;