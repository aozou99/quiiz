import { Box, makeStyles, Theme, Typography, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import BasicDialog from "components/common/dialog/BasicConfirmDialog";
import BasicTable from "components/common/table/BasicTable";
import ExerciseFormDialog from "components/main/studio/pc/sub/main/table/dialog/ExerciseFormDialog";
import ExerciseService from "services/quiz/ExerciseService";
import imageUrl from "utils/helper/imageUrl";

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

const privacyLabel = (privacy: any) => {
  switch (privacy) {
    case "0":
      return "公開";
    case "1":
    default:
      return "非公開";
  }
};

const ExerciseTable = () => {
  const classes = useStyles();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRegisterFormDialog, setOpenRegisterFormDialog] = useState(false);
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>([]);

  useEffect(() => {
    const update = async () => {
      setIsLoading(true);
      const list = await ExerciseService.getMyExerciseList({
        format: async doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            accuracyRate: (data.correctAnswer || 0) / (data.answerCount || 1),
            createdAt: new Date(data.createdAt?.seconds * 1000),
            privacy: privacyLabel(data.privacy),
            limit: data.limit?.length < 1 ? "なし" : "制限あり",
            thumbnail: data.thumbnail
              ? await imageUrl(data.thumbnail, "256x144")
              : ""
          };
        }
      });
      setData(await Promise.all(list));
      setIsLoading(false);
    };
    ExerciseService.onUpdate(update);
  }, [setData]);

  const quizCell = ({
    thumbnail,
    question,
    description
  }: {
    thumbnail: string;
    question: string;
    description: string;
  }) => {
    return (
      <Box className={classes.root}>
        <img src={thumbnail} className={classes.thumbnail} alt={question} />
        <div className={classes.description}>
          <Typography variant="subtitle2" gutterBottom>
            {question}
          </Typography>
          <Typography variant="caption">{description}</Typography>
        </div>
      </Box>
    );
  };

  const handleDelete = (_event: any, rowData: any[]) => {
    setDeleteTarget(rowData);
    setOpenDeleteDialog(true);
  };
  const handleAdd = () => setOpenRegisterFormDialog(true);
  return (
    <React.Fragment>
      <BasicTable
        isLoading={isLoading}
        actions={actions(handleDelete, handleAdd)}
        columns={[
          {
            title: "クイズ",
            field: "quiz",
            render: rowData => quizCell(rowData),
            cellStyle: {
              width: 400,
              minWidth: 400
            },
            headerStyle: {
              width: 400,
              minWidth: 400
            }
          },
          { title: "公開設定", field: "privacy" },
          {
            title: "日付",
            field: "createdAt",
            type: "datetime"
          },
          { title: "制限", field: "limit" },
          {
            title: "回答数",
            field: "answerCount",
            type: "numeric"
          },
          {
            title: "初回正解率",
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
        body={`${deleteTarget.length}件のクイズを削除してもいいですか？`}
        yesOnClick={() => {
          deleteTarget.forEach((exercise: any) => {
            ExerciseService.delete(exercise.id);
          });
        }}
      ></BasicDialog>
      <ExerciseFormDialog
        open={openRegisterFormDialog}
        setOpen={setOpenRegisterFormDialog}
      ></ExerciseFormDialog>
    </React.Fragment>
  );
};

export default ExerciseTable;
