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
import { contactUsLink, openAnotherTab } from "utils/helper/link";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      padding: theme.spacing(1, 2),
    },
    aboutSite: {
      display: "flex",
      placeContent: "center",
      placeItems: "center",
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
      <Box className={clsx(classes.box, classes.aboutSite)}>
        <Typography
          variant="caption"
          color="textSecondary"
          onClick={e => {
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
          onClick={e => {
            history.push("/terms");
            handleClose(e);
          }}
        >
          利用規約
        </Typography>
      </Box>
      <Box className={classes.box}>
        <Typography
          component={"p"}
          variant="caption"
          color="textSecondary"
          onClick={(e: any) => {
            openAnotherTab(contactUsLink());
            handleClose(e);
          }}
        >
          お問い合わせ
        </Typography>
      </Box>
    </>
  );
};
