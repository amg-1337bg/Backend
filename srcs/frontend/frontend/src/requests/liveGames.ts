import axios from "axios";

export async function getLiveMatchs() {
	try {
		// 👇️ const data: GetUsersResponse
		const { data, status } = await axios.get<{}>(
			process.env.REACT_APP_SERVER_IP + "/game/live_matchs",
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