import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DialogState{
    is_open: boolean,
    is_open_tfa: boolean,
}
const initialState: DialogState = {
    is_open:false,
    is_open_tfa:false,

};

export const openDialogSlice = createSlice({
    name: 'openDialog',
    initialState,
    reducers: {
        setOpenDialogRoom: (state, action: PayloadAction<boolean>) => {
            state.is_open = action.payload
        },
        setOpenDialog2FA: (state, action: PayloadAction<boolean>) => {
            state.is_open_tfa = action.payload
        },
    }
})

export const {setOpenDialogRoom, setOpenDialog2FA} = openDialogSlice.actions

export default openDialogSlice.reducer