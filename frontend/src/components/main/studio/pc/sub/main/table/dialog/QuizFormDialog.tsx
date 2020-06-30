import React, { useState, useEffect, useRef } from "react";
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
  Typography,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CancelIcon from "@material-ui/icons/Cancel";
import { useForm, Controller } from "react-hook-form";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import {
  QuizFormData,
  QuizTableRowData,
  QuizFormTextData,
} from "types/QuizTypes";
import ChipInput from "material-ui-chip-input";
import QuizService from "services/quiz/QuizService";
import CropDialog from "components/common/dialog/CropDialog";
import is16to9 from "utils/helper/is16to9";
import imageUrl from "utils/helper/imageUrl";

type State = {
  noOnClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  open: boolean;
  setOpen: (open: boolean) => any;
  oldData?: QuizTableRowData;
  setOldData: (oldData: QuizTableRowData | undefined) => any;
};

const answers = [
  {
    label: "選択肢A",
    value: 0,
  },
  {
    label: "選択肢B",
    value: 1,
  },
  {
    label: "選択肢C",
    value: 2,
  },
  {
    label: "選択肢D",
    value: 3,
  },
];

const privacies = [
  {
    label: "公開",
    value: 0,
  },
  {
    label: "非公開",
    value: 1,
  },
];

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    "&:first-child": {
      paddingTop: 0,
    },
  },
  thumbnailBox: {
    display: "flex",
    justifyContent: "start",
    paddingTop: theme.spacing(2),
    "&>*": {
      height: theme.spacing(9 * 1.5),
      width: theme.spacing(16 * 1.5),
    },
    "& img": {
      height: "inherit",
      width: "inherit",
    },
  },
  thumbnailPreview: {
    marginLeft: theme.spacing(2),
    borderStyle: "groove",
    boxSizing: "border-box",
  },
  thumbnailButton: {
    borderStyle: "dashed",
    "&>.MuiButton-label": {
      flexDirection: "column",
    },
    color: theme.palette.text.secondary,
  },
  inputFileBtnHide: {
    opacity: 0,
    appearance: "none",
    position: "absolute",
  },
  helperText: {
    textAlign: "right",
  },
  tagsHelperText: {
    display: "flex",
    justifyContent: "space-between",
  },
  selectBox: {
    "&>*": {
      marginRight: theme.spacing(2),
    },
  },
  chipInput: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
}));

const QuizFormDialog: React.FC<State> = ({
  noOnClick,
  open,
  setOpen,
  oldData,
  setOldData,
}) => {
  const classes = useStyles();
  const [progressing, setProgressing] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | undefined>(
    undefined
  );
  const oldThumbnailRef = useRef(null);

  useEffect(() => {
    imageUrl(oldData?.thumbnail || "", "256x144").then((path) => {
      setCroppedImage(path);
      oldThumbnailRef.current = path;
    });
  }, [oldData, open]);
  // 入力フォーム系
  const { register, handleSubmit, setValue, watch, control, errors } = useForm<
    QuizFormData
  >({
    mode: "onBlur",
  });
  const fields = watch();

  // tagsのカスタム登録
  register(
    { name: "tags", type: "text" },
    {
      validate: {
        maxLength: (value: string) =>
          (value?.replace(/,/g, "").length || 0) < 100 ||
          "合計の文字数が長すぎます",
      },
    }
  );
  // thumbnailのカスタム登録
  register({ name: "thumbnail" });

  // handler
  const handleClose = () => {
    setOpen(false);
    setCroppedImage(undefined);
    setOldData(undefined);
  };
  const onSubmit = handleSubmit(async (data) => {
    setProgressing(true);
    // サムネを再設定
    if (croppedImage !== undefined) {
      data.thumbnail = croppedImage;
    }
    try {
      // 登録 or 更新
      oldData
        ? await QuizService.update(
            oldData.id,
            oldThumbnailRef.current !== data.thumbnail,
            data
          )
        : await QuizService.register(data);
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setProgressing(false);
    }
  });

  // helper
  const wrapTextFiled = ({
    id,
    label,
    defaultValue,
    maxLength,
    multiline,
    nullable,
    rows,
  }: {
    id: keyof QuizFormTextData;
    label: string;
    defaultValue?: any;
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
        defaultValue={defaultValue || ""}
        rows={rows}
        rowsMax={rows ? rows + 10 : undefined}
        label={errors[id]?.message || label}
        type="text"
        inputRef={register({
          required: !nullable && `${label}を入力してください`,
          maxLength: {
            value: maxLength,
            message: `${label}が長すぎます`,
          },
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
            maxLength: 100,
            defaultValue: oldData?.question || "",
          })}
          {wrapTextFiled({
            id: "selectA",
            label: "選択肢A",
            maxLength: 30,
            defaultValue: oldData?.selectA || "",
          })}
          {wrapTextFiled({
            id: "selectB",
            label: "選択肢B",
            maxLength: 30,
            defaultValue: oldData?.selectB || "",
          })}
          {wrapTextFiled({
            id: "selectC",
            label: "選択肢C",
            maxLength: 30,
            defaultValue: oldData?.selectC || "",
          })}
          {wrapTextFiled({
            id: "selectD",
            label: "選択肢D",
            maxLength: 30,
            defaultValue: oldData?.selectD || "",
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
                  {answers.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              }
              name="answer"
              rules={{ required: true }}
              control={control}
              defaultValue={oldData?.answer || 0}
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
                  {privacies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              }
              name="privacy"
              rules={{ required: true }}
              control={control}
              defaultValue={oldData?.privacy || 0}
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
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (
                    e.target.files !== null &&
                    (e.target.files?.length || 0) > 0
                  ) {
                    const url = URL.createObjectURL(e.target.files[0]);
                    setValue("thumbnail", url, true);
                    if (!(await is16to9(url))) {
                      setCropOpen(true);
                    } else {
                      setCroppedImage(url);
                    }
                  }
                }}
              />
            </Button>
            {(croppedImage?.length || 0) > 0 && (
              <a href={croppedImage} target="_blank" rel="noopener noreferrer">
                <img
                  src={croppedImage}
                  alt="thumbnail-preview"
                  className={classes.thumbnailPreview}
                />
              </a>
            )}
          </Box>
          <CropDialog
            open={cropOpen}
            setOpen={setCropOpen}
            imgUrl={fields.thumbnail || ""}
            setCroppedImage={setCroppedImage}
          ></CropDialog>
          <ChipInput
            helperText={
              <React.Fragment>
                <span>カンマで区切って入力してください</span>
                <span>{fields.tags?.replace(/,/g, "").length || 0}/100</span>
              </React.Fragment>
            }
            FormHelperTextProps={{
              className: classes.tagsHelperText,
            }}
            fullWidth
            label={errors.tags?.message || "タグ"}
            variant="outlined"
            newChipKeyCodes={[188]}
            newChipKeys={[",", "<"]}
            className={classes.chipInput}
            onChange={(chips: string[]) =>
              setValue("tags", chips.join(","), true)
            }
            error={!!errors.tags}
            defaultValue={oldData?.tags || []}
          ></ChipInput>
          {wrapTextFiled({
            id: "description",
            label: "解説",
            maxLength: 500,
            multiline: true,
            nullable: true,
            rows: 2,
            defaultValue: oldData?.description || "",
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
            {oldData ? "更新" : "登録"}
          </Button>
        </DialogActions>
      </form>
      <Backdrop open={progressing} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default QuizFormDialog;
