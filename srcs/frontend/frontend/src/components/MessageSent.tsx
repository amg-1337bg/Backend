import { Avatar, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'

interface MessageProps {
	msg: string,
	avatar:string,
}

const MessageSent = ({ msg, avatar }: MessageProps) => {
	return (
		<div style={{height:"100%"}}>
			<Stack
				spacing={0}
				sx={{
					width: '335px',
				}}>
				<Box
					sx={{
						backgroundColor: '#3475D7',
						width: '300px',
						padding: '0.7em',
						borderRadius: '14px',
						display:'inline-block',
						height:"auto",
						overflowWrap: "break-word",
					}}>
					<Typography
						sx={{
							fontFamily: 'Lexend',
							fontStyle: 'normal',
							fontWeight: '500',
							fontSize: '15px',
							lineHeight: '140%',
							// whiteSpace: 'nowrap',
						}}>
						{msg}
					</Typography>
				</Box>
				<div style={{ marginLeft: '86%' }}>
					<Avatar
						sx={{
							height: '47px',
							width: '47px',
							backgroundColor: "#FFF",
						}}
						alt="" src={avatar} imgProps={{ style: { width: 'auto' } }} />
				</div>

			</Stack>
		</div>
	)
}

export default MessageSent