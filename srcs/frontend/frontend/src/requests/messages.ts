import axios from "axios";
import { MessageState } from "../store/chatUiReducer";

export type RoomInfo = {
  name: string;
  type: string;
  password: string;
  owner: string;
};


export async function requestMessages(name_room: string) {
  try {
    // 👇️ const data: CreateUserResponse
    const { data } = await axios.post<MessageState[]>(
      process.env.REACT_APP_SERVER_IP + "/room/get_room_msgs",
      { room_id: name_room },
      {
        headers: {
          // "Content-Type": "application/json",
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
      if (error?.response?.status === 401)
        throw (error?.response?.data);
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
}

export async function requestDirectMsgs(curr_conv: string) {
  try {
    // 👇️ const data: CreateUserResponse
    const { data } = await axios.post<MessageState[]>
      (
        process.env.REACT_APP_SERVER_IP + "/room/post_name_room_dm",
        { to: curr_conv },
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
