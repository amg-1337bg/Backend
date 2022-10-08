import { Stack } from "@mui/material"
import { useSelector } from "react-redux"
import { RootState } from "../store";

import Rooms from "./Rooms"
import { UsersRoom } from "./UsersRoom"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeCurrRoom } from "../store/chatUiReducer";
import { initSocketClient } from "../store/socketReducer";
import { ChatUIRoomMsg } from "./ChatUIRoomMsg";

const GlobalRooms = () => {
	const logged_user = useSelector((state: RootState) => state.user).login;
	// const currentPage = useSelector((state: RootState) => state.interfaces).current;
	const socket = useSelector((state: RootState) => state.socketclient).socket;
	const dispatch = useDispatch();


	useEffect(() => {
		// if (currentPage === InterfaceEnum.ChatRoom )
			dispatch(initSocketClient({ host: process.env.REACT_APP_SERVER_IP as string, user: logged_user }));			
			console.log("Global Rooms");
		return (() => {
			console.log("Socket Disconnected Global Rooms");
			socket.disconnect();
			dispatch(changeCurrRoom({ room: '', role: '' }))

		})

	}, []);

	return (
		<Stack direction="row" alignItems="center" justifyContent="flex-end" height="100%" width="100%">
			<Rooms />
			<UsersRoom />
			<ChatUIRoomMsg />
		</Stack>
	)
}

export default GlobalRooms