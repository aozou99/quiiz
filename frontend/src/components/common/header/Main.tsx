import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useSelector } from 'react-redux';
import { RootState } from 'modules/core/rootReducer';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import MoreIcon from '@material-ui/icons/MoreVert';
import LoginedMenu from 'components/common/header/sub/LoginedMenu';
import GuestMenu from 'components/common/header/sub/GuestMenu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
      fontFamily: "Chalkboard",
    },
  }),
);

const Main: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>

          <Link component={RouterLink} to="/" className={classes.title} underline="none">
            <Typography variant="h5" color="primary">
              Quiiz
            </Typography>
          </Link>
          {!user && (
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
          {user && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
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
  )
}

export default Main;