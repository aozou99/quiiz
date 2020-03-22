import { Box, makeStyles, Theme, Typography, Button } from "@material-ui/core";
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import BasicDialog from "components/common/dialog/BasicConfirmDialog";
import BasicTable from "components/common/table/BasicTable";
import ExerciseFormDialog from "components/main/studio/pc/sub/main/table/dialog/ExerciseFormDialog";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex"
  },
  thumbnail: {
    width: 120
  },
  description: {
    marginLeft: theme.spacing(2)
  }
}));

const actions = (handleDelete: any, handleAdd: any) => {
  return [
    {
      icon: () => (
        <Button
          component="div"
          variant="outlined"
          color="secondary"
          startIcon={<DeleteIcon />}
        >
          削除
        </Button>
      ),
      tooltip: "クイズを削除します",
      onClick: handleDelete
    },
    {
      icon: () => (
        <Button
          component="div"
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
        >
          作成
        </Button>
      ),
      isFreeAction: true,
      tooltip: "クイズを作成します",
      onClick: handleAdd
    }
  ];
};

const data = [
  {
    quiz: {
      title: "テスト",
      url: "/images/mock/animal/resize_harinezumi.jpg"
    },
    limit: "なし",
    privacy: "非公開",
    createdAt: "2020/03/10",
    answerCount: 1000,
    accuracyRate: 40
  }
];

const ExerciseTable = () => {
  const classes = useStyles();
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openRegisterFormDialog, setOpenRegisterFormDialog] = React.useState(
    false
  );

  const quizCell = (url: string | undefined, title: string) => {
    return (
      <Box className={classes.root}>
        <img src={url} className={classes.thumbnail} alt={title} />
        <div className={classes.description}>
          <Typography variant="subtitle2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="caption">説明</Typography>
        </div>
      </Box>
    );
  };

  const handleDelete = () => setOpenDeleteDialog(true);
  const handleAdd = () => setOpenRegisterFormDialog(true);
  return (
    <React.Fragment>
      <BasicTable
        actions={actions(handleDelete, handleAdd)}
        columns={[
          {
            title: "クイズ",
            field: "quiz",
            render: rowData => quizCell(rowData.quiz.url, rowData.quiz.title),
            cellStyle: {
              width: 300,
              minWidth: 300
            },
            headerStyle: {
              width: 300,
              minWidth: 300
            }
          },
          { title: "公開設定", field: "privacy" },
          {
            title: "日付",
            field: "createdAt",
            type: "date"
          },
          { title: "制限", field: "limit" },
          {
            title: "回答数",
            field: "answerCount",
            type: "numeric"
          },
          {
            title: "正解率",
            field: "accuracyRate",
            type: "numeric"
          }
        ]}
        data={data}
      ></BasicTable>
      <BasicDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        title={"選択したクイズを削除する"}
        body={"本当に削除してもいいですか？"}
        yesOnClick={() => alert("削除しました")}
      ></BasicDialog>
      <ExerciseFormDialog
        open={openRegisterFormDialog}
        setOpen={setOpenRegisterFormDialog}
      ></ExerciseFormDialog>
    </React.Fragment>
  );
};

export default ExerciseTable;
