import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import AddIcon from "@material-ui/icons/Add";
import PublicIcon from "@material-ui/icons/Public";
import LockIcon from "@material-ui/icons/Lock";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  ListItemIcon,
  Checkbox,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import PlayListService from "services/playList/PlayListService";
import { useCheckList } from "services/playList/PlayListHooks";

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

const useStyles = makeStyles({
  dialogContent: {
    "&:first-child": {
      paddingTop: 0,
    },
  },
  accordionDetails: {
    display: "block",
    padding: 0,
  },
  list: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  helperText: {
    textAlign: "right",
  },
});

type State = {
  open: boolean;
  onClose: () => void;
  quiz: { id: string; authorId: string };
  afterChecked?: () => void;
};

const PlayListDialog: React.FC<State> = ({
  open,
  onClose,
  quiz,
  afterChecked,
}) => {
  const classes = useStyles();
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [listName, setListName] = React.useState("");
  const { playLists, loaded, checked, update } = useCheckList(quiz.id);

  // 入力フォーム系
  const { register, handleSubmit, watch, control, errors } = useForm<{
    listName: string;
    privacy: 0 | 1;
  }>({
    mode: "onBlur",
  });
  const fields = watch();

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (listId: string, index: number) => {
    let result;
    if (checked.indexOf(index) > -1) {
      result = PlayListService.removeFromList(listId, quiz.id);
    } else {
      result = PlayListService.addToList(listId, quiz.authorId, quiz.id);
    }
    result?.then(() => {
      update();
      if (afterChecked) afterChecked();
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    // 再生リスト新規作成
    const listId = await PlayListService.create(data);
    if (listId) {
      // 作成したリストにクイズを登録
      PlayListService.addToList(listId, quiz.authorId, quiz.id);
    }
    // 登録完了した旨のsnackbarを表示
    onClose();
    setListName(fields["listName"]);
    setSnackBarOpen(true);
  });

  return (
    <>
      <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={open}>
        <DialogTitle id="dialog-title" disableTypography>
          保存先...
        </DialogTitle>
        <Divider />
        <List className={classes.list}>
          {loaded &&
            playLists.map((playList, index) => {
              const labelId = `checkbox-list-label-${index}`;
              return (
                <ListItem
                  button
                  onClick={() => handleListItemClick(playList.id, index)}
                  key={playList.id}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(index) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                      color={"primary"}
                    />
                  </ListItemIcon>
                  <ListItemText primary={playList.name} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="comments">
                      {playList.public ? <PublicIcon /> : <LockIcon />}
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          <Divider />
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="新しいプレイリストを追加" />
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <form onSubmit={onSubmit} noValidate>
                <DialogContent className={classes.dialogContent}>
                  <TextField
                    margin="dense"
                    id="listName"
                    name="listName"
                    label={errors["listName"]?.message || "名前"}
                    error={!!errors["listName"]}
                    inputRef={register({
                      required: `名前を入力してください`,
                      maxLength: {
                        value: 15,
                        message: `名前が長すぎます`,
                      },
                    })}
                    helperText={`${fields["listName"]?.length || 0}/15`}
                    FormHelperTextProps={{ className: classes.helperText }}
                    fullWidth
                  />
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
                    defaultValue={0}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    startIcon={<CheckIcon />}
                  >
                    作成
                  </Button>
                </DialogActions>
              </form>
            </AccordionDetails>
          </Accordion>
        </List>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackBarOpen}
        message={`${listName}に追加しました`}
        onClose={() => setSnackBarOpen(false)}
      />
    </>
  );
};

export default PlayListDialog;
