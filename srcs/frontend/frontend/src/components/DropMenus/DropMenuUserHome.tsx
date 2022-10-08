import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import * as React from 'react';
import Menu from '@mui/material/Menu';
import { Avatar, Button } from '@mui/material';
import playIcon from '../../assets/DropMenus/play.png'
import profileIcon from '../../assets/DropMenus/profile.png'
import chatIcon from '../../assets/DropMenus/chat.png'
import blockIcon from '../../assets/DropMenus/block.png'
import addFriendIcon from '../../assets/notification.png'
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import dot3Icon from '../../assets/dot3.png'
import { BlockUserPost, ChatUserPost, UserData } from '../../requests/home';
import { P_data } from './DropMenuUser';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { data, setInviteData } from '../../store/gameReducer';


export default function DropMenuUserHome(Props: UserData) {
	const dispatch = useDispatch();
	const socket_global = useSelector((state: RootState) => state.socketglobal).socket_global;
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

	const handleAddFriend = () => {
		axios.defaults.withCredentials = true;
		axios.post(process.env.REACT_APP_SERVER_IP + '/invitation?sendto=' + Props.login);
	}

	const HandleblockUser = () => {
		BlockUserPost(Props.login);
	}

	const Handlechat = () => { // to edit
		ChatUserPost(Props.login);
		navigate({
			pathname: '/instantMessaging',
			search: '?user=' + Props.login + '&avatar=' + Props.avatar,
		});
	}

	const handleShowProfile = () => {
		navigate({
			pathname: '/dashboard',
			search: '?user=' + Props.login,
		});
	}

	const handleSendInviteGame = () => {
		const p1: P_data = { username: logged_user.username, login: logged_user.login, avatar: logged_user.avatar as string };
		const p2: P_data = { username: Props.username as string, login: Props.login as string, avatar: Props.avatar as string };
		const data: data = { P1: p1, P2: p2, mod: 0 };
		dispatch(setInviteData(data));
	}

	return (
		<Box style={{ paddingTop: '8px', paddingLeft:"0px"}}>
			<Button style={{  backgroundColor: 'transparent' }}

				id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}>
				<img
					style={{ height: '22px', float: 'right' }}
					className="center" alt='users' src={dot3Icon} />
			</Button>

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
								<ListItemButton onClick={() => { handleClose(); handleShowProfile()}}>
									<Avatar variant="square" src={profileIcon} sx={{ marginRight: "15%", width: "18px", height: "18px" }} />
									<ListItemText primary="Show Profile" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding>
								<ListItemButton onClick={() => { handleClose(); Handlechat() }}>
									<Avatar variant="square" src={chatIcon} sx={{ marginRight: "15%", width: "18px", height: "18px" }} />
									<ListItemText primary="Chat" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding>
								<ListItemButton onClick={() => { handleClose(); handleAddFriend() }}>
									<Avatar variant="square" src={addFriendIcon} sx={{ marginRight: "15%", width: "18px", height: "18px" }} />
									<ListItemText primary="Add Friend" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding>
								<ListItemButton onClick={() => {
									handleClose(); HandleblockUser();
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
		</Box>
	);
}

