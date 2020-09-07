import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  useTheme,
  useMediaQuery,
  ListItemText,
  Divider,
} from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { useHistory } from "react-router-dom";
import { themeColors } from "components/core/CustomeTheme";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import HomeIcon from "@material-ui/icons/Home";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";
import { SignInGuideDescription } from "components/common/guide/SignInGuideDescription";
import Copyright from "components/common/guide/Copyright";
import { AboutQuiiz } from "components/common/guide/AboutQuiiz";

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

const useStyles = makeStyles((theme) => ({
  drawer: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    "& > div.MuiDrawer-paperAnchorLeft": {
      borderRight: "0px",
      width: "inherit",
    },
  },
  drawerLessLg: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(9) + 2,
  },
  drawerMoreLg: {
    overflowX: "hidden",
    width: theme.spacing(30),
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
  selectedMoreLg: {
    backgroundColor: theme.palette.grey[300],
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
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
  listRootMoreLg: {
    padding: theme.spacing(1, 3),
    flexDirection: "initial",
    textAlign: "left",
  },
  listChild: {
    minWidth: "initial",
  },
  listChildMoreLg: {
    marginRight: theme.spacing(3),
  },
  menuName: {
    fontSize: "0.65rem",
    marginTop: theme.spacing(1),
  },
  guideBox: {
    padding: theme.spacing(1.5, 3),
    whiteSpace: "normal",
  },
}));

const Sidebar: React.FC<{ foldSidebar: boolean }> = ({ foldSidebar }) => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const isLargerLg = useMediaQuery(theme.breakpoints.up(1320));
  const [user, loading] = useAuthState(firebase.auth());

  return (
    <Drawer
      variant="permanent"
      className={clsx(
        classes.drawer,
        !foldSidebar && isLargerLg
          ? classes.drawerMoreLg
          : classes.drawerLessLg,
        foldSidebar && isLargerLg && classes.drawerLessLg
      )}
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
              [classes.selectedMoreLg]:
                history.location.pathname === item.linkPath &&
                !foldSidebar &&
                isLargerLg,
              [classes.listRootMoreLg]: !foldSidebar && isLargerLg,
            })}
          >
            <ListItemIcon
              className={clsx(classes.listChild, {
                [classes.listChildMoreLg]: !foldSidebar && isLargerLg,
              })}
            >
              {item.icon}
            </ListItemIcon>
            {!foldSidebar && isLargerLg ? (
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  variant: "body2",
                }}
              />
            ) : (
              <Typography variant="caption" className={classes.menuName}>
                {item.name}
              </Typography>
            )}
          </ListItem>
        ))}
      </List>
      {!loading && !user && !foldSidebar && isLargerLg && (
        <>
          <Divider />
          <SignInGuideDescription />
        </>
      )}
      {!foldSidebar && isLargerLg && (
        <>
          <Divider />
          <AboutQuiiz className={classes.guideBox} />
          <Divider />
          <Copyright className={classes.guideBox} textAlgin="left" />
        </>
      )}
    </Drawer>
  );
};

export default Sidebar;
