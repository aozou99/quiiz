import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  makeStyles,
  MenuItem,
  Box,
  Typography
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CancelIcon from "@material-ui/icons/Cancel";
import { useForm, Controller } from "react-hook-form";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";

type State = {
  noOnClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  open: boolean;
  setOpen: (open: boolean) => any;
};

type FormData = {
  question: string;
  thumbnail: string;
  selectA: string;
  selectB: string;
  selectC: string;
  selectD: string;
  answer: string;
  description: string;
  privacy: string;
};

const answers = [
  {
    label: "選択肢A",
    value: "0"
  },
  {
    label: "選択肢B",
    value: "1"
  },
  {
    label: "選択肢C",
    value: "2"
  },
  {
    label: "選択肢D",
    value: "3"
  }
];

const privacies = [
  {
    label: "公開",
    value: "0"
  },
  {
    label: "非公開",
    value: "1"
  }
];

const useStyles = makeStyles(theme => ({
  dialogContent: {
    "&:first-child": {
      paddingTop: 0
    }
  },
  thumbnailBox: {
    display: "flex",
    justifyContent: "start",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    "&>*": {
      height: theme.spacing(9 * 1.5),
      width: theme.spacing(16 * 1.5)
    }
  },
  thumbnailPreview: {
    marginLeft: theme.spacing(2),
    borderStyle: "groove",
    boxSizing: "border-box"
  },
  thumbnailButton: {
    borderStyle: "dashed",
    "&>.MuiButton-label": {
      flexDirection: "column"
    },
    color: theme.palette.text.secondary
  },
  inputFileBtnHide: {
    opacity: 0,
    appearance: "none",
    position: "absolute"
  },
  helperText: {
    textAlign: "right"
  },
  selectBox: {
    "&>*": {
      marginRight: theme.spacing(2)
    }
  }
}));

const ExerciseFormDialog: React.FC<State> = ({ noOnClick, open, setOpen }) => {
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };
  const { register, handleSubmit, watch, control, errors } = useForm<FormData>({
    mode: "onBlur"
  });
  const fields = watch();
  const onSubmit = handleSubmit(data => {
    console.log(data);
  });

  const wrapTextFiled = ({
    id,
    label,
    maxLength,
    multiline,
    nullable,
    rows
  }: {
    id: keyof FormData;
    label: string;
    maxLength: number;
    multiline?: boolean;
    nullable?: boolean;
    rows?: number;
  }) => {
    return (
      <TextField
        required={!nullable}
        margin="dense"
        multiline={!!multiline}
        id={id}
        name={id}
        rows={rows}
        label={errors[id]?.message || label}
        type="text"
        inputRef={register({
          required: !nullable && `${label}を入力してください`,
          maxLength: {
            value: maxLength,
            message: `${label}が長すぎます`
          }
        })}
        fullWidth
        variant="outlined"
        helperText={`${fields[id]?.length || 0}/${maxLength}`}
        error={!!errors[id]}
        FormHelperTextProps={{ className: classes.helperText }}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableBackdropClick
    >
      <DialogTitle id="alert-dialog-title">クイズの作成</DialogTitle>
      <form onSubmit={onSubmit} noValidate>
        <DialogContent dividers className={classes.dialogContent}>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          {wrapTextFiled({
            id: "question",
            label: "問題文",
            maxLength: 100
          })}
          {wrapTextFiled({
            id: "selectA",
            label: "選択肢A",
            maxLength: 30
          })}
          {wrapTextFiled({
            id: "selectB",
            label: "選択肢B",
            maxLength: 30
          })}
          {wrapTextFiled({
            id: "selectC",
            label: "選択肢C",
            maxLength: 30
          })}
          {wrapTextFiled({
            id: "selectD",
            label: "選択肢D",
            maxLength: 30
          })}
          <Box className={classes.selectBox}>
            <Controller
              as={
                <TextField
                  id="answer"
                  select
                  required
                  label="正解の選択肢"
                  helperText="正解の選択肢を選んでください"
                >
                  {answers.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              }
              name="answer"
              rules={{ required: true }}
              control={control}
              defaultValue="0"
            ></Controller>
            <Controller
              as={
                <TextField
                  id="privacy"
                  select
                  required
                  label="公開/非公開"
                  helperText="公開するか選択してください"
                >
                  {privacies.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              }
              name="privacy"
              rules={{ required: true }}
              control={control}
              defaultValue="0"
            ></Controller>
          </Box>
          <Box className={classes.thumbnailBox}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<AddPhotoAlternateIcon />}
              className={classes.thumbnailButton}
            >
              <Typography color="textSecondary" variant="caption">
                サムネイルをアップロード
              </Typography>
              <input
                type="file"
                className={classes.inputFileBtnHide}
                accept="image/*"
                id="thumbnail"
                name="thumbnail"
                ref={register()}
              />
            </Button>
            {fields.thumbnail?.length > 0 && (
              <img
                className={classes.thumbnailPreview}
                src={URL.createObjectURL(fields.thumbnail[0])}
                alt="thumbnail-preview"
              />
            )}
          </Box>
          {wrapTextFiled({
            id: "description",
            label: "解説",
            maxLength: 200,
            multiline: true,
            nullable: true,
            rows: 2
          })}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={noOnClick || handleClose}
            startIcon={<CancelIcon />}
            color="secondary"
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            startIcon={<CheckIcon />}
          >
            登録
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExerciseFormDialog;
