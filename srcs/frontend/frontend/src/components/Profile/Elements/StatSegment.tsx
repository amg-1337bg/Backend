import { Avatar, Box, Typography } from '@mui/material'
import { Stack } from '@mui/system'

interface statSegmentProps {
	name: string,
	value: number,
}

const StatSegment = (Props: statSegmentProps) => {

	var cercle_bg: string;
	switch (Props.name.charAt(0)) {
		case 'W': cercle_bg = "#19AE66"; break;
		case 'L': cercle_bg = "#E53D32"; break;
		case 'G': cercle_bg = "#AE199F"; break;
		case 'I': cercle_bg = "#1955AE"; break;
		default: cercle_bg = "#ADADAD"; break;
	}
	
	return (
		<Stack
			direction="row"
			width="110px"
			height="50px"
			spacing={1.7}
			justifyContent="flex-start"
			alignItems="center">
			<Avatar sx={{
				color: "#FFF",
				background: cercle_bg,
				boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.2)",
				textShadow: "0px 5px 4px rgba(0, 0, 0, 0.25)",
			}}>
				{Props.name.charAt(0)}
			</Avatar>
			<Stack spacing="0">
				<Typography
					fontFamily="Lato"
					fontWeight='800'
					fontSize="20px"
				>
					{Props.value}
				</Typography>
				<Box style={{
					marginTop: "-4.5px"
				}}>
					<Typography
						fontWeight='300'
						fontSize='14px'>
						{Props.name}
					</Typography>
				</Box>
			</Stack>
		</Stack>
	)
}

export default StatSegment