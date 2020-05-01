import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { useHistory } from "react-router-dom";
import { themeColors } from "components/core/CustomeTheme";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import { Typography } from "@material-ui/core";

const listItems = [
  {
    name: "ホーム",
    linkPath: "/",
    icon: <HomeIcon />,
  },
  {
    name: "急上昇",
    linkPath: "/trending",
    icon: <WhatshotIcon />,
  },
  {
    name: "登録チャンネル",
    linkPath: "/subscriptions",
    icon: <SubscriptionsIcon />,
  },
];

const useStyles = makeStyles((theme) => ({
  drawer: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    "& > div.MuiDrawer-paperAnchorLeft": {
      borderRight: "0px",
    },
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(9) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  selected: {
    "& $listChild": {
      color: themeColors.primary[400],
    },
  },
  list: {
    paddingTop: 0,
  },
  listRoot: {
    paddingLeft: theme.spacing(0),
    paddingTop: theme.spacing(2),
    "&:hover $listChild": {
      color: themeColors.secondary[400],
    },
    flexDirection: "column",
    textAlign: "center",
  },
  listChild: {
    minWidth: "initial",
  },
  menuName: {
    fontSize: "0.65rem",
    marginTop: theme.spacing(1),
  },
}));

const Sidebar: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, classes.drawerClose)}
      classes={{
        paper: clsx(classes.drawerClose),
      }}
    >
      <div className={classes.toolbar} />
      <List className={classes.list}>
        {listItems.map((item) => (
          <ListItem
            button
            disableGutters
            key={item.name}
            onClick={() => history.push(item.linkPath)}
            className={clsx(classes.listRoot, {
              [classes.selected]: history.location.pathname === item.linkPath,
            })}
          >
            <ListItemIcon className={classes.listChild}>
              {item.icon}
            </ListItemIcon>
            <Typography variant="caption" className={classes.menuName}>
              {item.name}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
