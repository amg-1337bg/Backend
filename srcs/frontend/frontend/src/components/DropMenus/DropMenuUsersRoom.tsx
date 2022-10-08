import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import * as React from 'react';
import Menu from '@mui/material/Menu';
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import playIcon from '../../assets/DropMenus/play.png'
import addFriendIcon from '../../assets/notification.png'
import profileIcon from '../../assets/DropMenus/profile.png'
import chatIcon from '../../assets/DropMenus/chat.png'
import muteIcon from '../../assets/DropMenus/mute.png'
import banIcon from '../../assets/DropMenus/ban.png'
import seAdminIcon from '../../assets/DropMenus/admin.png'
import { UserOfRoom } from '../../store/roomUsersReducer';
import { Socket } from 'socket.io-client';
import axios from 'axios';
import { BlockUserPost, ChatUserPost } from '../../requests/home';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { P_data } from './DropMenuUser';
import { data, setInviteData } from '../../store/gameReducer';
import { RootState } from '../../store';

// !!!!!!!! ADD listener ????????????
function muteUser(socket: Socket, user: string) {
	if (socket) {
		socket.emit('mute',{"who" : user , "time" : 1 , "type" : "minute"});
	}
}

function banUser(socket: Socket, user: string) {
	if (socket)
		socket.emit('ban',{"who" : user , "time" : 1 , "type" : "minute"});
}

function kickUser(socket: Socket, user: string) {
	if (socket)
		socket.emit('kick',{"who" : user});
}

function setAdmin(socket: Socket, user: string) {
	if (socket)
		socket.emit('setAdmin',{"new_admin" : user});
}


export default function DropMenuUsersRoom(Props: { user: UserOfRoom, socket: Socket, role_user: string }) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const logged_user = useSelector((state: RootState) => state.user);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};


	const handleAddFriend = () => {
		axios.defaults.withCredentials = true;
		axios.post(process.env.REACT_APP_SERVER_IP + '/invitation?sendto=' + Props.user.login);
	}

	// const HandleblockUser = () => {
	// 	BlockUserPost(Props.login);
	// }

	const Handlechat = () => { // to edit
		ChatUserPost(Props.user.login);
		navigate({
			pathname: '/instantMessaging',
			search: '?user=' + Props.user.login + '&avatar=' + Props.user.avatar,
		});
	}

	const handleShowProfile = () => {
		navigate({
			pathname: '/dashboard',
			search: '?user=' + Props.user.login,
		});
	}

	const HandleblockUser = () => {
		BlockUserPost(Props.user.login);
	}
	
	const handleSendInviteGame = () => {
		const p1: P_data = { username: logged_user.username, login: logged_user.login, avatar: logged_user.avatar as string };
		const p2: P_data = { username: Props.user.username as string, login: Props.user.login as string, avatar: Props.user.avatar as string };
		const data: data = { P1: p1, P2: p2, mod: 0 };
		dispatch(setInviteData(data));
	}


	console.log(Props.role_user , " | " ,Props.user.user_role);
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
				<Box sx={{ maxWidth: 340, minWidth: 170 }}>
					<nav aria-label="main folders">
						<List dense={true} >
							<ListItem disablePadding >
								<ListItemButton onClick={() => {handleSendInviteGame(); handleClose()}}>
									<Avatar variant="square" src={playIcon} sx={{ marginRight: "15%", width: "19px", height: "19px" }} />
									<ListItemText primary="Play" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding>
								<ListItemButton onClick={() => { handleAddFriend(); handleClose() }}>
									<Avatar variant="square" src={addFriendIcon} sx={{ marginRight: "15%", width: "18px", height: "18px" }} />
									<ListItemText primary="Add Friend" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding>
								<ListItemButton onClick={() => {handleShowProfile(); handleClose()}}>
									<Avatar variant="square" src={profileIcon} sx={{ marginRight: "15%", width: "18px", height: "18px" }} />
									<ListItemText primary="Show Profile" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding>
								<ListItemButton onClick={() => { Handlechat();handleClose()}}>
									<Avatar variant="square" src={chatIcon} sx={{ marginRight: "14%", width: "20px", height: "20px" }} />
									<ListItemText primary="Chat" />
								</ListItemButton>
							</ListItem>
							{(Props.role_user === "owner" && Props.user.user_role === 'user' ) &&
								<ListItem disablePadding>
									<ListItemButton onClick={() => { setAdmin(Props.socket, Props.user.login); handleClose() }}>
										<Avatar variant="square" src={seAdminIcon} sx={{ marginRight: "15%", width: "20px", height: "20px" }} />
										<ListItemText primary="Set As Admin" />
									</ListItemButton>
								</ListItem>}
							{((Props.role_user === "owner" && Props.user.user_role !== "owner") ||
								(Props.role_user === "admin" && Props.user.user_role === "user" )) &&
								<ListItem disablePadding>
									<ListItemButton onClick={() => { muteUser(Props.socket, Props.user.login); handleClose() }}>
										<Avatar variant="square" src={muteIcon} sx={{ marginRight: "15%", width: "20px", height: "20px" }} />
										<ListItemText primary="Mute" />
									</ListItemButton>
								</ListItem>}
							{((Props.role_user === "owner" && Props.user.user_role !== "owner") ||
								(Props.role_user === "admin" && Props.user.user_role === "user" )) &&
								<ListItem disablePadding>
									<ListItemButton onClick={() => { banUser(Props.socket, Props.user.login); handleClose() }}>
										<Avatar variant="square" src={banIcon} sx={{ marginRight: "15%", width: "20px", height: "20px" }} />
										<ListItemText primary="Ban" />
									</ListItemButton>
								</ListItem>}
							{((Props.role_user === "owner" && Props.user.user_role !== "owner") ||
								(Props.role_user === "admin" && Props.user.user_role === "user" )) &&
								<ListItem disablePadding>
									<ListItemButton onClick={() => { kickUser(Props.socket, Props.user.login); handleClose() }}>
										<Avatar variant="square" src={banIcon} sx={{ marginRight: "15%", width: "20px", height: "20px" }} />
										<ListItemText primary="kick" />
									</ListItemButton>
								</ListItem>}
								<ListItem disablePadding>
									<ListItemButton onClick={() => { HandleblockUser();handleClose() }}>
										<Avatar variant="square" src={banIcon} sx={{ marginRight: "15%", width: "20px", height: "20px" }} />
										<ListItemText primary="Block" />
									</ListItemButton>
								</ListItem>
						</List>
					</nav>
					<Divider />
				</Box>
			</Menu>
		</div>
	);
}

