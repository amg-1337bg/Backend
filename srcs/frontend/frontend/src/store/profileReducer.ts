import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProfileState {
    curr_achievement:string,
}

const initialState: ProfileState = {
    curr_achievement:"",
}

export const ProfileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setAchievement: (state, action: PayloadAction<string>) => {
            state.curr_achievement = action.payload;
        },
    }
})

export const { setAchievement, } = ProfileSlice.actions

export default ProfileSlice.reducer