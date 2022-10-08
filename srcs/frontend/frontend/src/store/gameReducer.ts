import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Player } from '../components/canvas';
import { P_data} from "../components/DropMenus/DropMenuUser";

export enum ModeEnum {
    mode1,
    mode2,
    mode3,
    default,
}

interface PlayerData{
    p1:Player;
    p2:Player;
}

export interface ModeState {
    mode: ModeEnum,
    dialogIsOpen: boolean,
    is_game_set: boolean,
    room:string,
    players:PlayerData;
    invite_key:string;

    inviteData:data,

    // data_accept:data,
}

export type data = {
	P1: P_data;
	P2: P_data;
	mod: number;
}


const initialState: ModeState = {
    mode: ModeEnum.default,
    dialogIsOpen: false,
    is_game_set: false,
    room:"",
    players:{p1:{} as Player , p2:{} as Player},
    invite_key:'',

    inviteData:{P1:{} as P_data, P2:{} as P_data, mod:0},
    // data_accept:{} as data,
}

export const GameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setModeGame: (state, action: PayloadAction<{mode:ModeEnum, room?:string}>) => {
            state.mode = action.payload.mode;
            state.dialogIsOpen = false;
            state.is_game_set = true;
            state.room = action.payload.room as string;
        },

        updateScore: (state, action: PayloadAction<{p1:Player, p2:Player}>) => {
            state.players.p1 = action.payload.p1;
            state.players.p2 = action.payload.p2;
        },

        finishGame: (state) => {
            state = initialState;
        },

        playInvitedGame:(state, action: PayloadAction<{key:string, mode:ModeEnum}>) => {
            state.mode=action.payload.mode;
            state.invite_key = action.payload.key;
            // state.is_game_set = true;
        },

        HandleCloseDialog: (state) => {
            state.dialogIsOpen = false;
            state.is_game_set = true;
        },
        HandleOpeneDialog: (state) => {
            state.dialogIsOpen = true;
        },

        startInviteGame: (state) => {
            state.is_game_set = true;
        },

        setInviteData:(state, action: PayloadAction<data>) => {
            state.dialogIsOpen = true;
            state.inviteData = action.payload;
        },

    }
})

export const { setModeGame, HandleCloseDialog, HandleOpeneDialog,finishGame,updateScore,playInvitedGame,  startInviteGame,  setInviteData } = GameSlice.actions

export default GameSlice.reducer