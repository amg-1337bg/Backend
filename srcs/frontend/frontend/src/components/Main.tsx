import  { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { data } from './DropMenus/DropMenuUser';
import { toast } from "react-toastify";
import {  ModeEnum } from '../store/gameReducer';
import { useNavigate } from 'react-router-dom';
import ModeDialog from './Game/ModeDialog';
import { ModesInput } from './Game/ModesInput';

let getMode = (mode: ModeEnum): string => {
    switch (mode) {
        case ModeEnum.mode1: return ("1");
        case ModeEnum.mode2: return ("2");
        case ModeEnum.mode3: return ("3");
        default:
            return ("");
    }
}

const Main = () => {
    const dispatch = useDispatch();
    const socket_global = useSelector((state: RootState) => state.socketglobal).socket_global;
    const navigate = useNavigate();


    const handleClickAccept = (data: data) => {
        socket_global.emit('accepted', data);
    }

    
    const CustomMsg = (props: data) => {
        let mode:string;

        if (props.mod === 0)
            mode = "Classic";
        else
            mode = "Rush"
        return (<div>
            <p> {props.P1.username} want to play with you in mode {mode}</p>
            <button onClick={() => { handleClickAccept(props) }}>Accept</button>
            <button >Cancel</button>
        </div>)
    }

    const handleToastGame = (data: data) => {
        toast.info(CustomMsg(data), {className: "inviteGame"});
    };

    const handleListenerGame = () => {
        socket_global.on('gameInvite', (data: data) => {
            console.log("inviiite", data);
            handleToastGame(data);
        })
    }

    useEffect(() => {
        if (socket_global)
            handleListenerGame();
        return (() => {
            socket_global.off("gameInvite");
        })
    },)


    const handleGameStart = () => {
        socket_global.on('start', (data: { key: string, mod: number }) => {
            const params = { key: data.key, mode: data.mod };
            // dispatch(playInvitedGame({key:data.key, mode:data.mod}));
            navigate({
                pathname: '/matchmaking',
                search: '?key=' + params.key + '&mode=' + getMode(data.mod)
            });
        })
    }
    
    useEffect(() => {
        if (socket_global)
            handleGameStart();
        return (() => {
            socket_global.off("start");
        })
    },)
    return (<div>
        <ModeDialog>
            <ModesInput invite={true} />
        </ModeDialog>
    </div>);
}

export default Main
