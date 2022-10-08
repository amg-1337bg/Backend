import { Button, FormControl, InputBase, List, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import HeaderChat from './HeaderChat'
import SendIcon from '@mui/icons-material/Send'
import MessageSent from './MessageSent';
import MessageRecieved from './MessageRecieved';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../store";
import { addMessage, clearMessages, initMessages, MessageState } from "../store/chatUiReducer";
import { requestDirectMsgs } from '../requests/messages';
import { handleToastMsg } from './InfoMessages/Toast';
import { useNavigate } from 'react-router-dom';

let index_msg: number = 0;
// let socketclient: Socket;

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: '12px 0 0 12px',
        position: 'relative',
        backgroundColor: "#151416",
        fontSize: 13,
        width: '440px',
        height: '45px',
        padding: '10px 20px',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
    },
}));

// const msgs = Array.from({ length: 9 }, (_, index) => {return ()}
const renderMessage = (current: string, from: string, msg: string, avatar: string, my_avatar: string): JSX.Element => {
    if (current === from)
        return (
            <li key={index_msg++} style={{ float: 'right' }}>
                <MessageSent msg={msg} avatar={my_avatar} />
            </li>
        );
    else
        return (
            <li key={index_msg++} style={{ float: 'left' }}>
                <MessageRecieved msg={msg} avatar={avatar} />
            </li>
        );
}

/* Handle Clear msgs when switch room */
export const ChatUiInstantMsg = () => {
    const dispatch = useDispatch();
    const bottomRef = useRef<null | HTMLDivElement>(null); // To auto scroll to bottom of window
    const logged_user = useSelector((state: RootState) => state.user).login;
    const logged_user_avatar = useSelector((state: RootState) => state.user).avatar as string;
    const [message_input, setMessage] = useState("");

    const chat_state = useSelector((state: RootState) => state.chat);
    const currentConv = chat_state.curr_converation;
    const avatar = chat_state.curr_conv_avatar;
    const msgs = chat_state.msgs;
    const [isInputEnabled, setInput] = useState(true)
    const navigate = useNavigate();
    const socket = useSelector((state: RootState) => state.socketclient).socket;

    const disableInputListen = () => {
        socket.on('disableWriting', (data: { status: boolean, msg: string, user: string, from: string }) => {
            if (data.user === logged_user && data.from === currentConv ||
                data.user === currentConv && data.from === logged_user) {
                handleToastMsg(data.status, data.msg);
                setInput(data.status);
            }
        })
    }

    const recieveMsgs = () => {
        socket.on('msgToClient_dm', (m: MessageState) => {
            dispatch(addMessage(m));
            // if (bottomRef)
            //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        })
    }

    const handleMsgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    }

    const handleEnterkey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            sendMsg();
        }
    }

    const initMsgs = () => {
        requestDirectMsgs(currentConv).then((value) => {
            const data = value as Array<MessageState>;
            if ((typeof data) === (typeof msgs))
                dispatch(initMessages(data));
        }).catch((error: any) => {
            console.log("Error ;Not Authorized", error);
            navigate(error.redirectTo);
        })
    }

    const sendMsg = () => {
        if (message_input) {
            if (socket) {
                socket.emit('dm_message', { msg: message_input });
            }
            setMessage('');
        }
    }

    useEffect(() => {
        if (socket)
            disableInputListen();
        return (() => {
            socket.off("disableWriting");
        })
    },)

    useEffect(() => {
        console.log("chatUIFriend");
        if (currentConv !== '')
            initMsgs();
        if (socket) {
            recieveMsgs();
        }
        if (bottomRef) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        return () => {
            console.log("clear");
            dispatch(clearMessages());
            socket.off("msgToClient_dm");
            index_msg = 0;
        }
    }, [currentConv])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [msgs])
    return (
        <Box
            bgcolor="#202541"
            sx={{
                backgroundColor: "#202541",
                width: "510px",
                height: '100vh',
                paddingLeft: "22px",
                paddingRight: "22px",
                borderLeft: "1px solid #FFFFFF"
            }}>
            <Stack height='inherit'>
                <div>
                    <HeaderChat name={currentConv} avatar={avatar} />
                </div>
                <Stack spacing={2.7} direction="column-reverse" sx={{ width: "100%", minHeight: "calc( 100vh - 67px )", margin: 'auto' }}>
                    {isInputEnabled &&
                        <Stack direction="row" marginBottom="35px">
                            <FormControl variant="standard">
                                <BootstrapInput placeholder="Write a message ..." id="bootstrap-input"
                                    onChange={handleMsgChange}
                                    onKeyDown={handleEnterkey}
                                    value={message_input} />
                            </FormControl>
                            <div style={{
                                backgroundColor: "#151416", padding: "10px", borderRadius: '0 10px 10px 0',
                            }}>
                                <Button sx={{ backgroundColor: "#3475D7", height: "45px", color: "#FFF" }} onClick={sendMsg}>
                                    <SendIcon />
                                </Button>
                            </div>
                        </Stack>
                    }
                    <List style={{ overflowY: 'auto' }} >
                        {msgs.map((item) => (renderMessage(logged_user, item.from, item.msg, avatar, logged_user_avatar)))}
                        <li key={index_msg++} style={{ float: 'right' }}>
                            <div ref={bottomRef} ></div>
                        </li>
                    </List>
                </Stack>
            </Stack>
        </Box>
    )
}