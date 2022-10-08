import axios from "axios";
import { UserOfRoom } from "../store/roomUsersReducer";

/* ============================ Get User's Room ======================= */
export async function requestUsersRoom(room_name: string) {
	try {
		// 👇️ const data: CreateUserResponse
		const { data } = await axios.post<UserOfRoom[]>(
			process.env.REACT_APP_SERVER_IP + "/room/usersRoom",
			{ room_id: room_name },
			{
				headers: {
					Accept: "application/json",
				},
				withCredentials: true,
			}
		);

		console.log(JSON.stringify(data, null, 4));

		return data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log("error message: ", error.message);
			// 👇️ error: AxiosError<any, any>
			if (error?.response?.status === 401)
				throw (error?.response?.data);
		} else {
			console.log("unexpected error: ", error);
			return "An unexpected error occurred";
		}
	}
}

/* ============================ Get My Rooms ======================= */

export interface RoomsOfUser {
	id?: number,
	user_role?: string,
	room_id?: string,
	type?: string,
}

export async function getMyRooms() {
	try {
		// 👇️ const data: GetUsersResponse
		const { data, status } = await axios.get<RoomsOfUser[]>(
			process.env.REACT_APP_SERVER_IP + "/room/All_rooms_of_user",
			{
				headers: {
					Accept: "application/json",
					// "Access-Control-Allow-Origin": "*",
					// "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
				},
				withCredentials: true,
			}
		);
		console.log(JSON.stringify(data, null, 4));
		// 👇️ "response status is: 200"
		console.log('response status is: ', status);
		return data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log("error message: ", error.message);
			if (error?.response?.status === 401)
				throw (error?.response?.data);
		} else {
			console.log("unexpected error: ", error);
			return "An unexpected error occurred";
		}
	}
}

