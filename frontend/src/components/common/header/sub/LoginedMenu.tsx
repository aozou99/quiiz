import React from 'react';
import { Menu, MenuItem, Typography } from '@material-ui/core';
import { signOut } from 'modules/auth/authModule';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'

type State = {
  anchorEl: null | HTMLElement
  open: boolean
  handleClose: (event: {}) => void
}

const LoginedMenu: React.FC<State> = ({ anchorEl, open, handleClose }) => {
  const dispatch = useDispatch();
  const history = useHistory();
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
      <MenuItem onClick={() => {
        dispatch(signOut());
        history.push('/signin');
      }}>
        <Typography variant="body1" color="textSecondary">
          ログアウト
        </Typography>
      </MenuItem>
    </Menu>
  );
}

export default LoginedMenu;