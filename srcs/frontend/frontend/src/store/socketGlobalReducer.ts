import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { io, Socket } from 'socket.io-client';


export interface SocketGlobalState {
    socket_global: Socket;
}

const initialState: SocketGlobalState = {
    socket_global: io(),
}

export const socketGlobalSlice = createSlice({
    name: 'socketglobal',
    initialState,
    reducers: {

        initSocketGlobal (state, action: PayloadAction<{host:string, user: string }>) {
            let socket_global:Socket = io(action.payload.host, {
				auth: {
					from: action.payload.user,
				}
			});
            return ({socket_global});
        },

        disconnectSocketGlobal: (state) => {
            state.socket_global.disconnect();
        },
    }
})

export const {initSocketGlobal, disconnectSocketGlobal} = socketGlobalSlice.actions

export default socketGlobalSlice.reducer