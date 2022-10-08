import { Alert, Box, Slide, Snackbar } from '@mui/material';
import React from 'react';

interface AlertMsg {
    is_alert: boolean,
    status: boolean,
    msg: string,
}

export const initAlertMsg: AlertMsg = {
    is_alert: false,
    status: false,
    msg: "",
};


export const AlertMsg = (props: AlertMsg) => {
    const [open, setOpen] = React.useState(true);


    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} onClose={handleClose}
            autoHideDuration={1000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            TransitionComponent={Slide}
        >
            <Box>
                {props.status && <Alert variant="filled" severity="success">{props.msg}</Alert>}
                {!props.status && <Alert variant="filled" severity="error">{props.msg}</Alert>}
            </Box>
        </Snackbar>
        
    )
}
