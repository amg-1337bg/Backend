import {  Box, Button, Divider, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import code_qr_icon from '../../assets/code.png'
import { useState } from 'react'
import {sendCode2FAConnect} from '../../requests/home'
import { useDispatch } from 'react-redux'
import { setOpenDialog2FA } from '../../store/openDialogReducer'
import { useNavigate } from 'react-router-dom'

export const SignInTwoFAInput = () => {
    const dispatch = useDispatch();
    const [input_code, setCode] = useState("");
    const [is_error, setErrorInput] = useState(false);
    const navigate = useNavigate();

    const handleAuth2FA = () => {
        sendCode2FAConnect(input_code)
        .then(() => {
            console.log("heeeeeere");
            dispatch(setOpenDialog2FA(false));
            navigate('/home');
        })
            .catch(() => { setErrorInput(true); });
    }

    return (
        <Stack alignItems="center" spacing={2} paddingRight="3%" paddingLeft="3%"
            divider={<Divider orientation="horizontal" flexItem />}
            sx={{
                background: "#36393F",
                width: "520px",
            }}>
            <Stack direction="row">
                <Box sx={{ width: "235px", height: "190px", margin: "auto", paddingTop: "20px", paddingLeft: "45px" }}>
                    <img src={code_qr_icon} style={{ width: "120px", height: "120px" }} />
                </Box>
                <Stack spacing={2}>
                    <Box paddingTop="10px">
                        <Typography variant="body2">LOGIN WITH YOUR CODE</Typography>
                        <Typography marginTop="15px" variant="body2">Enter the 6-digit verification code generated.</Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <TextField error={is_error}
                            id="outlined-basic" label="Code" variant="outlined"
                            onChange={e => setCode(e.target.value)} />
                        <Button variant="contained" color="info" style={{ width: "150px" }}
                            onClick={handleAuth2FA}>
                            Connect
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}
