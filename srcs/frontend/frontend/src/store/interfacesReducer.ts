import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum InterfaceEnum{
    Home,
    Dashboard,
    ChatRoom,
    InstantMessaging,
    Friends,
    Matchmaking,
    LiveGames,
    Logout,
}

export interface interfacesState {
    current: InterfaceEnum
}

const initialState: interfacesState = {
    current: InterfaceEnum.Home
}

export const InterfaceSlice = createSlice({
    name: 'interfaces',
    initialState,
    reducers: {
        setCurrentInterface: (state, action: PayloadAction<InterfaceEnum>) => {
            state.current = action.payload
        },
    }
})

export const {setCurrentInterface} = InterfaceSlice.actions

export default InterfaceSlice.reducer