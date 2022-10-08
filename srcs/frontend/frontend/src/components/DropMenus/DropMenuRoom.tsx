import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HttpsIcon from '@mui/icons-material/Https';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';

import * as React from 'react';
import Menu from '@mui/material/Menu';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { RoomsOfUser } from '../../requests/rooms';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import DialogAction, { ActionInput } from '../Dialogs/DialogAction';
import { useDispatch } from 'react-redux';



interface ActionInputState {
	is_open: boolean,
	action_id: ActionInput,
}

const initActionInputState: ActionInputState = {
	is_open: false,
	action_id: ActionInput.InviteUSer,
}

export default function DropMenuRoom(Props: { room: RoomsOfUser}) {
	const dispatch = useDispatch();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	// let { socket } = React.useContext(SocketContext) as SocketContextType;
	const socket = useSelector((state: RootState) => state.socketclient).socket;

	function leaveRoom() {
		if (socket)
		{
			socket.emit('leaveRoom');
			console.log("Leave Room : ");
			// dispatch(changeCurrRoom({room:'', role:''}))
		}
	}
	
	function disablePassword() {
		if (socket) {
			socket.emit('disablePassword');
			console.log("disable password : ");
		}
	}

	
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	
	/************* For Dialog Input ***************/
	const [action, setAction] = React.useState(initActionInputState);
	const handleOpenDialog = (new_action: ActionInput) => {
		setAction({ is_open: !action.is_open, action_id: new_action });
	}

	/**********************************************/
	return (
		<div>
			<IconButton id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			>
				<MoreVertIcon />
			</IconButton>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
				sx={{
					"& .MuiPaper-root": {
						backgroundColor: "#3D4060"
					}
				}}
			>
				<Box sx={{ maxWidth: 360 }}>
					<nav aria-label="main folders">
							<List dense={true} >
								<ListItem disablePadding>
									<ListItemButton onClick={() => { handleClose(); leaveRoom() }}>
										<ListItemIcon>
											<ExitToAppIcon />
										</ListItemIcon>
										<ListItemText primary="Leave" />
									</ListItemButton>
								</ListItem>
								{(Props.room.user_role === 'owner' && Props.room.type === 'protected') &&
								<ListItem disablePadding>
									<ListItemButton onClick={() => { handleClose(); handleOpenDialog(ActionInput.ChangePassword) }}>
										<ListItemIcon>
											<HttpsIcon />
										</ListItemIcon>
										<ListItemText primary="Change the password" />
									</ListItemButton>
								</ListItem>}
								{(Props.room.user_role === 'owner' && Props.room.type === 'protected') &&
								<ListItem disablePadding>
									<ListItemButton onClick={() => { handleClose(); disablePassword() }}>
										<ListItemIcon>
											<NoEncryptionIcon />
										</ListItemIcon>
										<ListItemText primary="Disable password" />
									</ListItemButton>
								</ListItem>}
								{Props.room.user_role === 'owner' &&
								<ListItem disablePadding>
									<ListItemButton onClick={() => { handleClose(); handleOpenDialog(ActionInput.InviteUSer) }}>
										<ListItemIcon>
											<GroupAddIcon />
										</ListItemIcon>
										<ListItemText primary="Invite a user" />
									</ListItemButton>
								</ListItem>}
							</List>
					</nav>
					<Divider />
				</Box>
			</Menu>
			<DialogAction isDialogOpened={action.is_open} handleCloseDialog={() => setAction({ is_open: false, action_id: 0 })}
				action={action.action_id} room={Props.room.room_id as string} socket={socket} />
		</div>
		/****** / */
	);
}


// leave
/**

 * if (false)
 * 		client.emit(  "userRooms" , {"false" , message ,user  :"current"})
 *	else
 * 		client.emit( "userRooms" , {status : true  , message : "" , user  :current}) 
 * 		server.to(room).emit("usersOfRoom" ,{status : true , message : "" , user : current})
 */

/*

	changePassword(password:string)  - Disable
	if false
		client.emit("userRooms" ,{status : false , message : "" , user : current })
	else
		server.to(room).emit("userRooms" , {status : true , message : "" , user : current })

	
*/

/**
 * 
 *  invite user (new_user : string)
 * if (false)
 * {
 * 		client.emit("userRooms" , {status : false , message : "" , user : current (lidar l'action)})
 * }
 * else
 * {
		server.to(room).emit("userRooms" , {status : true , message : "" , user : current })
		server.to(room).emit("usersOfRoom" ,{status : true })
	  }
 */

/**
 * 
	setAdmin(new_admin : string )
	if(false)
		client.emit("userRooms" ,{status : false , message : "" , user : current })
	else
	{
		server.to(room).emit("userRooms" , {status : true , message : "" , user : current })
		server.to(room).emit("usersOfRoom" ,{status : true })
		
	}
 */


/**
 * 
 * Ban (new_ban : string)
 * if(false)
 * {
 * 		client.emit("userRooms" ,{status : false , message : "" , user : current })
 * }else
 * {
 * 		server.to(room).emit("userRooms" , {status : true , message : "" , user : current }) 
 * 		server.to(room).emit("usersOfRoom" ,{status : true })
 * 		server.to(room).emit("zwa99" ,{status : true , user : new_ban})
 * 		

 * }
 * 
 */