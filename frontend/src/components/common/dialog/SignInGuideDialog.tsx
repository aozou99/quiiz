import React from "react";
import {
  Dialog,
  DialogTitle,
  Divider,
  DialogContentText,
  DialogActions,
  Button,
  DialogContent,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

type State = {
  open: boolean;
  onClose: () => void;
  title: string;
  bodyText: string;
};

export const SignInGuideDialog: React.FC<State> = ({
  open,
  onClose,
  title,
  bodyText,
}) => {
  const history = useHistory();

  return (
    <Dialog onClose={onClose} aria-labelledby="dialog-title" open={open}>
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
