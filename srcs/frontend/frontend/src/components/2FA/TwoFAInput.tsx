import { Box, Button, Divider, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import code_qr_icon from '../../assets/code.png'
import { useEffect, useState } from 'react'
import { getMQrCodeUrl, sendCode2FADisable, sendCode2FAEnable } from '../../requests/home'
import { QRCodeCanvas } from 'qrcode.react'
import { useDispatch } from 'react-redux'
import { setOpenDialog2FA } from '../../store/openDialogReducer'
import { useNavigate } from 'react-router-dom'

export const TwoFAInput = (props: { enable: boolean }) => {
    const dispatch = useDispatch();
    const [qr_image, setImage] = useState("");
    const [input_code, setCode] = useState("");
    const [is_error, setErrorInput] = useState(false);
    const navigate = useNavigate();

    const handleEnable2FA = () => {
        sendCode2FAEnable(input_code).then((value) => {
            dispatch(setOpenDialog2FA(false));
        })
            .catch(() => { setErrorInput(true); });
    }

    const handleDisable2FA = () => {
        sendCode2FADisable(input_code).then((value) => {
            dispatch(setOpenDialog2FA(false));
        })
            .catch(() => { setErrorInput(true); });
    }

    const getImage = () => {
        getMQrCodeUrl().then((value) => {
            const data = value as { qrcodeUrl: string };
            setImage(data.qrcodeUrl);
        }).catch((error: any) => {
            console.log("Error ;Not Authorized", error);
            navigate(error.redirectTo);
        })
    }

    useEffect(() => {
        if (props.enable)
            getImage();
    }, [])

    return (
        <Stack alignItems="center" spacing={2} paddingRight="3%" paddingLeft="3%"
            divider={<Divider orientation="horizontal" flexItem />}
            sx={{
                background: "#36393F",
                width: "520px",
            }}>
            {props.enable && <Stack direction="row" spacing={3} >
                <Box sx={{ background: "#FFF", width: "190px", height: "190px" }}>
                    <QRCodeCanvas value={qr_image} style={{ width: "185px", height: "185px", padding: "15px" }} />
                </Box>
                <Box paddingTop="10px">
                    <Typography variant="body2">SCAN THE QR CODE</Typography>
                    <Typography marginTop="15px" variant="body2">Open the authentication app and scan the image to</Typography>
                    <Typography marginTop="15px" variant="body2">Open the authentication app and scan the image to
                        the left, using your phone's camera.</Typography>
                </Box>
            </Stack>}
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
                        {props.enable &&
                            <Button variant="contained" color="info" style={{ width: "150px" }}
                                onClick={handleEnable2FA}>
                                Activate
                            </Button>}
                        {!props.enable &&
                            <Button variant="contained" color="warning" style={{ width: "150px" }}
                                onClick={handleDisable2FA}>
                                Disable
                            </Button>}
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}
