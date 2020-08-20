import React, { ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Divider,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CancelIcon from "@material-ui/icons/Cancel";

type State = {
  title?: string;
  body: string | ReactNode;
  yesOnClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  noOnClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  open: boolean;
  setOpen: (open: boolean) => any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actions: {
      padding: theme.spacing(1.5),
    },
  })
);

const BasicConfirmDialog: React.FC<State> = ({
  title,
  body,
  yesOnClick,
  noOnClick,
  open,
  setOpen,
}) => {
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {body}
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions className={classes.actions}>
        <Button
          variant="outlined"
          onClick={noOnClick || handleClose}
          startIcon={<CancelIcon />}
          color="secondary"
        >
          いいえ
        </Button>
        <Button
          variant="outlined"
          onClick={yesOnClick}
          color="primary"
          startIcon={<CheckIcon />}
          autoFocus
        >
          はい
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BasicConfirmDialog;
