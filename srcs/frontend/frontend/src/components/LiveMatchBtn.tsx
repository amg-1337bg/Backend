import { Avatar, Box, ListItem, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"


interface AvatarProps {
    name: string,
    url: string,
}

export const AvatarPlayer = (props: AvatarProps) => {
    return (
        <Stack spacing={1} alignItems="center" width='4rem'>
            <Avatar
                sx={{
                    height: '3rem',
                    width: '3rem',
                    backgroundColor: "#FFF",
                }}
                alt="Lion" src={props.url} imgProps={{ style: { width: 'auto' } }} />
            <Typography sx={{
                fontStyle: 'normal',
                fontWeight: '600',
                fontSize: '17px',
                lineHeight: '109.52%',
            }}>
                {props.name}
            </Typography>
        </Stack>
    )
}

const LiveMatchBtn = (props: { info: any, room_id: string }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleNavigate = () => {
		navigate({
			pathname: '/matchmaking',
			search: '?mode=3&room=' + props.room_id,
		});
	}

    return (
        <Box
            // onClick={() => { dispatch(setModeGame({ mode: ModeEnum.mode3, room: props.room_id }));navigate('/matchmaking');  }}
            onClick={() => { handleNavigate() }}
            sx={{
                width: '310px',
                height: '170px',
                background: 'linear-gradient( 110.14deg, #355B88 27.7%, #341760 83.08% )',
                border: '2px solid #FFFFFF',
                borderRadius: '27px',
                boxSizing: 'border-box',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'primary.main',
                    opacity: [0.9, 0.8, 0.7],
                },
                paddingTop: '0.5%',
            }}>
            <Stack
                spacing={1.5}
                justifyContent="space-between"
                alignItems="center">
                <ListItem sx={{ width: '38%' }}>
                    <Box className='red_dot' marginRight='10%' />
                    <Typography sx={{
                        fontWeight: '700',
                        fontSize: '17px',
                        lineHeight: '109.52%',
                    }}>
                        LIVE
                    </Typography>
                </ListItem>
                <Stack spacing={1} direction="row" justifyContent="space-between">
                    <AvatarPlayer name={props.info.P1.username!} url={props.info.P1.avatar!} />
                    <div style={{ marginTop: '1%' }}>
                        <Typography sx={{
                            fontWeight: '800',
                            fontSize: '2.15rem',
                        }}>
                            {props.info.P1.score} - {props.info.P2.score}
                        </Typography>
                    </div>
                    <AvatarPlayer name={props.info.P2.username!} url={props.info.P2.avatar!} />
                </Stack>
                <div style={{ marginTop: '2.5%' }}>
                    <Typography sx={{
                        fontWeight: '400',
                        fontSize: '0.8rem',
                        color: '#BBFCE4',
                    }}>
                        - {props.info.mode} -
                    </Typography>
                </div>
            </Stack>
        </Box>
    )
}

export default LiveMatchBtn