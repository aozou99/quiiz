import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import { useSelector } from 'react-redux';
import { RootState } from 'modules/core/rootReducer';
import { useDispatch } from 'react-redux';
import { gameStart } from 'modules/game/quizGameModule';
import { login, logout } from 'modules/auth/authModule';

const DebugConfig: React.FC = () => {
  // テスト用コード
  const { isGameStart, auth } = useSelector((state: RootState) => {
    return { ...state.quizGame, ...state.auth};
  })
  const dispatch = useDispatch()

  const handleGameStartChange = () => {
    dispatch(gameStart());
  };
  const handleChange = () => {
    if (!auth) {
      dispatch(login());
    } else {
      dispatch(logout());
    }
  };

  return (
    <FormGroup row={true}>
      <FormControlLabel
        control={<Switch checked={auth} onChange={handleChange} aria-label="login switch" />}
        label={auth ? 'Logout' : 'Login'}
      />
      <FormControlLabel
        control={<Switch checked={isGameStart} onClick={handleGameStartChange} aria-label="game start switch" />}
        label={isGameStart ? 'GameStart' : 'Not Started Yet'}
      />
    </FormGroup>

  );
}
export default DebugConfig;