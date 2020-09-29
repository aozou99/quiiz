import {
  makeStyles,
  Theme,
  createStyles,
  Box,
  Divider,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    aboutSite: {
      display: "flex",
      placeContent: "center",
      placeItems: "center",
      padding: theme.spacing(1, 2),
    },
    divider: {
      marginBottom: theme.spacing(1),
    },
  })
);

export const AboutSiteMenu = ({
  handleClose,
}: {
  handleClose: (event: any) => void;
}) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <>
      <Divider className={classes.divider} />
      <Box className={classes.aboutSite}>
        <Typography
          variant="caption"
          color="textSecondary"
          onClick={(e) => {
            history.push("/privacy");
            handleClose(e);
          }}
        >
          プライバシーポリシー
        </Typography>
        <Typography variant="caption" color="textSecondary">
          ・
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          onClick={(e) => {
            history.push("/terms");
            handleClose(e);
          }}
        >
          利用規約
        </Typography>
      </Box>
    </>
  );
};
