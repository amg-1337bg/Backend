import { Stack } from "@mui/material"
import Friends from "./Friends"
import { useSelector } from "react-redux"
import { RootState } from "../store";

import { ChatUiInstantMsg } from "./ChatUiInstantMsg"
import { UsersMessaging } from "./UsersMessaging"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeCurrConversation, changeCurrRoom } from "../store/chatUiReducer";
import { initSocketClient } from "../store/socketReducer";


const GlobalDM = () => {
	const logged_user = useSelector((state: RootState) => state.user).login;
	const socket = useSelector((state: RootState) => state.socketclient).socket;
	const dispatch = useDispatch();


	useEffect(() => {

		// if (currentPage === InterfaceEnum.Friends
		// 	|| currentPage === InterfaceEnum.InstantMessaging)
			dispatch(initSocketClient({ host: process.env.REACT_APP_SERVER_IP as string, user: logged_user }));			
			console.log("Global DM")

		return (() => {
			console.log("Socket Disconnected Global DM");
			socket.disconnect();
			dispatch(changeCurrConversation({ user: '', avatar: '' }));

		})

	}, []);

	return (
		<Stack direction="row" alignItems="center" justifyContent="flex-end" height="100%" width="100%">
			<Friends />
			<UsersMessaging />
			<ChatUiInstantMsg />
		</Stack>
	)
}

export default GlobalDM