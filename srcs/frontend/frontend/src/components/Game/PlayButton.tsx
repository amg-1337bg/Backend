import { Button } from '@mui/material'
import { useDispatch } from 'react-redux';
import { startInviteGame } from '../../store/gameReducer';

const PlayButton = () => {
    const dispatch = useDispatch();
    
  return (
    <Button fullWidth onClick={() => {dispatch(startInviteGame())}}>Play</Button>
  )
}

export default PlayButton