import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import {
  Drawer,
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Theme,
} from "@material-ui/core";
import { themeColors } from "components/core/CustomeTheme";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";
import { SignInGuideDescription } from "components/common/guide/SignInGuideDescription";
import Copyright from "components/common/guide/Copyright";
import { AboutQuiiz } from "components/common/guide/AboutQuiiz";

type State = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

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

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    width: theme.spacing(30),
    "& > div.MuiDrawer-paperAnchorLeft": {
      width: "inherit",
    },
  },
  title: {
    fontFamily: "Chalkboard",
  },
  selected: {
    backgroundColor: theme.palette.grey[300],
    "& $listChild": {
      color: themeColors.primary[400],
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    width: theme.spacing(30),
  },
  listRoot: {
    paddingLeft: theme.spacing(3),
    "&:hover $listChild": {
      color: themeColors.secondary[400],
    },
  },
  listChild: {},
  guideBox: {
    padding: theme.spacing(1.5, 3),
    whiteSpace: "normal",
  },
}));

const TemporarySidebar: React.FC<State> = ({ open, setOpen }) => {
  const classes = useStyles();
  const history = useHistory();
  const [user, loading] = useAuthState(firebase.auth());

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={handleClose}
        className={classes.drawer}
      >
        <List className={classes.list}>
          <ListItem
            className={clsx(classes.listRoot, classes.list)}
            onClick={handleClose}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" color="primary" className={classes.title}>
              Quiiz
            </Typography>
          </ListItem>
          <Divider />
          {listItems.map((item) => (
            <ListItem
              button
              key={item.name}
              onClick={() => {
                history.push(item.linkPath);
                setOpen(false);
              }}
              className={clsx(classes.listRoot, {
                [classes.selected]: history.location.pathname === item.linkPath,
              })}
            >
              <ListItemIcon className={classes.listChild}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  variant: "body2",
                }}
              />
            </ListItem>
          ))}
        </List>
        {!loading && !user && (
          <>
            <Divider />
            <SignInGuideDescription />
          </>
        )}
        <Divider />
        <AboutQuiiz
          className={classes.guideBox}
          onLink={() => setOpen(false)}
        />
        <Divider />
        <Copyright className={classes.guideBox} textAlgin="left" />
      </Drawer>
    </>
  );
};

export default TemporarySidebar;
