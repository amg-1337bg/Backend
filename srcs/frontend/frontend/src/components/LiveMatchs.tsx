import {  List, Stack, Typography } from '@mui/material'
import reloadIcon from '../assets/reload-icon.png'
import LiveMatchBtn from './LiveMatchBtn'
import { useEffect, useState } from 'react';
import { getLiveMatchs } from '../requests/liveGames';
import { useNavigate } from 'react-router-dom';
import HeaderMatchs from './HeaderMatchs';

let initLiveMatchs = {};

const LiveMatchs = () => {
    const navigate = useNavigate();
    const [matchs, setMatchs] = useState(initLiveMatchs);
    function getlivematchs() {
        getLiveMatchs().then((value) => {
            if ((typeof value) === (typeof initLiveMatchs)) {
                const data = value as {};
                setMatchs(data);
            }
        })
            .catch((error: any) => {
                console.log("Error ;Not Authorized", error);
                navigate(error.redirectTo);
            })
    }
    useEffect(() => {
        getlivematchs();
    }, [])

    return (
        <Stack >
           <HeaderMatchs/>
            <Stack
                spacing={3}
                sx={{
                    width: '100%', marginTop: '50px', marginLeft: '6.5%'
                }}>
                <Stack
                    spacing={2}
                    direction='row'>
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '2rem',
                            lineHeight: ' 35.05px',
                            align: 'center',
                        }}>
                        Live Matchs</Typography>
                    <img alt="Reload Icon" src={reloadIcon} style={{ width: 35 }} />
                </Stack>
                <List style={{ width: "90%", overflow: 'auto', height: "90%" }} >
                    {
                        Object.keys(matchs).map((key, index) => {
                            return (
                                <li key={index} className='item-live-match'>
                                    <LiveMatchBtn info={matchs[key as keyof typeof matchs]} room_id={key} />
                                </li>
                            )
                        })
                    }
                    {!Object.keys(matchs).length &&
                        <Typography
                            sx={{
                                width: '100%',
                                whiteSpace: "nowrap",
                                color: '#ADADAD',
                                fontWeight: '400',
                                fontSize: '1.2rem',
                                paddingTop: '1.2px',
                                // paddingLeft: "8px",
                            }}>No one is Playing Pong currentely !</Typography>
                    }
                </List>
            </Stack>
        </Stack>
    )
}

export default LiveMatchs