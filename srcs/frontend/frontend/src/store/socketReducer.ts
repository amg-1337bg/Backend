import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { io, Socket } from 'socket.io-client';

export interface SocketState {
    socket: Socket;
}

const initialState: SocketState = {
    socket: io()
}

export const socketSlice = createSlice({
    name: 'socketclient',
    initialState,
    reducers: {

        initSocketClient (state, action: PayloadAction<{host:string, user: string }>) {
            let socket:Socket = io(action.payload.host, {
				auth: {
					from: action.payload.user,
				}
			});
            return ({socket});
        },

        disconnectSocket: (state) => {
            state.socket.disconnect();
        },
    }
})

export const {initSocketClient, disconnectSocket} = socketSlice.actions

export default socketSlice.reducer