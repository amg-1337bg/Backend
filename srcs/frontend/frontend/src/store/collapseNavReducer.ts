import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: {is_collapsed: boolean} = {is_collapsed: true};

export const collapseNavSlice = createSlice({
    name: 'collapseNav',
    initialState,
    reducers: {
        setCollapse: (state, action: PayloadAction<boolean>) => {
            state.is_collapsed = action.payload;
        },
    }
})

export const {setCollapse} = collapseNavSlice.actions

export default collapseNavSlice.reducer