import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { Typography, createStyles, Theme } from '@material-ui/core';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2)
    },
    table: {
    },
  })
);

function createData(id: string, title: string, state: "clear" | "failed" | "undone") {
  return { id, title, state };
}

const rows = [
  createData('kame1', 'オスとメスではどのような違いがある？', "clear"),
  createData('kame2', '確実な記録で残っているカメの最高寿命は何年？', 'undone'),
  createData('kame3', 'ゼニガメの正式名は？', 'failed'),
];

const ExerciseList = ({history}: RouteComponentProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const handleClick = (id: string) => {
    history.push(`/exercise/${id}`);
  }
  
  return (
    <TableContainer className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.id}
              onClick={() => handleClick(row.id)}
              hover>
              <TableCell
                align="left"
                padding='none'
                style={{
                  padding: theme.spacing(1),
                  width: '1%'
                }}>
                <Typography
                  variant="overline"
                  color="textSecondary">
                  {index + 1}
                </Typography>
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                align="left">
                <Typography
                  variant="subtitle2">
                  {row.title}
                </Typography>
              </TableCell>
              <TableCell align="right">{row.state}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default withRouter(ExerciseList);