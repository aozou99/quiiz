import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { themeColors } from 'components/core/CustomeTheme';
import Tooltip from '@material-ui/core/Tooltip';

type State = {
  open: boolean
}

const drawerWidth = 240;

const listItems = [
  {
    name: "ダッシュボード",
    linkPath: "",
    icon: <DashboardIcon />,
  },
  {
    name: "クイズ",
    linkPath: "/quiz",
    icon: <AddToQueueIcon />,
  },
];

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    borderRight: 0,
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    borderRight: 0,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  selected: {
    backgroundColor: theme.palette.action.selected,
    '& $listChild': {
      color: themeColors.primary[400],
    }
  },
  list: {
    paddingTop: 0,
  },
  listRoot: {
    '&:hover $listChild': {
      color: themeColors.secondary[400],
    }
  },
  listChild: {},
}));

const Sidebar: React.FC<State> = ({ open }) => {
  const classes = useStyles();
  const history = useHistory();
  let { url } = useRouteMatch();

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar} />
      <List className={classes.list}>
        {listItems.map(item => (
          <Tooltip title={item.name} >
            <ListItem
              button
              key={item.name}
              onClick={() => history.push(url + item.linkPath)}
              className={clsx(classes.listRoot, {
                [classes.selected]: history.location.pathname === (url + item.linkPath)
              })}
            >
              <ListItemIcon className={classes.listChild}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          </Tooltip>
        ))}
      </List>
      <Divider />
      <List>
        <Tooltip title="トップに戻る">
          <ListItem button key="トップに戻る" onClick={() => history.push("/")}>
            <ListItemIcon>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primary="トップに戻る" />
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
}

export default Sidebar;