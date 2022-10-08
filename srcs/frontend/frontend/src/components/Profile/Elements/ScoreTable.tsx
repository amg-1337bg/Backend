import { Stack, Typography } from '@mui/material'

interface ScoreProps {
	score_1: number,
	score_2: number,
}

const ScoreTable = (Props: ScoreProps) => {
	let color_bg: string;
	let msg: string;

	if (Props.score_1 === Props.score_2) { color_bg = "yellow"; msg = "It is a draw" }
	else if (Props.score_1 < Props.score_2) { color_bg = "#11EF92"; msg = "You are winning" }
	else { color_bg = "#FD506F"; msg = "You are loosing" }
	return (
		<Stack justifyContent="center" alignItems="center" spacing={0} width='110px'
			height='60px' marginTop="-7px" margin='auto'
		>
			<Typography
				color={color_bg}
				fontWeight='500'
				fontSize='26px'>
				{Props.score_1}{" - "}{Props.score_2}
			</Typography>
			<Typography
				sx={{
					color: '#E6E7F2',
					fontWeight: '500',
					fontSize: '11px',
					marginTop: '-3px'
				}}>
				{msg}
			</Typography>
		</Stack>
	)
}

export default ScoreTable