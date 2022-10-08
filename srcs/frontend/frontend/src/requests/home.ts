import axios from "axios";

export type RoomData = {
	room_id: string,
	owner: string,
	count: number,
};

export type RoomInfo = {
	name: string;
	type: string;
	password: string;
};

export interface ProfileNavData {
	level: number,
	invit_count: number,
	tfa: boolean,
};

export type UserData = {
	avatar: string,
	username: string,
	login: string,
	level: number
	status: string, // offline || online || ingame
}

export type InvitationData = {
	avatar: string,
	login: string,
	username: string,
}

// ========================== Get All Users ========================= //

export async function getUsers() {

	try {
		// 👇️ const data: GetUsersResponse
		const { data, status } = await axios.get<UserData[]>(
			process.env.REACT_APP_SERVER_IP + "/users",
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

// ========================== Get All Invitations ========================= //

export async function getInvitations() {

	try {
		// 👇️ const data: GetUsersResponse
		const { data, status } = await axios.get<InvitationData[]>(
			process.env.REACT_APP_SERVER_IP + "/invitation",
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

// ========================== Get Public/ Protected Rooms ========================= //

export async function getRoomsData(kind: string) {
	const url: string = (kind === "Public rooms" ? "/room/public_room" : "/room/protected_room");
	try {
		// 👇️ const data: GetUsersResponse
		const { data, status } = await axios.get<RoomData[]>(
			process.env.REACT_APP_SERVER_IP + url,
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

// ========================== Post Join Protected Room ========================= //
export async function joinProtectedRoomPost(room_id: string, password: string) {

	try {
		// 👇️ const data: GetUsersResponse
		const { data, status } = await axios.post<{"status" : boolean, "msg" :string}>(
			process.env.REACT_APP_SERVER_IP + "/room/checkprotected",
			{ room_id: room_id, password: password },
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
			throw (error);
		} else {
			console.log("unexpected error: ", error);
			return "An unexpected error occurred";
		}
	}
}
// ========================== Post new Room ========================= //

export async function JoinRoomPost(room_id: string) {
	try {
		// 👇️ const data: CreateUserResponse
		const { data } = await axios.post<{ room_id: string }>(
			process.env.REACT_APP_SERVER_IP + "/room/clickroom",
			{ room_id: room_id },
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
			// return error.message;
		} else {
			console.log("unexpected error: ", error);
			return "An unexpected error occurred";
		}
	}
}

// ========================== Post new Room ========================= //

export async function createRoom(room_info: RoomInfo) {
	try {
		// 👇️ const data: CreateUserResponse
		const { data } = await axios.post<RoomInfo>(
			process.env.REACT_APP_SERVER_IP + "/room/postroom",
			room_info,
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
// ========================== Get Profile Navbar Info ========================= //

export async function getProfileNavbar() {

	try {
		// 👇️ const data: GetUsersResponse
		const { data, status } = await axios.get<ProfileNavData>(
			process.env.REACT_APP_SERVER_IP + "/profile/navbar",
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

// ========================== Get QR CODE 2fa ========================= //
export async function getMQrCodeUrl() {
	try {
		const { data, status } = await axios.get<{ qrcodeUrl: string }>(
			process.env.REACT_APP_SERVER_IP + "/twofactorauth/generate",
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


// ========================== Send Code 2fa to activate ========================= //
export async function sendCode2FAEnable(code: string) {

	try {
		// 👇️ const data: GetUsersResponse
		const { data, status } = await axios.post<string>(
			process.env.REACT_APP_SERVER_IP + "/twofactorauth/turnon",
			{ tfacode: code },
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
			throw (error);
		} else {
			console.log("unexpected error: ", error);
			return "An unexpected error occurred";
		}
	}
}
// ========================== Send Code 2fa to disable ========================= //
export async function sendCode2FADisable(code: string) {

	try {
		// 👇️ const data: GetUsersResponse
		const { data, status } = await axios.post<string>(
			process.env.REACT_APP_SERVER_IP + "/twofactorauth/turnoff",
			{ tfacode: code },
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
			throw (error);
		} else {
			console.log("unexpected error: ", error);
			return "An unexpected error occurred";
		}
	}
}

// ========================== Send Code 2fa to authentify ========================= //
export async function sendCode2FAConnect(code: string) {
	try {
		// 👇️ const data: GetUsersResponse
		const { data, status } = await axios.post<string>(
			process.env.REACT_APP_SERVER_IP + "/twofactorauth/authenticate",
			{ tfacode: code },
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
			throw (error);
		} else {
			console.log("unexpected error: ", error);
			return "An unexpected error occurred";
		}
	}
}

// ========================== Post Block ========================= //

export async function BlockUserPost(user_to_block: string) {
	try {
		// 👇️ const data: CreateUserResponse
		const { data } = await axios.post<{}>(
			process.env.REACT_APP_SERVER_IP + "/room/block_user",
			{ user_to_block: user_to_block },
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

// ========================== Post Chat ========================= //

export async function ChatUserPost(user: string) {
	try {
		// 👇️ const data: CreateUserResponse
		const { data } = await axios.post<RoomInfo>(
			process.env.REACT_APP_SERVER_IP + "/room/chat_with_user",
			{ to: user },
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
