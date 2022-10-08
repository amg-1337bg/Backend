import { Box, Typography } from '@mui/material'

export interface PlayerTableProps {
	username: string,
	level: number,
}

const PlayerTable = (Props: PlayerTableProps) => {
	return (
		<Box
			sx={{
				alignItems:"center",
				marginTop:"23px",
				width: '130px',
				height: '60px',
			}}>
			<Typography
				className='truncate-typo'
				width='100%'
				textAlign="center"
				fontWeight='500'
				fontSize='1.3rem'>
				{Props.username}
			</Typography>
		</Box>
	)
}

export default PlayerTable