import clsx from "clsx";
import {
  AppBar,
  Toolbar,
  createStyles,
  makeStyles,
  Theme,
  ListItem,
  List,
  Typography,
  Fab,
} from "@material-ui/core";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import HomeIcon from "@material-ui/icons/Home";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import React from "react";
import { themeColors } from "components/core/CustomeTheme";
import { useHistory } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";

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
  {
    name: "ライブラリ",
    linkPath: "/library",
    icon: <LocalLibraryIcon />,
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      display: "flex",
      placeContent: "center",
      placeItems: "center",
      width: "100%",
      padding: 0,
    },
    selected: {
      "& $listChild": {
        color: themeColors.primary[400],
      },
    },
    listChild: {
      minWidth: "initial",
    },
    subheader: {
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
      top: "auto",
      bottom: 0,
      zIndex: 1201,
    },
    grow: {
      flexGrow: 1,
    },
    menuName: {
      fontSize: "0.65rem",
      marginTop: theme.spacing(1),
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
    fabButton: {
      position: "absolute",
      zIndex: 1,
      top: theme.spacing(-8),
      right: theme.spacing(2),
      color: "white",
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
  })
);

export const BottomBar = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <AppBar position="fixed" color="inherit" className={classes.appBar}>
      <Toolbar>
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
              <ListItemIcon className={clsx(classes.listChild)}>
                {item.icon}
              </ListItemIcon>
              <Typography variant="caption" className={classes.menuName}>
                {item.name}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.fabButton}
          onClick={() => history.push("/studio/quiz")}
        >
          <AddIcon />
        </Fab>
      </Toolbar>
    </AppBar>
  );
};