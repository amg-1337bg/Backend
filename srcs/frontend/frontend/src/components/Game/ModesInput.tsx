import { Stack } from '@mui/system'
import { ModeGameButton } from './ModeGameButton'


export const ModesInput = (props:{invite:boolean}) => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="440px">
            <ModeGameButton mode={'1'} invite={props.invite} />
            <ModeGameButton mode={'2'} invite={props.invite} />
        </Stack>
    )
}
