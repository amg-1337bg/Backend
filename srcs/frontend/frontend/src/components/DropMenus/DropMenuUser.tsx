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
import profileIcon from '../../assets/DropMenus/profile.png'
import chatIcon from '../../assets/DropMenus/chat.png'
import blockIcon from '../../assets/DropMenus/block.png'
import addFriendIcon from '../../assets/notification.png'
import { Friend, UserMessaging } from '../../requests/directMessage';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import { changeCurrConversation } from '../../store/chatUiReducer';
import { useNavigate } from 'react-router-dom';
import { setInviteData } from '../../store/gameReducer';
import axios from 'axios';

interface MenuProps {
	is_dm_user: boolean,
	friend?: Friend,
	user?: UserMessaging,
};


export type P_data = {
	username: string;
	login: string;
	avatar: string;
}

export type data = {
	P1: P_data;
	P2: P_data;
	mod: number
}

export default function DropMenuUser({ friend, user, is_dm_user }: MenuProps) {
	const dispatch = useDispatch();
	const socket_global = useSelector((state: RootState) => state.socketglobal).socket_global;
	const socket = useSelector((state: RootState) => state.socketclient).socket;
	const logged_user = useSelector((state: RootState) => state.user);
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);


	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const blockUser = () => {
		if (socket) {
			socket.emit('block_dm');
			// dispatch(changeCurrConversation({ user: '', avatar: ''}));
		}
	}

	const handleAddFriend = () => {
		axios.defaults.withCredentials = true;
		axios.post(process.env.REACT_APP_SERVER_IP + '/invitation?sendto=' + user?.login);
	}

	const blockFriend = (friend: string) => {
		if (socket)
			socket.emit('block_friend', { to: friend });
	}

	const chat = (user?: string, avatar?: string) => { // to edit
		if (socket) {
			if (socket && user) {
				// socket.emit('join_dm_room', { to: user });
				dispatch(changeCurrConversation({ user: user, avatar: avatar as string }));
				console.log("Chat with theme");
			}
		}
	}

	const handleShowProfile = () => {
		let other_user: string;
		if (friend)
			other_user = friend.login;
		else
			other_user = user?.login as string;
		navigate({
			pathname: '/dashboard',
			search: '?user=' + other_user,
		});
	}


	const handleSendInviteGame = () => {
		const p1: P_data = { username: logged_user.username, login: logged_user.login, avatar: logged_user.avatar as string };
		let p2: P_data;
		if (friend)
			p2 = { username: friend?.username as string, login: friend?.login as string, avatar: friend?.avatar as string };
		else
			p2 = { username: user?.username as string, login: user?.login as string, avatar: user?.avatar as string };
		const data: data = { P1: p1, P2: p2, mod: 0 };
		dispatch(setInviteData(data));
	}

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
								<ListItemButton onClick={() => { handleClose(); handleSendInviteGame() }}>
									<Avatar variant="square" src={playIcon} sx={{ marginRight: "15%", width: "19px", height: "19px" }} />
									<ListItemText primary="Play" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding>
								<ListItemButton onClick={() => { handleShowProfile(); handleClose()}}>
									<Avatar variant="square" src={profileIcon} sx={{ marginRight: "15%", width: "18px", height: "18px" }} />
									<ListItemText primary="Show Profile" />
								</ListItemButton>
							</ListItem>
							{(!is_dm_user) &&
								<ListItem disablePadding>
									<ListItemButton onClick={() => { handleClose(); chat(friend?.login, friend?.avatar) }}>
										<Avatar variant="square" src={chatIcon} sx={{ marginRight: "15%", width: "18px", height: "18px" }} />
										<ListItemText primary="Chat" />
									</ListItemButton>
								</ListItem>}
							{(is_dm_user && !friend) &&
								<ListItem disablePadding>
									<ListItemButton onClick={() => {handleAddFriend(); handleClose()}}>
										<Avatar variant="square" src={addFriendIcon} sx={{ marginRight: "15%", width: "18px", height: "18px" }} />
										<ListItemText primary="Add Friend" />
									</ListItemButton>
								</ListItem>}
							<ListItem disablePadding>
								<ListItemButton onClick={() => {
									handleClose();
									(is_dm_user) ? blockUser() : blockFriend(friend?.login as string)
								}}>
									<Avatar variant="square" src={blockIcon} sx={{ marginRight: "14%", width: "22px", height: "22px" }} />
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

