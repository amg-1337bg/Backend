import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './chatUiReducer'
import collapseNavReducer from './collapseNavReducer'
import FetchsReducer from './FetchsReducer'
import gameReducer from './gameReducer'
import interfacesReducer from './interfacesReducer'
import openDialogReducer from './openDialogReducer'
import profileReducer from './profileReducer'
import roomUsersReducer from './roomUsersReducer'
import socketGlobalReducer from './socketGlobalReducer'
import socketReducer from './socketReducer'
import userReducer from './userReducer'

export const store = configureStore({
	reducer: {
		user: userReducer,
		chat: chatReducer,
		openDialog: openDialogReducer,
		interfaces: interfacesReducer,
		collapseNav: collapseNavReducer,
		room_users: roomUsersReducer,
		socketclient: socketReducer,
		game:gameReducer,
		fetch:FetchsReducer,
		profile:profileReducer,
		socketglobal:socketGlobalReducer,
	},
	// To fix non serialisable object set on state
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),

})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
