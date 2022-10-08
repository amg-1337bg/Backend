import { Avatar, Box, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import classicImage from '../../assets/Game/classic.png'
import RetroImage from '../../assets/Game/RetroMode.png'
import { RootState } from '../../store'
import {  HandleCloseDialog } from '../../store/gameReducer'
interface modeGameProps {
	mode: string,
	invite: boolean,
}

export const ModeGameButton = ({ mode, invite }: modeGameProps) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const colorBg = (mode === '1') ? "linear-gradient(to right bottom, #673AB7, #512DA8 )"
		: "linear-gradient(to right bottom, #000046, #1CB5E0 )";
	const socket_global = useSelector((state: RootState) => state.socketglobal).socket_global;
	const invite_data_send = useSelector((state: RootState) => state.game).inviteData;


	const handleNavigate = (mode: string) => {
		navigate({
			pathname: '/matchmaking',
			search: '?mode=' + mode,
		});
	}

	const handleMatchMaking = () => {
		((mode === '1') ? handleNavigate('1') : handleNavigate('2'))
	}
	

	const handleInviteGame = () => {
		let data;
		if (mode === "1")
			data:data = {P1:invite_data_send.P1, P2:invite_data_send.P2, mod:0};
		else if (mode === "2")
			data:data = {P1:invite_data_send.P1, P2:invite_data_send.P2, mod:1};
		socket_global.emit('invite', data);
	}
	
	return (
		<Box
			// onClick={() => { dispatch((mode === '1') ? setModeGame({ mode: ModeEnum.mode1 }) : setModeGame({ mode: ModeEnum.mode2 })) }}
			onClick={() => { ((!invite) ? handleMatchMaking(): handleInviteGame()); dispatch(HandleCloseDialog()) }}
			sx={{
				align:"center",
				width: "210px",
				height: "200px",
				backgroundImage: colorBg,
				borderRadius: '24px',
				position: 'relative',
				cursor: 'pointer',
				'&:hover': {
					backgroundColor: 'primary.main',
					opacity: [0.9, 0.8, 0.7],
				},
			}}>
			{mode === '1' && <Avatar src={classicImage} sx={{ width: "160px", height: "160px", margin: 'auto', marginLeft: '10%' }} />}
			{mode === '2' &&
				<Box sx={{ paddingTop: "5px" }}>
					<Avatar src={RetroImage} sx={{ width: "125px", height: "125px", margin: 'auto', marginTop: '8%' }} />
				</Box>}
			<Typography sx={{
				position: 'absolute',
				bottom: 10,
				left: 22,
				fontSize: "1.19rem",
				fontWeight: "800",
				fontStyle: "italic",
				textShadow: "1px 2px #000"
			}}>
				{mode === '1' && "MODE CLASSIC"}
				{mode === '2' && "MODE RUSH"}
			</Typography>
		</Box>
	)
}
