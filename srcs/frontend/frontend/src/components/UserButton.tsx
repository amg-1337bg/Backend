import { Avatar, Badge, Box, Stack, Typography } from '@mui/material'
import { Socket } from 'socket.io-client';
import { UserOfRoom } from '../store/roomUsersReducer';
import DropMenuUsersRoom from './DropMenus/DropMenuUsersRoom';

export const UserButton = (Props: { user: UserOfRoom, socket: Socket, role_user:string}) => {

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
						// badgeContent={
						// 	<div style={{ backgroundColor: '#3FFC10' }} className="dot_status" />
						// }
					>
						<Avatar
							sx={{
								height: '36px',
								width: '37px',
								backgroundColor: "#FFF",
							}}
							alt="Lion" src={Props.user.avatar} imgProps={{ style: { width: 'auto' } }} />
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
						}}>{Props.user.username}</Typography>
				</Box>
				<div style={{ marginLeft: 'auto' }}>
					<DropMenuUsersRoom user={Props.user} socket={Props.socket} role_user={Props.role_user}/>
				</div>
			</Stack>
		</Box >
	)
}