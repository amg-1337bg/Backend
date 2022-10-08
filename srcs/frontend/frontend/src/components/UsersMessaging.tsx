import { Box, IconButton, List, Stack, Typography } from '@mui/material'
import usersRoomIcon from '../assets/usersRoom.png'
import { UserButtonChat } from './UserButtonChat';
import {  useEffect, useState } from "react";
import { RootState } from '../store';
import { geMessagingUsers, UserMessaging } from '../requests/directMessage';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeCurrConversation } from '../store/chatUiReducer';
import { handleToastMsg } from './InfoMessages/Toast';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';

let initUsers: UserMessaging[] = [] as UserMessaging[];
initUsers.length = 0;
export const UsersMessaging = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState(initUsers);
    const logged_user = useSelector((state: RootState) => state.user).login;
    const socket = useSelector((state: RootState) => state.socketclient).socket;
    const currentConv = useSelector((state: RootState) => state.chat).curr_converation;
    const currentConvAvatar = useSelector((state: RootState) => state.chat).curr_conv_avatar;
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const joinDmRoom = () => {
        if (socket && currentConv !== '')
            socket.emit('join_dm_room', { to: currentConv });
    }

    const handleChat = () => {
        const user: string = searchParams.get('user') as string;
        const avatar: string = searchParams.get('avatar') as string;
        if (user && user !== '' && avatar && avatar !== '') {
            console.log("user: ", user, " | avatar: ", avatar);
            dispatch(changeCurrConversation({ user: user, avatar: avatar }));
            searchParams.delete('user');
            searchParams.delete('avatar');
            setSearchParams(searchParams);
        }
    }

    function getUsers() {
        geMessagingUsers().then((value) => {
            if ((typeof value) === (typeof initUsers)) {
                const data = value as UserMessaging[];
                // if (users.length === 0 && data.length > 0 && currentConv === '')
                if (currentConv === '')
                    dispatch(changeCurrConversation({ user: '', avatar: '' }));
                handleChat();
                setUsers(data);
            }
        })
            .catch((error: any) => {
                console.log("Error ;Not Authorized", error);
                navigate(error.redirectTo);
            })
    }

    const receiveUpdate = () => {
        console.log("recieveUpdate ??????");
        socket.on('instant_messaging', (data: { status: boolean, action: string, msg: string, from: string, to: string }) => {
            if (data.action === "join") {
                if (data.from === logged_user || data.to === logged_user)
                    getUsers();
                if (data.from === logged_user) {
                    handleToastMsg(data.status, data.msg);
                    dispatch(changeCurrConversation({ user: currentConv, avatar: currentConvAvatar }));
                }
                else if (data.to === logged_user)
                    toast.info(data.from + " waving you 👋");
            }
            else if (data.action === "block") {
                if (data.from === logged_user || data.to === logged_user)
                    getUsers();
                if (data.from === logged_user) {
                    dispatch(changeCurrConversation({ user: '', avatar: '' }));
                    handleToastMsg(data.status, data.msg);
                }
                if (data.to === logged_user && data.from === currentConv)
                    dispatch(changeCurrConversation({ user: '', avatar: '' }));
                else if (data.to === logged_user && data.from !== currentConv && currentConv !== '') {
                    console.log("heeeereeee");
                    dispatch(changeCurrConversation({ user: currentConv, avatar: currentConvAvatar }));
                }
            }
        })
    }


    console.log("User Messaging");

    useEffect(() => {
        if (socket)
            receiveUpdate();
        return (() => {
            socket.off("instant_messaging");
        })
    },)

    useEffect(() => {
        joinDmRoom();
        getUsers();

        return () => {
            // setUsers(initUsers);
            // setRecieve(false);
            console.log("clear users");
        }
    }, [currentConv])

    return (
        <Box
            className='dm_messaging'
            sx={{
                backgroundColor: "#262948",
                height: '100vh',
                padding: '30px',
                borderLeft: "1px solid #FFFFFF",
                width:"31%",

            }}>
            <Stack height="100%">
                <Stack spacing={1} direction="row">
                    <IconButton>
                        <img src={usersRoomIcon} width="36px" alt='roomIcon' />
                    </IconButton>
                    <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                        <Typography sx={{
                            fontWeight: '700',
                            fontSize: '28px',
                            lineHeight: '109.52%',
                            whiteSpace: "nowrap",

                        }}>
                            Instant Messaging
                        </Typography>
                    </div>
                </Stack>
                <Stack spacing={3} direction="row" margin="40px 35px 20px 9px">
                    <Typography sx={{
                        fontWeight: '600',
                        fontSize: '20px',
                        lineHeight: '109.52%',

                    }}>
                        Messages
                    </Typography>
                    <div className='dot-nb center-button'>
                        {users.length}
                    </div>
                    <div style={{
                        marginLeft: "auto",
                    }}>
                    </div>
                </Stack>
                {!users.length &&
						<Typography
							sx={{
								width: '100%',
								color: '#ADADAD',
								fontWeight: '400',
								fontSize: '1rem',
								paddingTop: '1.2px',
								paddingLeft: "8px",
							}}>Start a conversation with a friend :)</Typography>
					}
                <List style={{ overflowY: 'auto', overflowX:"hidden", height: "100%" }} >
                    {users && users.map((item) => (
                        <li key={item.id} className='item-friend'>
                            <UserButtonChat user={item} />
                        </li>
                    ))}
                </List>
            
            </Stack>
            {/* {alertMsg.is_alert && <AlertMsg is_alert={alertMsg.is_alert} status={alertMsg.status} msg={alertMsg.msg} />} */}
        </Box>
    )
}