import { Avatar, Box, Stack, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { RoomsOfUser } from '../requests/rooms';
import { RootState } from '../store';
import { changeCurrRoom } from "../store/chatUiReducer";
import DropMenuRoom from './DropMenus/DropMenuRoom';
import owner_role from '../assets/User/owner.png';
import admin_role from '../assets/User/admin.png';

const RoomButtonChat = (Props: {room:RoomsOfUser}) => {
    const currentRoom = useSelector((state: RootState) => state.chat).curr_room;
    const dispatch = useDispatch();
    const nameRoom = Props.room.room_id as string;
    const color_type = Props.room.type === "public" ? "#1E83DA"
        : Props.room.type === "protected" ? "#9ABC4D"
            : "#EF4A50";
    const user_role = Props.room.user_role === "owner" ? owner_role
        : Props.room.user_role === "admin" ? admin_role
            : "";

    let backgroundButton: string = currentRoom !== Props.room.room_id ? "#2E3256" : "#4289F3";

    return (
        <Box
            onClick={() => { dispatch(changeCurrRoom({room:nameRoom, role:Props.room.user_role as string})) }}
            sx={{
                backgroundColor: backgroundButton,
                minWidth: '300px',
                width: '300px',
                height: '55px',
                borderRadius: '12px',
                position: 'relative',
                cursor: 'pointer',
            }}>
            <Stack spacing={2} direction="row" alignItems="center" padding="6.5px 9px"
            >
                <Avatar
                    sx={{
                        height: '36px',
                        width: '36px',
                        backgroundColor: color_type,
                        border: "1px solid #FFF",
                        color: "#FFF",
                    }}>
                    {nameRoom.charAt(0)}
                </Avatar>
                <Box
                >
                    <Typography
                        sx={{
                            fontFamily: 'Lexend',
                            fontWeight: '500',
                            fontSize: '1.15rem',
                            fontStyle: 'normal',
                        }}>{nameRoom}</Typography>
                </Box>
                {user_role !== "" &&
                    <Box sx={{ margin: "auto", }}>
                        <Avatar
                            sx={{
                                height: '23px',
                                width: '23px',
                            }}
                            alt={Props.room.user_role as string} src={user_role} imgProps={{ style: { width: 'auto' } }} />
                    </Box>}
                <div style={{ marginLeft: 'auto' }}>
                    <DropMenuRoom room={Props.room}/>
                </div>
            </Stack>
        </Box >
    )
}

export default RoomButtonChat