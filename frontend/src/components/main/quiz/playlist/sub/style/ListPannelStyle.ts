import { makeStyles, Theme, createStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

export const useListPannelStyles = makeStyles((theme: Theme) =>
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
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        paddingBottom: theme.spacing(2),
        minHeight: "inherit",
      },
    },
    listText: {
      height: theme.spacing(9),
      paddingLeft: theme.spacing(2),
      [theme.breakpoints.down("xs")]: {
        paddingLeft: theme.spacing(1),
        height: "auto",
      },
    },
    playListInfo: {
      padding: theme.spacing(1, 2),
    },
    noUnderLine: {
      "& .MuiInput-underline:before": {
        borderBottom: 0,
      },
    },
    center: {
      width: "100%",
      display: "flex",
      placeContent: "center",
      placeItems: "center",
      padding: theme.spacing(2),
    },
  })
);
