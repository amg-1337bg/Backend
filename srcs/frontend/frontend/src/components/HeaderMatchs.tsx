import { Box, Stack } from '@mui/material'
import CustomizedDialog from './CustomizedDialog';
import FormNewRoom from './FormNewRoom';

import animatedPong from '../assets/animatedPong.gif'
import HeaderPong from '../assets/HeaderPong.png'
import { useNavigate } from 'react-router-dom';

const HeaderMatchs = () => {
	const navigate = useNavigate();
	return (
		<Stack
			sx={{
				paddingLeft: "5.3%",
				width: '100%',
				backgroundColor: '#202541',
			}}
			direction="row"
			spacing={35}>
			<Box
				sx={{
					width: '100%',
				}}>
				<Stack
					spacing={0.4}>
					<Box
						sx={{
							height: "50%",
						}}>
						<img alt="Ping Pong" src={HeaderPong} className="center-img" height="130px" />
					</Box>
					{/* button Create Room */}
					<Box className='center-button' >
						<div className='button-custom center-text center-button' style={{ width: '280px' }}
							onClick={() => {navigate(0)}}
							>
							Update matchs
						</div>
					</Box>
				</Stack>
			</Box>
			<Box
				sx={{
					width: '100%',
				}}>
				<img alt="Pong Online" src={animatedPong} className="center-img" height="210px" />
			</Box>
			<Box
				sx={{
					width: '100%',
				}}></Box>
		</Stack>
	)
}

export default HeaderMatchs