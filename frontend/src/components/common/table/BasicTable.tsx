import React from "react";
import {
  MuiThemeProvider,
  Paper,
  createMuiTheme,
  useTheme
} from "@material-ui/core";
import MaterialTable, {
  Query,
  QueryResult,
  Action,
  Column
} from "material-table";
import { themeColors } from "components/core/CustomeTheme";

const defaultTheme = createMuiTheme();
const themeTable = createMuiTheme({
  palette: {
    primary: themeColors.primary,
    secondary: themeColors.secondary
  },
  overrides: {
    MuiTableRow: {
      root: {
        "&:hover": {
          backgroundColor: defaultTheme.palette.action.selected
        }
      }
    },
    MuiTableFooter: {
      root: {
        "& tr:hover": {
          backgroundColor: "inherit"
        }
      }
    }
  }
});

type State = {
  actions: (Action<any> | ((rowData: any) => Action<any>))[];
  columns: Column<any>[];
  data: object[] | ((query: Query<object>) => Promise<QueryResult<object>>);
};

const BasicTable: React.FC<State> = ({ actions, columns, data }) => {
  const theme = useTheme();
  return (
    <MuiThemeProvider theme={themeTable}>
      <MaterialTable
        actions={actions}
        components={{
          Container: props => <Paper {...props} elevation={0} />
        }}
        columns={columns}
        data={data}
        localization={{
          pagination: {
            labelRowsSelect: "行を表示",
            firstTooltip: "最初のページ",
            previousTooltip: "前のページ",
            nextTooltip: "次のページ",
            lastTooltip: "最後のページ"
          },
          toolbar: {
            searchPlaceholder: "検索"
          },
          header: {
            actions: "操作"
          }
        }}
        options={{
          showTitle: false,
          searchFieldAlignment: "left",
          selection: true,
          showTextRowsSelected: false,
          headerStyle: {
            color: theme.palette.text.secondary
          },
          emptyRowsWhenPaging: false,
          toolbarButtonAlignment: "left"
        }}
      ></MaterialTable>
    </MuiThemeProvider>
  );
};

export default BasicTable;
