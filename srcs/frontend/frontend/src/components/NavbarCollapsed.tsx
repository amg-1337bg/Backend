import { Avatar, Divider, Slide, Stack } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store";

import messengerIcon from '../assets/messenger.png'
import roomIcon from '../assets/chat-room.png'
import dashboardIcon from '../assets/dashboard-icon.png'
import matchmakingIcon from '../assets/matchmaking-icon.png'
import streamingIcon from '../assets/streaming.png'
import homeIcon from '../assets/home.png'
import LogoutIcon from '../assets/log-out.png';
import collapseIcon from '../assets/right-arrow.png';

import { Box } from '@mui/system';
import { setCollapse } from '../store/collapseNavReducer';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonProps } from './NavBarNew';
import { clearUser } from '../store/userReducer';
import { useCookies } from 'react-cookie';

export const NavbarCollapsed = () => {
    const userState = useSelector((state: RootState) => state.user);
    const containerRef = React.useRef(null);

    return (
        <Slide direction="right" in={true} container={containerRef.current}>

            <Stack justifyContent="space-between"
                sx={{ height: "100vh", width: "70px", backgroundColor: "#303465" }}>
                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1.8}
                    padding="12%" paddingTop="17%" >
                    <Avatar
                        variant="circular"
                        sx={{
                            height: '52px',
                            width: '52px',
                            backgroundColor: "#FFF",
                            border: "3px solid #535995",
                        }}
                        alt="Lion" src={userState.avatar} imgProps={{ style: { width: 'auto' } }} />
                </Stack>
                <Stack width="100%"
                    divider={<Divider orientation="horizontal" flexItem />}>
                    <CustomButton route='/home' _icon={homeIcon} />
                    <CustomButton route='/dashboard' _icon={dashboardIcon} />
                    <CustomButton route='/chatRoom' _icon={roomIcon} />
                    <CustomButton route='/instantMessaging' _icon={messengerIcon} />
                    {/* <CustomButton _name={InterfaceEnum.Friends} _icon={friendsIcon} /> */}
                    <CustomButton route='/matchmaking' _icon={matchmakingIcon} />
                    <CustomButton route='/liveMatchs' _icon={streamingIcon} />
                </Stack>
                <Box>
                    <Box sx={{ marginBottom: "20%", height: "189.5px" }}>
                        {/* <Button2FA verified={true} /> */}
                    </Box>
                    <Collapse />
                    <Divider orientation="horizontal" flexItem />
                    <CustomButton route='/logout' _icon={LogoutIcon} />
                </Box>
            </Stack>
        </Slide>
    )
}

const CustomButton = ({ route, _icon }: ButtonProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies();
    
    let backgroundButton = location.pathname === route ? "#543EC0" : "#303465";
    
    const handleLocation =() => {
        if (route === '/logout')
        {
            removeCookie("login"); removeCookie("username"); removeCookie("avatar"); removeCookie("Authorization");
			dispatch(clearUser());
			navigate("/")
        }
        else if (route === '/matchmaking'){
            navigate(route);
            navigate(0)
        }
        else
        navigate(route);
    }
    return (
        <div style={{ backgroundColor: backgroundButton }}
            onClick={() => {
                handleLocation()
            }}>
            <Stack alignItems="center" justifyContent="flex-start" spacing={2} direction="row" sx={{
                paddingLeft: "15px", cursor: "pointer", height: "44px", ":hover": { backgroundColor: "#3F5274" }
            }}>
                <Avatar src={_icon} style={{ padding: "13%" }} />
            </Stack>
        </div>
    )
}

const Collapse = () => {
    const dispatch = useDispatch();

    return (
        <Stack alignItems="center" justifyContent="flex-start" spacing={2} direction="row" sx={{
            paddingLeft: "13px", cursor: "pointer", height: "44px", backgroundColor: "#3F5274",
            ":hover": { backgroundColor: "#3F4478" }
        }}
            onClick={() => { dispatch(setCollapse(false)) }}
        >
            <Avatar src={collapseIcon} style={{ padding: "5.2%" }} />

        </Stack>
    )
}