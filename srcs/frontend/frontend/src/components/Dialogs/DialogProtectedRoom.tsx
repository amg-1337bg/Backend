import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import { handleToastMsg } from '../InfoMessages/Toast';
import { joinProtectedRoomPost } from '../../requests/home'


export default function DialogProtectedRoom(props: { isDialogOpened: boolean, handleCloseDialog: any, room: string }) {
    const [input, setInput] = React.useState("");
    const navigate = useNavigate();
    const [is_error, setErrorInput] = React.useState(false);

    const handleClose = () => {
        props.handleCloseDialog(true);
    };

    const handleProtectedRoom = () => {
        joinProtectedRoomPost(props.room, input).then((value) => {
			const data: {status : boolean, msg :string} = value as {status : boolean, "msg" :string};
			if (!data.status)
            {
                console.log("errorrrrrrr\n");
                setErrorInput(true);
            }
			else
            {
				handleToastMsg(data.status, data.msg);
                handleClose();
                navigate("/chatRoom");
            }
		}).catch((error: any) => {
			console.log("Error ;Not Authorized", error);
			navigate(error.redirectTo);
		})
    }

    return (
        <div>

            <Dialog open={props.isDialogOpened} onClose={handleClose}>
                <DialogTitle>Enter password of the room</DialogTitle>
                <DialogContent>
                    <TextField
                        error={is_error}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Password Room"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={e => setInput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => {
                        handleProtectedRoom(); 
                    }}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
