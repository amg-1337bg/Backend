import axios from "axios";

export interface Friend {
	id: number,
	login: string,
	username: string,
	avatar: string,
	status:string,
}

export interface UserMessaging {
	id: number,
	login: string,
	username: string,
	avatar: string,
	type: string, //friend
}

export async function getFriends() {
	try {
		// 👇️ const data: GetUsersResponse
		const { data, status } = await axios.get<Friend[]>(
			process.env.REACT_APP_SERVER_IP + "/room/get_friends",
			{
				headers: {
					Accept: "application/json",
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

export async function geMessagingUsers() {
	try {
		// 👇️ const data: GetUsersResponse
		const { data, status } = await axios.get<UserMessaging[]>(
			process.env.REACT_APP_SERVER_IP + "/room/instant_messaging",
			{
				headers: {
					Accept: "application/json",
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