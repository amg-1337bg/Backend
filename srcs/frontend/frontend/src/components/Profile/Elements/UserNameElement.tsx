import { Box, Stack, Typography } from '@mui/material'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DropMenuUserHome from '../../DropMenus/DropMenuUserHome';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface PropsUserType {
	login: string,
	username: string,
	avatar:string,
	level: number,
}

const UserNameElement = (Props: PropsUserType) => {
    const logged_user = useSelector((state: RootState) => state.user).login;

	return (
		<Box
			sx={{
				width: "240px",
				height: "79px",
			}}>
			<Stack
				spacing={1}
				justifyContent="space-between"
				alignItems="flex-start">
				<Stack direction="row">

					<Typography
						fontFamily="Lato"
						fontWeight='800'
						fontSize='2.2rem'
						lineHeight='109.52%'>
						{Props.username}
					</Typography>
					{Props.login !== logged_user &&  <DropMenuUserHome avatar={Props.avatar} username={Props.username} login={Props.login} level={0} status={""} />}

				</Stack>
				<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
					<Typography
						fontFamily="Lato"
						fontWeight='800'
						fontSize='1.2rem'
						color="#A9AEE3">
						{Props.login}
					</Typography>
					<Stack direction="row" spacing={0.5}>
						<SportsEsportsIcon sx={{ width: "19px" }} />
						<Typography
							sx={{
								color: '#ADADAD',
								fontWeight: '600',
								fontSize: '0.9rem',
								paddingTop: '1.3px',
							}}>
							{/* Level 23</Typography> */}
							Level {Props.level}</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Box >
	)
}

export default UserNameElement 