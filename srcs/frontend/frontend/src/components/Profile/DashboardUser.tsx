import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import {  useSearchParams } from 'react-router-dom'
import { Achievements } from './Achievements'
import { MatchHistory } from './MatchHistory'
import UserStats from './UserStats'


const DashboardUser = () => {
    const [searchParams] = useSearchParams();

    const user:string = searchParams.get('user') as string;

    
    return (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={4}
            sx={{ width: "100%", margin: "3%" }}>
            {/* ****************** User Stats **************** */}
            <UserStats other_user={user} />
            <Stack alignItems="center" spacing={5}
                sx={{ width: "850px", height: "800px", borderRadius: "30px" }}>
                {/* **************** User Achievements *************** */}
                <Achievements other_user={user}/>
                {/* **************** Match History *************** */}
                <Stack alignItems="flex-start" spacing={4}
                    sx={{ width: "100%", height: "95%", borderRadius: "30px" }}>
                    <Typography sx={{
                        fontWeight: '700',
                        fontSize: '32px',
                        lineHeight: '109.52%',
                    }}>Match history</Typography>
                    <MatchHistory other_user={user} />
                </Stack>
            </Stack>
        </Stack>
    )
}

export default DashboardUser
