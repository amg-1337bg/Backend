import { Fab, Stack, Typography } from '@mui/material';
import shieldIcon from '../assets/shield.png';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import { useDispatch } from 'react-redux';
import { setOpenDialog2FA } from '../store/openDialogReducer';

interface Props2FA {
    verified: boolean,
}

export const Button2FA = ({ verified }: Props2FA) => {
    const dispatch = useDispatch();
    return (
        <Stack alignItems="center" justifyContent="flex-start" spacing={2}>
            <img alt='shield' src={shieldIcon} style={{ height: "55px" }} />
            <Typography sx={{
                width: "83%",
                fontWeight: '500',
                textAlign: "center",
                fontSize: '18px',
                lineHeight: '125%',
            }}>
                Two-Factor Authentication
                {verified && " Verified"}
                {!verified && " Not Verified"}
            </Typography>
            <Fab onClick={() => {
                dispatch(setOpenDialog2FA(true));
            }}
                variant="extended" sx={{ width: "70%", height: "35px" }}>
                {verified && <RemoveModeratorIcon />} {verified && <div style={{ marginLeft: "4%" }}>Disable</div>}
                {!verified && <VerifiedUserIcon />} {!verified && <div style={{ marginLeft: "4%" }}>Enable</div>}
            </Fab>
        </Stack>
    )
}
