import { Box, IconButton, List, Stack, Typography } from '@mui/material'
import roomIcon from '../assets/chat-room.png'
import RoomButtonChat from './RoomButtonChat';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../store';
import { getMyRooms, RoomsOfUser } from '../requests/rooms';
import { changeCurrRoom } from '../store/chatUiReducer';
import { handleToastMsg } from './InfoMessages/Toast';
import { useNavigate } from 'react-router-dom';


let initRooms: RoomsOfUser[] = [] as RoomsOfUser[];
initRooms.length = 0;

const Rooms = () => {
	const dispatch = useDispatch();
	const [rooms, setRooms] = useState(initRooms);
	const socket = useSelector((state: RootState) => state.socketclient).socket;
	const currentRoom = useSelector((state: RootState) => state.chat).curr_room;
	const currentRole = useSelector((state: RootState) => state.chat).curr_role;
	const navigate = useNavigate();

	const joinRoom = () => {
		if (socket && currentRoom !== '')
			socket.emit('JoinRoom', { room: currentRoom });
	}

	function getRooms() {
		getMyRooms().then((value) => {
			if ((typeof value) === (typeof rooms)) {
				const data = value as RoomsOfUser[];
				if (rooms.length === 0 && data.length > 0)
					dispatch(changeCurrRoom({ room: data[0].room_id as string, role: data[0].user_role as string }))
				setRooms(data);
			}
		})
			.catch((error: any) => {
				console.log("Error ;Not Authorized", error);
				navigate(error.redirectTo);
			})
	}

	const receiveUpdate = () => {
		socket.on('roomsOfUser', (data: { status: boolean, action: string, message: string, user: string }) => {
			if (data.action === 'admin') {
				handleToastMsg(data.status, data.message);
				if (data.status) {
					getRooms();
					console.log("current room : ", currentRoom, "role: ", currentRole);
					dispatch(changeCurrRoom({ room: currentRoom, role: "admin" }))
				}
			}
			else if (data.action === 'owner') {
				handleToastMsg(data.status, data.message);
				if (data.status) {
					getRooms();
					console.log("current room : ", currentRoom, "role: ", currentRole);
					dispatch(changeCurrRoom({ room: currentRoom, role: "owner" }))
				}
			}
			else if (data.action === 'setAdmin') {
				handleToastMsg(data.status, data.message);
				if (data.status) {
					getRooms();
					console.log("current room : ", currentRoom, "role: ", currentRole);
					dispatch(changeCurrRoom({ room: currentRoom, role: currentRole }))
				}
			}
			else if (data.action === 'leave') {
				handleToastMsg(data.status, data.message);
				if (data.status) {
					getRooms();
					if (rooms.length > 0)
						dispatch(changeCurrRoom({ room: rooms[0].room_id as string, role: rooms[0].user_role as string }))
				}
			}
			else if (data.action === "")
				handleToastMsg(data.status, data.message);
		})
	}

	useEffect(() => {
		if (socket)
			receiveUpdate();
		return (() => {
			socket.off("roomsOfUser");
		})
	},)

	useEffect(() => {
		// Get Rooms
		joinRoom();
		getRooms();
		return () => {
			console.log("clear rooms");
		}
	}, [currentRoom])

	return (
		<Box
			className='rooms'
			sx={{
				backgroundColor: "#202541",
				height: '100vh',
				padding: '30px',
				width: "calc(100% - 510px)",

			}}>
			<Stack height="100%">
				<Stack spacing={1} direction="row">
					<IconButton>
						<img src={roomIcon} width="36px" alt='roomIcon' />
					</IconButton>
					<div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
						<Typography sx={{
							fontWeight: '700',
							fontSize: '28px',
							lineHeight: '109.52%',

						}}>
							Chat Room
						</Typography>
					</div>
				</Stack>
				<Stack spacing={3} direction="row" margin="40px 35px 20px 9px">
					<Typography sx={{
						fontWeight: '600',
						fontSize: '22px',
						lineHeight: '109.52%',
					}}>
						Rooms
					</Typography>
					<div className='dot-nb center-button'>
						{rooms.length}
					</div>
					<div style={{
						marginLeft: "auto",
					}}>
						{/* <Typography sx={{
							fontWeight: '400',
							fontSize: '14px',
							lineHeight: '109.52%',
							textDecorationLine: 'underline',
							marginTop: "3%",
							cursor: "pointer"
						}}>
							Create new room
						</Typography> */}
					</div>
				</Stack>
				<List style={{ overflow: 'auto', height: "100%" }} >
					{rooms && rooms.map((item: RoomsOfUser) => (
						<li key={item.id} className='item-friend'>
							<RoomButtonChat room={item} />
						</li>
					))}
					{!rooms.length &&
						<Typography
							sx={{
								width: '100%',
								// whiteSpace: "nowrap",
								color: '#ADADAD',
								fontWeight: '400',
								fontSize: '1rem',
								paddingTop: '1.2px',
								paddingLeft: "8px",
							}}>Try joining a room first ;) </Typography>
					}
				</List>
			</Stack>
			{/* {alertMsg.is_alert && <AlertMsg is_alert={true} status={alertMsg.status} msg={alertMsg.msg} />} */}
		</Box>
	)
}

export default Rooms