import {
  makeStyles,
  Theme,
  Button,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import React, { useState, useEffect, useMemo } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import BasicDialog from "components/common/dialog/BasicConfirmDialog";
import BasicTable from "components/common/table/BasicTable";
import QuizFormDialog from "components/main/studio/pc/sub/main/table/dialog/QuizFormDialog";
import QuizService from "services/quiz/QuizService";
import QuizCell from "components/main/studio/pc/sub/main/table/cell/QuizCell";
import { QuizTableRowData } from "types/QuizTypes";
import QuizPreviewDialog from "components/main/quiz/preview/QuizPreviewDialog";

const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    zIndex: theme.zIndex.modal + 100,
  },
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
      onClick: handleDelete,
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
      onClick: handleAdd,
    },
  ];
};

const privacyLabel = (privacy: any) => {
  switch (privacy) {
    case 0:
      return "公開";
    case 1:
    default:
      return "非公開";
  }
};

const QuizTable = () => {
  const classes = useStyles();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRegisterFormDialog, setOpenRegisterFormDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const [selectedData, setSelectedData] = useState<
    QuizTableRowData | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>([]);
  const [progressing, setProgressing] = useState(false);

  useEffect(() => {
    const update = async () => {
      setIsLoading(true);
      const list = await QuizService.getMyQuizList({
        format: async (doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            accuracyRate: (data.correctAnswer || 0) / (data.answerCount || 1),
            createdAt: new Date(data.createdAt?.seconds * 1000),
            privacyLabel: privacyLabel(data.privacy),
            privacy: data.privacy,
            limit: data.limit?.length < 1 ? "なし" : "制限あり",
            thumbnail: data.thumbnail,
          };
        },
      });
      setTableData(await Promise.all(list));
      setIsLoading(false);
    };
    QuizService.onUpdate(update);
    return QuizService.onUpdate(function() {});
  }, [setTableData]);

  const handleDelete = (_event: any, rowData: any[]) => {
    setDeleteTarget(rowData);
    setOpenDeleteDialog(true);
  };
  const handleAdd = () => setOpenRegisterFormDialog(true);
  const columns: any[] = useMemo(
    () => [
      {
        title: "クイズ",
        field: "quiz",
        customFilterAndSearch: (filter: string, rowData: QuizTableRowData) => {
          return (
            rowData.question.includes(filter) ||
            !!rowData.description?.includes(filter)
          );
        },
        customSort: (a: QuizTableRowData, b: QuizTableRowData) => {
          if (a.question > b.question) return 1;
          if (a.question < b.question) return -1;
          return 0;
        },
        render: (rowData: QuizTableRowData) => (
          <QuizCell
            rowData={rowData}
            handleEdit={() => {
              setSelectedData(rowData);
              setOpenRegisterFormDialog(true);
            }}
            handlePreview={() => {
              setSelectedData(rowData);
              setOpenPreviewDialog(true);
            }}
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
          minWidth: 340,
        },
        headerStyle: {
          width: 340,
          maxWidth: 340,
          minWidth: 340,
        },
      },
      { title: "公開設定", field: "privacyLabel" },
      {
        title: "日付",
        field: "createdAt",
        type: "datetime",
      },
      { title: "制限", field: "limit" },
      {
        title: "回答数",
        field: "answerCount",
        type: "numeric",
      },
      {
        title: "初回正解率",
        field: "accuracyRate",
        type: "numeric",
      },
    ],
    []
  );
  const MainTable = useMemo(() => {
    return (
      <BasicTable
        isLoading={isLoading}
        actions={actions(handleDelete, handleAdd)}
        columns={columns}
        data={tableData}
      ></BasicTable>
    );
  }, [tableData, isLoading, columns]);
  return (
    <React.Fragment>
      {MainTable}
      <BasicDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        title={"選択したクイズを削除する"}
        body={`${deleteTarget.length}件のクイズを削除してもいいですか？`}
        yesOnClick={async () => {
          setOpenDeleteDialog(false);
          setProgressing(true);
          await QuizService.delete(deleteTarget.map((t: any) => t.id));
          setProgressing(false);
        }}
      ></BasicDialog>
      <QuizFormDialog
        open={openRegisterFormDialog}
        setOpen={setOpenRegisterFormDialog}
        oldData={selectedData}
        setOldData={setSelectedData}
      ></QuizFormDialog>
      {selectedData && (
        <QuizPreviewDialog
          open={openPreviewDialog}
          setOpen={setOpenPreviewDialog}
          onClose={() => setSelectedData(undefined)}
          quiz={selectedData}
        ></QuizPreviewDialog>
      )}
      <Backdrop open={progressing} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
};

export default QuizTable;
