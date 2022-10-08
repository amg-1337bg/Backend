import { Avatar, Badge, Box, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { Friend } from '../requests/directMessage';
import DropMenuUser from './DropMenus/DropMenuUser';

const online_bg:string = "#3FFC10";
const offline_bg:string = "red";
const inGame_bg:string = "yellow";

export const FriendButton = (props:{friend:Friend}) => {
	const [bg_status, setBgStatus] = useState(online_bg);

	const handleColorStatus = () => {
  
	  setBgStatus( (props.friend.status === "online") ? online_bg
		: (props.friend.status === "offline") ? offline_bg
		: (props.friend.status === "inGame") ? inGame_bg
		: online_bg)
	}
  
	useEffect(()=>{
	  handleColorStatus();
	},[])

	
	return (
		<Box
			sx={{
				background: 'linear-gradient(to bottom right, #2E2256, #4289F3)',
				minWidth: '290px',
				width: '290px',
				height: '55px',
				borderRadius: '12px',
				position: 'relative',

			}}>
			<Stack spacing={2} direction="row" padding='3% 3%'
			>
				<div>
					<Badge
						overlap="circular"
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						badgeContent={
							<div style={{ backgroundColor: bg_status }} className="dot_status" />
						}
					>
						<Avatar
							sx={{
								height: '36px',
								width: '37px',
								backgroundColor: "#FFF",
							}}
							alt={props.friend.login} src={props.friend.avatar} imgProps={{ style: { width: 'auto' } }} />
					</Badge>
				</div>
				<Box
				>
					<Typography
						sx={{
							fontFamily: 'Lexend',
							fontWeight: '500',
							fontSize: '1.15rem',
							fontStyle: 'normal',
							margin: '5.2% auto'
						}}>{props.friend.username}</Typography>
				</Box>
				<div style={{ marginLeft: 'auto' }}>
					<DropMenuUser is_dm_user={false} friend={props.friend} />
				</div>
			</Stack>
		</Box >
	)
}