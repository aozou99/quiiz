import React from 'react';
import { makeStyles, Theme, createStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { RootState } from 'modules/core/rootReducer';

const TIME_LIMIT_SECOND = 15;
const EVENT_INTERVAL_MILLI_SECOND = 50;


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(2),
      flexGrow: 1,
    },
  }),
);

export default function Timer() {
  const { isGameStart } = useSelector((state: RootState) => state.quizGame)

  const classes = useStyles();
  // 進捗率
  const [completed, setCompleted] = React.useState(100);
  // 残り時間
  const [time, setTime] = React.useState(TIME_LIMIT_SECOND);
  // 進捗率に応じてサークルの色を変える
  const ColorCircularProgress = withStyles((theme: Theme) => {
    return {
      root: {
        color: () => {
          switch (true) {
            case (completed > 75):
              return theme.palette.primary.main;
            case (completed > 50):
              return theme.palette.success.main;
            case (completed > 25):
              return theme.palette.warning.main;
            default:
              return theme.palette.error.main;
          }
        },
      }
    };
  })(CircularProgress);

  React.useEffect(() => {
    function progress() {
      // ゲームが開始されていない場合は何もしない
      if (!isGameStart) return;
      // 残り時間の計算を行い進捗率を算出する
      setTime(oldTime => {
        setCompleted(Math.floor((oldTime / TIME_LIMIT_SECOND * 100)));
        if (oldTime <= 0) return oldTime;
        let newTime = oldTime - (EVENT_INTERVAL_MILLI_SECOND / 1000);
        return newTime > 0 ? newTime : 0;
      });
    }
    const timer = setInterval(progress, EVENT_INTERVAL_MILLI_SECOND);
    return () => {
      clearInterval(timer);
    };
  }, [isGameStart]);

  return (
    <Grid container justify="center" className={classes.root} spacing={2}>
      <ColorCircularProgress variant="static" value={completed} size="2rem" thickness={6} />
      <Box mt={0} ml={2}>
        <Typography variant="h5">
          残り時間 : {("00" + Math.ceil(time)).slice(-2)}秒
        </Typography>
      </Box>
    </Grid>
  );
}