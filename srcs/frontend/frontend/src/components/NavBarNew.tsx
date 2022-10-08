
import { Avatar, Badge,  Divider, IconButton, Stack, TextField, Typography } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EditIcon from '@mui/icons-material/Edit';

import messengerIcon from '../assets/messenger.png'
import roomIcon from '../assets/chat-room.png'
import dashboardIcon from '../assets/dashboard-icon.png'
import matchmakingIcon from '../assets/matchmaking-icon.png'
import streamingIcon from '../assets/streaming.png'
import homeIcon from '../assets/home.png'
import LogoutIcon from '../assets/log-out.png';
import collapseIcon from '../assets/collapse-nav.png';

import { Box } from '@mui/system';
import { Button2FA } from './Button2FA';
import { setCollapse } from '../store/collapseNavReducer';
import { NavbarCollapsed } from './NavbarCollapsed';
import { InvitationsMenu } from './InvitationsMenu';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TwoFADialog from './2FA/TwoFADialog';
import { TwoFAInput } from './2FA/TwoFAInput';
import { getProfileNavbar, ProfileNavData } from '../requests/home';
import axios from 'axios';
import { clearUser} from '../store/userReducer';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';

export let getInterface = (currentRoute: string): string => {
    switch (currentRoute) {
        case '/home': return "Home"
        case '/dashboard': return "Dashboard";
        case '/chatRoom': return "Chat Room";
        case '/instantMessaging': return "Instant Messaging";
        case '/matchmaking': return "Matchmaking";
        case '/liveMatchs': return "Live Games";
        case '/logout': return "Log Out";
        default: return "Home";
    }
};
const initState: ProfileNavData = {} as ProfileNavData;

export const NavBarNew = () => {
    const userState = useSelector((state: RootState) => state.user);
    const is_collapsedNav = useSelector((state: RootState) => state.collapseNav).is_collapsed;
    const [info_user, setInfoUser] = useState(initState);
    let avatar: File;
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies();

    const handleUploadAvatar = (avatar_uploaded: File) => {
        axios.post(process.env.REACT_APP_SERVER_IP + '/profile/avatar', { avatar: avatar_uploaded }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((data) => {
            setCookie("avatar", data.data.avatar);
            navigate(0);
            toast.success("Your avatar was updated");
        }).catch(() => {
            toast.error("Error");
        })

    }

    const handleChangeUserName = (event: any) => {
        if (event.key === 'Enter') {
            if (username && username.length < 10 && username.length > 6) {
                axios.post(process.env.REACT_APP_SERVER_IP + '/profile/change_username', { username: username }, {
                    withCredentials: true,
                }).then((value) => {
                    setCookie("username", value.data.username);
                    navigate(0);
                    toast.success("Your username was updated");
                }).catch(() => {
                    toast.error("Error");
                })
            }
            else
                toast.error("your username must have between 6 and 10 characters!");
        }
    }

    useEffect(() => {
        getProfileNavbar().then((value) => {
            if (typeof (value) === typeof (initState)) {
                const data = value as ProfileNavData;
                setInfoUser(data);
            }
        }).catch((error: any) => {
            console.log("Error ;Not Authorized", error);
            navigate(error.redirectTo);
        })
    }, [])

    return (
        <Box height="100vh">
            {is_collapsedNav && <NavbarCollapsed />}
            {!is_collapsedNav &&
                <Stack height="100%" width="240px" justifyContent="space-between"
                    sx={{ backgroundColor: "#303465" }}>
                    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1.8}
                        sx={{ padding: "3.3%", paddingTop: "5%" }}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <IconButton component="label" sx={{ background: "#0564FC", width: "25px", height: "25px" }}>
                                    <EditIcon sx={{ width: "18px" }} />
                                    <input hidden accept="image/*" type="file" id='avatar' onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        if (event.target.files)
                                            handleUploadAvatar(event.target.files[0]);
                                    }} />
                                </IconButton>
                            }>
                            <Avatar
                                variant="circular"
                                sx={{
                                    height: '60px',
                                    width: '60px',
                                    backgroundColor: "#FFF",
                                    border: "3px solid #535995",
                                }}
                                alt="Lion" src={userState.avatar} imgProps={{ style: { width: 'auto' } }} />
                        </Badge>
                        <Stack justifyContent="space-between" alignItems="flex-start" spacing={0.5} width="100%">
                            <Typography
                                className='truncate-typo'
                                width='100%'
                                fontWeight="700"
                                fontSize="1.4rem"
                                fontFamily="Lato"
                                lineHeight="130%">
                                {userState.username}
                            </Typography>
                            <Stack direction="row" spacing={0.3} width="100%">
                                <SportsEsportsIcon sx={{ width: "18px", paddingTop: "3%" }} />
                                <Typography
                                    sx={{
                                        width: '100%',
                                        whiteSpace: "nowrap",
                                        color: '#ADADAD',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        paddingTop: '1.2px',
                                    }}>
                                    Level {info_user.level}</Typography>
                                <Box width="100%" paddingLeft="2%"><InvitationsMenu count_invit={info_user.invit_count} /></Box>
                            </Stack>
                        </Stack>
                    </Stack>
                    <TextField onKeyDown={handleChangeUserName} onChange={e => setUsername(e.target.value)}
                        style={{ maxWidth: "93%", margin: "0 auto" }}
                        name='new_user_name' label='Change Username' fullWidth />
                    <Stack
                        divider={<Divider orientation="horizontal" flexItem />}>
                        <CustomButton route='/home' _icon={homeIcon} />
                        <CustomButton route='/dashboard' _icon={dashboardIcon} />
                        <CustomButton route='/chatRoom' _icon={roomIcon} />
                        <CustomButton route='/instantMessaging' _icon={messengerIcon} />
                        <CustomButton route='/matchmaking' _icon={matchmakingIcon} />
                        <CustomButton route='/liveMatchs' _icon={streamingIcon} />
                    </Stack>
                    <Box>
                        <Box sx={{ marginBottom: "20%" }}><Button2FA verified={info_user.tfa} /></Box>
                        <Collapse />
                        <Divider orientation="horizontal" flexItem />
                        <CustomButton route='/logout' _icon={LogoutIcon} />
                    </Box>
                </Stack>}

            <TwoFADialog enable={!info_user.tfa}>
                <TwoFAInput enable={!info_user.tfa} />
            </TwoFADialog>

        </Box>
        // </Slide>
    )
}

export interface ButtonProps {
    route: string,
    _icon: string,
}

const CustomButton = ({ route, _icon }: ButtonProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies();

    const handleLocation = () => {
        if (route === '/logout') {
            removeCookie("login"); removeCookie("username"); removeCookie("avatar"); removeCookie("Authorization");
            dispatch(clearUser());
            navigate("/")
        }
        else if (route === '/matchmaking') {
            navigate(route);
            navigate(0)
        }
        else
            navigate(route);
    }
    let backgroundButton = location.pathname === route ? "#543EC0" : "#303465";
    return (
        <div style={{ backgroundColor: backgroundButton }}
            onClick={() => {
                // dispatch(setCurrentInterface(_name)); handleNavigation(_name)
                handleLocation();
            }}>
            <Stack alignItems="center" justifyContent="flex-start" spacing={2} direction="row" sx={{
                paddingLeft: "10px", cursor: "pointer", height: "44px", ":hover": { backgroundColor: "#3F5274" }
            }}>
                <Avatar src={_icon} style={{ padding: "3.5%" }} />
                <Typography sx={{
                    fontWeight: '400',
                    fontSize: '16px',
                    lineHeight: '109.52%',
                }}>
                    {getInterface(route)}
                </Typography>
            </Stack>
        </div>
    )
}

const Collapse = () => {
    const dispatch = useDispatch();
    return (
        <Stack alignItems="center" justifyContent="flex-start" spacing={2} direction="row"
            sx={{
                paddingLeft: "6px", cursor: "pointer", height: "44px", backgroundColor: "#3F5274",
                ":hover": { backgroundColor: "#3F4478" }
            }}
            onClick={() => { dispatch(setCollapse(true)) }}>
            <Avatar src={collapseIcon} style={{ padding: "2%" }} />
            <Typography sx={{
                fontWeight: '400',
                fontSize: '16px',
                lineHeight: '109.52%',
            }}>
                Collapse
            </Typography>
        </Stack>
    )
}