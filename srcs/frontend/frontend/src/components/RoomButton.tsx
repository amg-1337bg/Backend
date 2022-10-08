import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import {  useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import groupIcon from '../assets/group-icon.svg'
import { JoinRoomPost } from '../requests/home'
import { RootState } from '../store'
import DialogProtectedRoom from './Dialogs/DialogProtectedRoom'
import { handleToastMsg } from './InfoMessages/Toast'

type RoomDataButtom = {
	room_id: string,
	owner: string,
	count: number,
	kind: string,
};

const RoomButton = (Props: RoomDataButtom) => {
	const navigate = useNavigate();
	const [is_dialog_open, setDialogOpen] = React.useState(false);
	const logged_user = useSelector((state: RootState) => state.user).login;

	const handlePublicRoom = () => {
		JoinRoomPost(Props.room_id).then((value) => {
			const data: { room_id: string } = value as { room_id: string };
			if (data && data.room_id !== '')
				handleToastMsg(true, `You are now user at ${data.room_id}`);
			else
				handleToastMsg(false, `You are already user at ${Props.room_id}`);
			navigate("/chatRoom");
		}).catch((error: any) => {
			console.log("Error ;Not Authorized", error);
			navigate(error.redirectTo);
		})
	}

	const handleDialogProtectedRoom = () => {
		if (Props.owner !== logged_user )
			setDialogOpen(!is_dialog_open);
		else
		{
			handleToastMsg(true, `You are already user at ${Props.room_id}`);
			navigate("/chatRoom");
		}
	}

	return (
		<Box
			onClick={() => { (Props.kind === "Public rooms") ? handlePublicRoom() : handleDialogProtectedRoom() }}
			sx={{
				width: '320px',
				height: '210px',
				boxSizing: 'border-box',
				background: 'linear-gradient(110.14deg, #355B88 27.7%, #341760 83.08%)',
				border: '2px solid #FFFFFF',
				borderRadius: '27px',
				cursor: "pointer",
			}}>
			<Box
				sx={{
					margin: '15px 20px'
				}}>
				<div className='room-title center-text center-button' style={{ padding: '0 15px' }}>
					{Props.room_id}
				</div>
			</Box>

			<Stack
				direction="row"
				spacing={1}
				sx={{
					margin: '23px 23px 0px',
				}}>
				<Box>
					<div className='dot center-text center-button' style={{ marginLeft: '5px' }}>
						{Props.owner.charAt(0)}
					</div>
					<Typography
						sx={{
							fontWeight: '300px'
						}}>
						{Props.owner}
					</Typography>
				</Box>
				<Box>
					<div className='dot-dotted' />
				</Box>
			</Stack>
			<Stack
				direction="row"
				spacing={2}
				sx={{
					marginLeft: '25px',
					marginTop: '10px'
				}}>
				<img src={groupIcon} alt="room users" style={{ height: 34, marginTop: 14 }} />
				<div style={{ fontSize: '44px', fontWeight: 550 }}>
					{Props.count}
				</div>
			</Stack>
			<DialogProtectedRoom isDialogOpened={is_dialog_open} handleCloseDialog={() => setDialogOpen(false)} room={Props.room_id}/>
		</Box>
	)
}

export default RoomButton