import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Theme,
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avator: {
      height: theme.spacing(9),
      width: theme.spacing(16),
    },
    listPannel: {
      backgroundColor: grey[50],
      "&>nav.MuiList-padding": {
        paddingTop: 0,
        paddingBottom: 0,
      },
      minHeight: `calc(100vh - ${theme.spacing(8)}px)`,
      marginRight: theme.spacing(1),
      width: theme.spacing(73),
    },
    listText: {
      height: theme.spacing(9),
      paddingLeft: theme.spacing(2),
    },
    playListInfo: {
      padding: theme.spacing(1, 2),
    },
    playListTitle: {
      display: "flex",
      placeItems: "center",
      padding: theme.spacing(2),
    },
    inputTitle: {
      fontSize: "20px",
    },
    inputTitleButtonGroup: {
      display: "flex",
      justifyContent: "flex-end",
    },
    editIcon: {
      marginLeft: "auto",
      marginRight: theme.spacing(-1.5),
      display: "flex",
    },
    helperText: {
      textAlign: "right",
    },
    noUnderLine: {
      "& .MuiInput-underline:before": {
        borderBottom: 0,
      },
    },
    displayNone: {
      display: "none",
    },
  })
);

const DummyQuizListPannel: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.listPannel}>
      <Box className={classes.playListTitle}>
        <Skeleton animation="wave" width={"60%"} height={48} />
        <Box className={classes.editIcon}>
          <IconButton aria-label="edit" size="medium">
            <Skeleton
              animation="wave"
              variant="circle"
              height={32}
              width={32}
            />
          </IconButton>
          <IconButton aria-label="edit" size="medium">
            <Skeleton
              animation="wave"
              variant="circle"
              height={32}
              width={32}
            />
          </IconButton>
        </Box>
      </Box>

      <List component="nav" aria-label="quiz lists">
        {Array.from({ length: 4 })
          .fill(null)
          .map((_, i) => (
            <React.Fragment key={i}>
              <ListItem button>
                <ListItemAvatar>
                  <Skeleton
                    animation="wave"
                    variant="rect"
                    className={classes.avator}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Skeleton animation="wave" width={"90%"} height={32} />
                  }
                  secondary={
                    <Skeleton animation="wave" width={"20%"} height={24} />
                  }
                  className={classes.listText}
                />

                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <Skeleton
                      animation="wave"
                      variant="circle"
                      height={32}
                      width={32}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
      </List>
    </Box>
  );
};

export default DummyQuizListPannel;
