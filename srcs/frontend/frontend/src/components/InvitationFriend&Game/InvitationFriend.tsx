import { Box, Avatar, Typography, Stack, Button } from '@mui/material'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface InvitationProps {
	login: string,
	username: string,
	avatar: string,
}

export const InvitationFriend = ({ login, username, avatar }: InvitationProps) => {
	const [is_confirm, setConfirm] = useState(false);
	const navigate = useNavigate();
	
	const handleAcceptInvite = () => {
		axios.defaults.withCredentials = true;
		axios.post(process.env.REACT_APP_SERVER_IP + '/invitation/accept?sender=' + login, {
		}).then(() => {
			setConfirm(true);
		}).catch((error: any) => {
			console.log("Error ;Not Authorized", error);
			navigate(error.redirectTo);
		})
	}

	return (
		<Stack spacing={1.6} direction="row" justifyContent="flex-start" width="270px">
			<Box>
				<Avatar
					sx={{
						height: '65px',
						width: '65px',
						backgroundColor: "#FFF",
						// padding: "7px",
					}}
					alt={username} src={avatar} imgProps={{ style: { width: 'auto' } }} />
			</Box>
			<Stack justifyContent="center" alignItems="center" spacing={0.4}>
				<Typography
					className='truncate-typo'
					width='100%'
					fontWeight='500'
					fontSize='1.1rem'>
					{username}
				</Typography>
				<Stack direction="row" spacing={1.2} justifyContent="center">
					{!is_confirm &&
						<Button size="small" variant="contained"
							sx={{ background: "#1977F3", color: "#EFE1FE" }}
							onClick={() => { handleAcceptInvite() }}>
							Confirm
						</Button>}
					{is_confirm && <Button disabled size="small" variant="contained" sx={{ background: "#1977F3", color: "#EFE1FE" }}>
						Confirm
					</Button>}
					<Button size="small" variant="contained"
						sx={{ background: "#EBEDF0", color: "#6F6870", }}>
						Profile
					</Button>
				</Stack>
			</Stack>
		</Stack >
	)
}