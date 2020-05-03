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
} from "@material-ui/core";
import { themeColors } from "components/core/CustomeTheme";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";

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
];

const useStyles = makeStyles((theme) => ({
  drawer: {
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  selected: {
    "& $listChild": {
      color: themeColors.primary[400],
    },
  },
  drawerOpen: {
    width: 240,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
  menuButton: {
    marginRight: theme.spacing(2),
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  listRoot: {
    paddingLeft: theme.spacing(3),
    "&:hover $listChild": {
      color: themeColors.secondary[400],
    },
  },
  listChild: {},
}));

const TemporarySidebar: React.FC<State> = ({ open, setOpen }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer anchor="left" open={open} onClose={handleClose}>
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
            <Typography variant="h5" color="primary">
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
      </Drawer>
    </>
  );
};

export default TemporarySidebar;
