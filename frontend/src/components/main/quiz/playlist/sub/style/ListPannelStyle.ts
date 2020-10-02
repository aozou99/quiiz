import { makeStyles, Theme, createStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

export const useListPannelStyles = makeStyles((theme: Theme) =>
  createStyles({
    avator: {
      height: theme.spacing(9),
      width: theme.spacing(16),
      backgroundImage: `url("/images/loading/loading.gif")`,
      backgroundSize: "initial",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
    list: {
      "&>.MuiListItem-gutters": {
        [theme.breakpoints.down("xs")]: {
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
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
        backgroundColor: "white",
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
    accordionRoot: {
      "&.MuiPaper-elevation1": {
        boxShadow: "initial",
      },
    },
    accordionSummaryRoot: {
      padding: 0,
    },
    accordionSummaryContent: {
      margin: 0,
      display: "initial",
      "&.Mui-expanded": {
        margin: 0,
      },
    },
    accordionDetailsRoot: {
      padding: 0,
    },
  })
);
