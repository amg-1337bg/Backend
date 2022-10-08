import { Box, Typography } from '@mui/material'
import { Stack } from '@mui/system'

interface statSegmentProps {
	name: string,
	value: number,
}

const StatSegment = (Props: statSegmentProps) => {
	return (
		<Stack alignItems="center">
			<Typography
				fontFamily="Lato"
				fontWeight='800'
				fontSize='0.8rem'
				color='#A9AEE3'>
				{Props.name}
			</Typography>
			<Typography
				fontFamily="Lato"
				fontWeight='800'
				fontSize='1.2rem'>
				{Props.value}
			</Typography>
		</Stack>
	)
}

const StatElementBar = (Props:{total_matches:number, friends:number, ratio:number}) => {
	return (
		<Box sx={{
			width: "220px",
			height: "63px",
			background: "#4E548D",
			borderRadius: "17px",
			padding: '10px 19px'
		}}>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center">
				<StatSegment name="Matches" value={Props.total_matches} />
				<StatSegment name="Friends" value={Props.friends} />
				<StatSegment name="Ratio %" value={Props.ratio} />
			</Stack>
		</Box>
	)
}

export default StatElementBar