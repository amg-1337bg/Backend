import { Box, Dialog, DialogContent, DialogTitle, IconButton, styled, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setOpenDialog2FA } from '../../store/openDialogReducer';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

type Props = {
    children: JSX.Element,
};

const SignInTwoFADialog = ({ children }: Props) => {
    // const isOpen = useSelector((state: RootState) => state.openDialog).is_open_tfa;
    const dispatch = useDispatch();

    return (
        <div>
            <BootstrapDialog
                // onClose={() => { dispatch(setOpenDialog2FA(false)) }}
                aria-labelledby="customized-dialog-title"
                open={true}>
                <Box sx={{ backgroundColor: "#36393F" }}>
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { dispatch(setOpenDialog2FA(false)) }} >
                        CONNECT WITH TWO-FACTOR AUTH
                        <Typography fontSize="0.8rem">
                            your account is safe:
                        </Typography>
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        {children}
                    </DialogContent>
                </Box>
            </BootstrapDialog>
        </div>
    )
}

export default SignInTwoFADialog