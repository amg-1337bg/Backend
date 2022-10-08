import { Box, Dialog, DialogContent, DialogTitle, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { HandleCloseDialog } from '../../store/gameReducer';
import { useDispatch } from 'react-redux';


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

const ModeDialog = ({ children }: Props) => {
    const isOpen = useSelector((state: RootState) => state.game).dialogIsOpen;
    const dispatch = useDispatch();
    // useEffect(() => {
    // }, [modeGame])

    return (
        <div>
            {/* <div className='button-custom center-text center-button' style={{ width: '280px' }}
				onClick={handleClickOpen}>
				Choose A Game Mode
			</div> */}
            <BootstrapDialog
                onClose={() => {dispatch(HandleCloseDialog())}}
                aria-labelledby="customized-dialog-title"
                open={isOpen}>
                <Box sx={{ backgroundColor: "#130742" }}>
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={() => {dispatch(HandleCloseDialog())}} >
                        Choose A Game Mode
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        {children}
                    </DialogContent>
                </Box>
            </BootstrapDialog>
        </div>
    )
}

export default ModeDialog