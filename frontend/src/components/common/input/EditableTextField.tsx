import React, { useState, useRef } from "react";
import {
  Box,
  makeStyles,
  createStyles,
  Theme,
  Typography,
  IconButton,
  TextField,
  createMuiTheme,
  Button,
} from "@material-ui/core";
import clsx from "clsx";
import EditIcon from "@material-ui/icons/Edit";
import { useForm } from "react-hook-form";
import BasicConfirmDialog from "components/common/dialog/BasicConfirmDialog";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rootOnEdit: {
      minWidth: theme.spacing(35),
    },
    editableValue: {
      display: "flex",
      placeItems: "center",
    },
    inputTitleButtonGroup: {
      display: "flex",
      justifyContent: "flex-end",
    },
    editIcon: {
      marginLeft: "auto",
      marginRight: theme.spacing(-1.5),
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

export const EditableTextField: React.FC<{
  editable: boolean;
  value: string;
  valueName: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  maxLength: number;
  onSave: (value: string) => Promise<any> | undefined;
  onDelete?: (value?: string) => Promise<any> | void;
}> = ({
  editable,
  value,
  valueName,
  setValue,
  maxLength,
  onSave,
  onDelete,
}) => {
  const theme = createMuiTheme();
  const [edit, setEdit] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const classes = useStyles();
  const editableInputRef = useRef<HTMLInputElement>();
  const { register, watch, errors } = useForm<{ editableInput: string }>({
    mode: "onBlur",
  });
  const fields = watch();
  const editableRegister = register({
    required: `${valueName}を入力してください`,
    maxLength: {
      value: maxLength,
      message: `${valueName}が長すぎます`,
    },
  });
  const handleSave = () => {
    if (errors["editableInput"] || !fields["editableInput"]) {
      return;
    }
    onSave(fields["editableInput"])?.then(() => {
      setValue(fields["editableInput"]);
      setEdit(false);
    });
  };

  return (
    <Box className={clsx(edit && classes.rootOnEdit)}>
      {!edit && (
        <Box className={clsx(classes.editableValue)}>
          <Typography variant={"h6"}>{value}</Typography>
          {editable && (
            <Box className={clsx(classes.editIcon)}>
              <IconButton
                aria-label="edit"
                size="medium"
                onClick={() => {
                  setEdit(true);
                  setTimeout(() => {
                    editableInputRef?.current?.focus();
                  }, 100);
                }}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
              {onDelete && (
                <IconButton
                  aria-label="edit"
                  size="medium"
                  onClick={() => {
                    setOpenDeleteDialog(true);
                  }}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      )}
      <Box className={clsx(!edit && classes.displayNone)}>
        {
          <TextField
            required
            margin="dense"
            id={"editableInput"}
            name={"editableInput"}
            defaultValue={value}
            label={errors["editableInput"]?.message}
            type="text"
            inputRef={(e) => {
              editableRegister(e);
              editableInputRef.current = e;
            }}
            inputProps={{
              style: {
                fontSize: theme.typography.h6.fontSize,
              },
            }}
            fullWidth
            variant="standard"
            helperText={`${fields["editableInput"]?.length || 0}/${maxLength}`}
            error={!!errors["editableInput"]}
            FormHelperTextProps={{ className: classes.helperText }}
            onKeyDown={(e) => {
              if (e.which === 13) handleSave();
              if (e.which === 27) setEdit(false);
            }}
          />
        }
        <Box className={classes.inputTitleButtonGroup}>
          <Button
            onClick={() => {
              setEdit(false);
            }}
          >
            キャンセル
          </Button>
          <Button color="primary" onClick={handleSave}>
            保存
          </Button>
        </Box>
      </Box>
      {onDelete && (
        <BasicConfirmDialog
          open={openDeleteDialog}
          title={`${valueName}の削除`}
          body={
            <>
              本当に
              <Typography
                variant={"h6"}
                component={"span"}
                color={"secondary"}
                display={"inline"}
              >
                {value}
              </Typography>
              を削除して良いですか？
            </>
          }
          yesOnClick={() => {
            onDelete();
            setOpenDeleteDialog(false);
          }}
          setOpen={setOpenDeleteDialog}
        />
      )}
    </Box>
  );
};
