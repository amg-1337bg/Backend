import { Box,  List, Stack, Typography } from '@mui/material'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { requestUsersRoom } from '../requests/rooms';
import { RootState } from '../store';
import { clearUsersRoom, initUsesrRoom, UserOfRoom } from '../store/roomUsersReducer';
import { UserButton } from './UserButton';


export const UsersRoom = () => {
    const dispatch = useDispatch();
    const users_room = useSelector((state: RootState) => state.room_users);
    const currentRoom = useSelector((state: RootState) => state.chat).curr_room;
    const role_user = useSelector((state: RootState) => state.chat).curr_role;
    const socket = useSelector((state: RootState) => state.socketclient).socket;
    const navigate = useNavigate();

    function getUsersRoom() {
        requestUsersRoom(currentRoom).then((value) => {
            const data = value as Array<UserOfRoom>;
            if (typeof (data) === (typeof (users_room)))
                dispatch(initUsesrRoom(data));
        }).catch((error: any) => {
            console.log("Error ;Not Authorized", error);
            navigate(error.redirectTo);
        })
    }


    const receiveUpdate = () => {
        socket.on('UsersOfRoom', (data: { status: boolean, user: string }) => {
            getUsersRoom();
        })
    }

    useEffect(() => {
        if (socket)
            receiveUpdate();
        return (() => {
            socket.off("UsersOfRoom");
        })
    },)


    useEffect(() => {
        // if (users_room.length === 0 && currentRoom !== '')
        console.log("userst room : ", currentRoom);
        getUsersRoom();
        if (currentRoom === '')
            dispatch(clearUsersRoom());
        return () => {
            dispatch(clearUsersRoom());
        }
    }, [currentRoom])

    return (

        <Box
            className='users_room'
            sx={{
                backgroundColor: "#262948",
                height: '100vh',
                padding: '30px',
                borderLeft: "1px solid #FFFFFF",
                paddingTop: "7.2em",
                width: "31%",
            }}>
            <Stack height="100%" width="100%">
                <Stack spacing={1} direction="row" marginBottom="3%">
                    {/* <IconButton >
                        <img src={usersRoomIcon} width="30px" alt='roomIcon' />
                    </IconButton> */}
                    <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                        <Stack direction="row" spacing={1}>

                            <Typography sx={{
                                fontWeight: '600',
                                fontSize: '22px',
                                lineHeight: '109.52%',
                            }}>
                                Room Users
                            </Typography>
                            <div className='dot-nb center-button'>
                                {users_room.length}
                            </div>
                        </Stack>
                    </div>
                </Stack>

                <List style={{ overflow: 'auto', height: "100%" }} >
                    {users_room && users_room.map((item) => (
                        <li key={item.id} className='item-friend'>
                            <UserButton user={item} socket={socket} role_user={role_user} />
                        </li>
                    ))}
                    {!users_room.length &&
                        <Typography
                            sx={{
                                width: '100%',
                                // whiteSpace: "nowrap",
                                color: '#ADADAD',
                                fontWeight: '400',
                                fontSize: '1rem',
                                paddingTop: '1.2px',
                                paddingLeft: "8px",
                            }}>Whoa! it's empty in here.</Typography>
                    }
                </List>
            </Stack>
        </Box>
    )
}