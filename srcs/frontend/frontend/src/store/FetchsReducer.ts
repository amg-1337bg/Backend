import { createSlice } from '@reduxjs/toolkit'

interface FetchType{
    roomsHome: boolean,
}

const initialState: FetchType = {
    roomsHome :false,
};

export const fetchSlice = createSlice({
    name: 'fetch',
    initialState,
    reducers: {
        fetchRoomsHome: (state) => {
            state.roomsHome = !state.roomsHome;
        },
    }
})

export const { fetchRoomsHome } = fetchSlice.actions

export default fetchSlice.reducer