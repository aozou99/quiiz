import React, { useState, useRef, useEffect } from "react";
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
import validUrl from "valid-url";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rootOnEdit: {
      minWidth: theme.spacing(35),
    },
    editableValue: {
      display: "flex",
      placeItems: "center",
    },
    onMultiLineEditableValue: {
      placeItems: "initial",
      position: "relative",
    },
    inputTitleButtonGroup: {
      display: "flex",
      justifyContent: "flex-end",
    },
    editIcon: {
      marginLeft: "auto",
      marginRight: theme.spacing(-1.5),
    },
    onMultiLineEditIcon: {
      position: "absolute",
      right: theme.spacing(1.5),
      bottom: theme.spacing(0.5),
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
    placeholder: {
      color: theme.palette.text.secondary,
    },
  })
);

export const EditableTextField: React.FC<{
  editable: boolean;
  value: string;
  valueName: string;
  setValueState: React.Dispatch<React.SetStateAction<string>>;
  maxLength: number;
  type?: "link" | "twitter" | "text";
  fontSize?:
    | "button"
    | "caption"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2";
  required?: boolean;
  variant?: "outlined" | "filled";
  placeholder?: string;
  multiline?: boolean;
  maxRows?: number;
  rows?: number;
  onSave: (value: string) => Promise<any> | undefined;
  onDelete?: (value?: string) => Promise<any> | void;
}> = ({
  editable,
  value,
  valueName,
  setValueState,
  type = "text",
  fontSize = "h6",
  required = true,
  variant,
  placeholder,
  maxLength,
  multiline = false,
  maxRows,
  rows,
  onSave,
  onDelete,
}) => {
  const theme = createMuiTheme();
  const [edit, setEdit] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const classes = useStyles();
  const editableInputRef = useRef<HTMLInputElement>();
  const { register, watch, errors, setValue } = useForm<{
    editableInput: string;
  }>({
    mode: "onBlur",
  });
  const fields = watch();
  const editableRegister = register({
    required: required && `${valueName}を入力してください`,
    maxLength: {
      value: maxLength,
      message: `${valueName}が長すぎます`,
    },
    validate: {
      urlFormat: (value: string) => {
        if (type !== "link") return true;
        return !!validUrl.isWebUri(value) || `${value}がURL形式ではありません`;
      },
    },
  });
  const handleSave = () => {
    if (errors["editableInput"] || !fields["editableInput"]) {
      return;
    }
    onSave(fields["editableInput"])?.then(() => {
      setValueState(fields["editableInput"]);
      setEdit(false);
    });
  };

  useEffect(() => {
    setValue("editableInput", value);
  }, [value, setValue]);

  return (
    <Box className={clsx(edit && classes.rootOnEdit)}>
      {!edit && (
        <Box
          className={clsx(
            classes.editableValue,
            variant === "filled" && classes.onMultiLineEditableValue
          )}
        >
          <Typography
            variant={fontSize}
            style={
              rows
                ? {
                    minHeight: rows * theme.spacing(2.5),
                    width: "100%",
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: theme.spacing(2),
                    padding: theme.spacing(2),
                    whiteSpace: "break-spaces",
                  }
                : {}
            }
          >
            {["twitter", "link"].includes(type) && value ? (
              <span
                className={classes.placeholder}
                onClick={() =>
                  window.open(
                    type === "twitter" ? `https://twitter.com/${value}` : value,
                    "_blank"
                  )
                }
              >
                {type === "twitter" ? `@${value}` : value}
              </span>
            ) : (
              value || (
                <span className={classes.placeholder}>{placeholder}</span>
              )
            )}
          </Typography>
          {editable && (
            <Box
              className={clsx(
                classes.editIcon,
                variant === "filled" && classes.onMultiLineEditIcon
              )}
            >
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
            id={`editableInput-${valueName}`}
            name={"editableInput"}
            defaultValue={value}
            label={errors["editableInput"]?.message || valueName}
            type="text"
            inputRef={(e) => {
              editableRegister(e);
              editableInputRef.current = e;
            }}
            inputProps={{
              style: {
                fontSize: theme.typography[fontSize].fontSize,
                lineHeight: theme.typography[fontSize].lineHeight,
              },
            }}
            fullWidth
            multiline={multiline}
            rowsMax={maxRows}
            placeholder={placeholder}
            rows={rows}
            variant={variant}
            helperText={`${fields["editableInput"]?.length || 0}/${maxLength}`}
            error={!!errors["editableInput"]}
            FormHelperTextProps={{ className: classes.helperText }}
            onKeyDown={(e) => {
              if (!multiline && e.key === "Enter") handleSave();
              if (["Escape", "Esc"].includes(e.key)) setEdit(false);
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
