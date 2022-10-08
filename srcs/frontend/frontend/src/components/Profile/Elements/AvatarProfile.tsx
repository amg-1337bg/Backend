import { Box, Avatar } from '@mui/material'

const AvatarProfile = (props:{avatar: string}) => {
	return (
		<Box>
			<Avatar
				variant="square"
				sx={{
					height: '110px',
					width: '110px',
					backgroundColor: "#FFF",
					border: "6px solid #535995",
					borderRadius: "30px",
				}}
			alt="Lion" src={props.avatar} imgProps={{ style: { width: 'auto' } }} />
		</Box>
	)
}

export default AvatarProfile