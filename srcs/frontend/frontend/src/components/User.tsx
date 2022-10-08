import { Avatar, Badge, Box, Stack, Typography } from '@mui/material'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { UserData } from '../requests/home';
import { useEffect, useState } from 'react';
import DropMenuUserHome from './DropMenus/DropMenuUserHome';

const online_bg:string = "#3FFC10";
const offline_bg:string = "red";
const inGame_bg:string = "yellow";

const User = (user_data: UserData) => {
  const [bg_status, setBgStatus] = useState(online_bg);

  const handleColorStatus = () => {

    setBgStatus( (user_data.status === "online") ? online_bg
      : (user_data.status === "offline") ? offline_bg
      : (user_data.status === "inGame") ? inGame_bg
      : online_bg)
  }

  useEffect(()=>{
    handleColorStatus();
  },[])

  return (
    <Box
      sx={{
        backgroundColor: "##130742",
        width: '320px',
        height: '63px',
        paddingTop: '5px',
        paddingLeft: '13px'
      }}>
      <Stack spacing={3} direction="row"  justifyContent="space-between" >
        <Stack spacing={2} direction="row">
        <div>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <div style={{ backgroundColor: bg_status }} className="dot_status" />
            }
          >
            <Avatar
              sx={{
                height: '50px',
                width: '50px',
                backgroundColor: "#FFF",
                // padding: "3px",
              }}
              alt={user_data.login} src={user_data.avatar} imgProps={{ style: { width: 'auto' } }} />
          </Badge>
        </div>
        <Stack>
          <Typography
            sx={{
              fontWeight: '600',
              fontSize: '1.4rem',
            }}>{user_data.username}</Typography>
          <Stack direction="row" spacing={0.5}>
            <SportsEsportsIcon sx={{ width: "19px" }} />
            <Typography
              sx={{
                color: '#ADADAD',
                fontWeight: '600',
                fontSize: '0.9rem',
                paddingTop: '1.3px',
              }}>
              Level
              {" " + user_data.level}
              </Typography>
          </Stack>
        </Stack>
        </Stack>
        <DropMenuUserHome avatar={user_data.avatar} username={user_data.username} login={user_data.login} level={0} status={""} />
      </Stack>
    </Box>
  )
}

export default User