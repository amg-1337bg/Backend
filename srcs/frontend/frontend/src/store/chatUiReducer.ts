import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface MessageState {
    from: string, 
    msg: string,
    avatar?:string,
};

export interface ChatUIState {
    is_friend: boolean,
    curr_converation: string,
    curr_conv_avatar:string,
    curr_room: string,
    curr_role: string,
    msgs: MessageState[]
}

const initialState: ChatUIState = {
    is_friend: false,
    curr_converation: '',
    curr_room: '',
    curr_role: '',
    curr_conv_avatar:'',
    msgs:[]

}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        changeStatusFriends: (state, action: PayloadAction<boolean>) => {
            state.is_friend = action.payload
        },

        changeCurrRoom: (state, action: PayloadAction<{room:string, role:string}>) => {
            state.curr_room = action.payload.room;
            state.curr_role = action.payload.role;
        },

        changeCurrConversation: (state, action: PayloadAction<{user:string, avatar:string}>) => {
            state.curr_converation = action.payload.user;
            state.curr_conv_avatar = action.payload.avatar;
        },

        addMessage: (state, action: PayloadAction<MessageState>) => {
            state.msgs.push(action.payload)
        },

        initMessages: (state, action: PayloadAction<MessageState[]>) => {
            state.msgs.length = 0;
            action.payload.map((item) => { state.msgs.push(item) })
        },

        clearMessages: (state) => {
            state.msgs.length = 0;
        },
    }
})

export const { changeStatusFriends, changeCurrRoom, changeCurrConversation, addMessage, initMessages, clearMessages } = chatSlice.actions

export default chatSlice.reducer