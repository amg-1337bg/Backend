import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Socket } from 'socket.io-client';

export enum ActionInput {
    InviteUSer,
    ChangePassword,
}

function getActionInput(action: ActionInput): string {
    switch (action) {
        case ActionInput.InviteUSer:
            return ("Invite a new user to the room")
        case ActionInput.ChangePassword:
            return ("Set new password of room")
        default:
            return ("Invalid Input");
    }
}



export default function DialogAction(props: { isDialogOpened: boolean, handleCloseDialog: any, action: ActionInput, socket: Socket,room:string }) {
    // const [open, setOpen] = React.useState(true);
    const [input, setInput] = React.useState("");

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    function inviteUser( user_login: string) {
        if (props.socket) {
            props.socket.emit('inviteUser', {user_to_invite: user_login});
            console.log("inviteUser: " + user_login);
        }
    }
    
    function changePassword(new_pass: string) {
        if (props.socket) {
            props.socket.emit('changePassword', {new_password:new_pass});
            console.log("new password is : " + new_pass);
        }
    }

    
    const handleClose = () => {
        props.handleCloseDialog({is_open:true, action_id:0});
    };

    return (
        <div>

            <Dialog open={props.isDialogOpened} onClose={handleClose}>
                <DialogTitle>{getActionInput(props.action)}</DialogTitle>
                <DialogContent>
                    {/*<DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>*/}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={props.action === ActionInput.InviteUSer ? "New User" : "New Password"}
                        type={props.action === ActionInput.InviteUSer ? "text" : "password"}
                        fullWidth
                        variant="standard"
                        onChange={e => setInput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => {
                        props.action === ActionInput.InviteUSer ? inviteUser(input) : changePassword(input);
                        handleClose()
                    }}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
