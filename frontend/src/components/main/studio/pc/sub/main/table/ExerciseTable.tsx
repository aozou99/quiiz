import {
  makeStyles,
  Theme,
  Button,
  Backdrop,
  CircularProgress
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import BasicDialog from "components/common/dialog/BasicConfirmDialog";
import BasicTable from "components/common/table/BasicTable";
import ExerciseFormDialog from "components/main/studio/pc/sub/main/table/dialog/ExerciseFormDialog";
import ExerciseService from "services/quiz/ExerciseService";
import imageUrl from "utils/helper/imageUrl";
import QuizCell from "components/main/studio/pc/sub/main/table/cell/QuizCell";
import { ExerciseTableRowData } from "Types";

const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    zIndex: theme.zIndex.modal + 100
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
  const [tableData, setTableData] = useState<any>([]);
  const [selectedData, setSelectedData] = useState<
    ExerciseTableRowData | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>([]);
  const [progressing, setProgressing] = useState(false);

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
            privacyLabel: privacyLabel(data.privacy),
            privacy: data.privacy,
            limit: data.limit?.length < 1 ? "なし" : "制限あり",
            thumbnail: data.thumbnail
              ? await imageUrl(data.thumbnail, "256x144")
              : ""
          };
        }
      });
      setTableData(await Promise.all(list));
      setIsLoading(false);
    };
    ExerciseService.onUpdate(update);
    // cleanup
    return ExerciseService.onUpdate(() => console.log("cleanup"));
  }, [setTableData]);

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
            render: (rowData: ExerciseTableRowData) => (
              <QuizCell
                rowData={rowData}
                handleEdit={() => {
                  setSelectedData(rowData);
                  setOpenRegisterFormDialog(true);
                }}
                handlePreview={() => alert("プレビューするよ")}
                handleDelete={() => {
                  setDeleteTarget([rowData]);
                  setOpenDeleteDialog(true);
                }}
                handleAnalyze={() => alert("分析するよ")}
              />
            ),
            cellStyle: {
              width: 340,
              maxWidth: 340,
              minWidth: 340
            },
            headerStyle: {
              width: 340,
              maxWidth: 340,
              minWidth: 340
            }
          },
          { title: "公開設定", field: "privacyLabel" },
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
        data={tableData}
      ></BasicTable>
      <BasicDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        title={"選択したクイズを削除する"}
        body={`${deleteTarget.length}件のクイズを削除してもいいですか？`}
        yesOnClick={async () => {
          setOpenDeleteDialog(false);
          setProgressing(true);
          await ExerciseService.delete(deleteTarget.map((t: any) => t.id));
          setProgressing(false);
        }}
      ></BasicDialog>
      <ExerciseFormDialog
        open={openRegisterFormDialog}
        setOpen={setOpenRegisterFormDialog}
        oldData={selectedData}
        setOldData={setSelectedData}
      ></ExerciseFormDialog>
      <Backdrop open={progressing} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
};

export default ExerciseTable;
