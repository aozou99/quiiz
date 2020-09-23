import React from "react";
import {
  Dialog,
  DialogTitle,
  Divider,
  DialogContentText,
  DialogActions,
  Button,
  DialogContent,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

type State = {
  open: boolean;
  onClose: () => void;
  title: string;
  bodyText: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down("xs")]: {
        whiteSpace: "pre-wrap",
        textAlign: "center",
      },
    },
  })
);

export const SignInGuideDialog: React.FC<State> = ({
  open,
  onClose,
  title,
  bodyText,
}) => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="dialog-title"
      open={open}
      className={classes.root}
    >
      <DialogTitle id="dialog-title" disableTypography>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{bodyText}</DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          variant="text"
          onClick={() => history.push("/signin")}
          color="primary"
          size="large"
        >
          ログイン
        </Button>
      </DialogActions>
    </Dialog>
  );
};
