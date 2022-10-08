import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserOfRoom {
    id: number,
    login:string,
    username: string,
    user_role: string,
    avatar: string,
};

const initialState: UserOfRoom[] = [];

export const roomUsersSlice = createSlice({
    name: 'room_users',
    initialState,
    reducers: {
        addUserRoom: (state, action: PayloadAction<UserOfRoom>) => {
            state.push(action.payload)
        },

        initUsesrRoom: (state, action: PayloadAction<UserOfRoom[]>) => {
            state.length = 0;
            action.payload.forEach(val => state.push(Object.assign({}, val)));
        },

        clearUsersRoom: (state) => {
            state.length = 0;
        },
    }
})

export const { addUserRoom, initUsesrRoom, clearUsersRoom } = roomUsersSlice.actions

export default roomUsersSlice.reducer