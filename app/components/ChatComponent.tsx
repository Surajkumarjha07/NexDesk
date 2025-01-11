import React, { useEffect, useRef, useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SendIcon from '@mui/icons-material/Send';
import { useAppSelector, useAppDispatch } from '../Redux/hooks';
import { useSocket } from '../socketContext';
import { setToggle, setToggleChat, setToggleUsers } from '../Redux/slices/ToggleMessage';
import CallIcon from '@mui/icons-material/Call';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

type message = {
    from: string,
    msg: string,
    color: string
}

type memberType = {
    user: { userEmail: string, username: string },
    color: string
}

export default function ChatComponent() {
    const dispatch = useAppDispatch();
    const [message, setMessage] = useState<string>('');
    const socket = useSocket();
    const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);
    const [messageArr, setMessageArr] = useState<message[]>([]);
    const [membersArr, setMembers] = useState<memberType[]>([]);
    const users = useAppSelector(state => state.ToggleMessage.users);
    const chat = useAppSelector(state => state.ToggleMessage.chat);
    const saves = useAppSelector(state => state.ToggleMessage.saves);
    const toggle = useAppSelector(state => state.ToggleMessage.toggle);
    const username = useAppSelector(state => state.UserCredential.username);
    const membersFetched = useRef(false);
    const userEmail = useAppSelector(state => state.UserCredential.userEmail);
    const forwardUserDisconnect = useRef(false);
    const [showOptions, setShowOptions] = useState(false);

    const colors = ["bg-red-200", "bg-blue-200", "bg-yellow-200", "bg-green-200", "bg-orange-200", "bg-pink-200", "bg-violet-200"];

    const handleMembers = (members: { userEmail: string, username: string }[]) => {
        setMembers([]);
        if (Array.isArray(members)) {
            members.forEach(member => {
                setMembers((prev) => [
                    ...prev, { user: member, color: colors[Math.floor(Math.random() * 7)] }
                ]);
            })
        }
    }

    useEffect(() => {
        if (socket) {
            if (!membersFetched.current) {
                socket.emit("getMembers", meetingCode);
                membersFetched.current = true;
            }

            socket.on("fetchedMembers", handleMembers);

            return () => {
                if (socket) {
                    socket.off("fetchedMembers", handleMembers);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, meetingCode])

    useEffect(() => {
        if (socket) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handleMessageArrived = (data: any) => {
                const { username, message } = data;
                setMessageArr(prev => [...prev, { from: username, msg: message, color: colors[Math.floor(Math.random() * 7)] }]);
            };
            socket.on("messageArrived", handleMessageArrived);

            return () => {
                socket.off("messageArrived", handleMessageArrived);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, messageArr]);


    const closeSidebar = () => {
        dispatch(setToggle(false));
        dispatch(setToggleChat(false));
        dispatch(setToggleUsers(false));
    }

    const sendMessage = () => {
        if (socket && message !== "") {
            socket.emit('message', username, message, meetingCode);
        }
        setMessage("");
    };

    const endMeeting = () => {
        if (socket && !forwardUserDisconnect.current) {
            socket.emit("userDisconnect", { userEmail, username, meetingCode })
            forwardUserDisconnect.current = true;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedRoom = (data: any) => {
        const { updatedRoom } = data;

        if (Array.isArray(updatedRoom)) {
            setMembers([]);
            updatedRoom.forEach(member => {
                setMembers((prev) => [
                    ...prev, { user: member, color: colors[Math.floor(Math.random() * 7)] }
                ]);
            })
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on("userDisconnected", updatedRoom);
        }

        return () => {
            if (socket) {
                socket.off("userDisconnected", updatedRoom);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <>
            <aside className={`${toggle ? 'opacity-100 h-[32rem] z-50' : 'opacity-0 h-0 -z-10'} w-80 bg-white shadow-md shadow-gray-400 absolute top-28 left-5 flex flex-col rounded-2xl overflow-hidden transition-all duration-500`}>
                <div className='flex justify-between items-center h-[12%] px-4'>
                    <p className='text-gray-700 font-medium text-xl'> {users ? "People" : saves ? "Saved Meetings" : "Messages"} </p>
                    <button onClick={closeSidebar}>
                        <CloseOutlinedIcon className='text-gray-800' />
                    </button>
                </div>

                <div className='w-full overflow-y-scroll flex-grow px-4 overflow-x-hidden'>
                    {
                        users &&
                        [...membersArr].map(({ user, color }, index) => (
                            <div key={index} className={`my-3 px-3 py-2 rounded-xl w-full ${color}`}>
                                <p className='text-gray-800 text-xs font-semibold'> {user.username} </p>
                            </div>
                        ))
                    }

                    {
                        chat &&
                        messageArr.map(({ from, msg, color }, index) => (
                            <div key={index} className={`my-3 px-3 py-2 rounded-xl w-full ${color}`}>
                                <p className='text-gray-600 text-[11px] font-semibold'> {from} </p>
                                <p className='text-gray-700 text-[13px] font-semibold mt-1'> {msg} </p>
                            </div>
                        ))
                    }

                    {
                        saves &&
                        <div className='relative'>
                            <div className={`w-full h-fit flex justify-between items-center rounded-md py-2 px-4 bg-yellow-300`}>
                                <p className='text-gray-800 text-sm font-semibold'> Meeting Name </p>
                                <button onClick={() => setShowOptions(option => !option)}>
                                    <MoreVertRoundedIcon className='text-gray-800 font-semibold pointer-events-none' />
                                </button>
                            </div>
                            {
                                showOptions &&
                                <div className='absolute w-fit h-fit top-10 right-0 bg-white rounded-md px-2 py-1 shadow-sm shadow-gray-400'>
                                    <button className='w-full text-xs font-semibold text-gray-800 block hover:bg-gray-200 px-2 py-1 rounded-md'>
                                        Open
                                    </button>
                                    <button className='w-full text-xs font-semibold text-red-600 hover:bg-red-200 px-2 py-1 rounded-md'>
                                        Delete
                                    </button>
                                </div>
                            }
                        </div>
                    }
                </div>

                <div className={`flex items-center h-[15%] px-4 ${users && "h-[11%] rounded-t-xl bg-rose-200"} ${saves && "h-[3%]"}`}>
                    {
                        chat &&
                        <div className="relative w-full h-fit overflow-hidden">
                            <button className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:bg-gray-300 w-12 h-4/5 rounded-full" onClick={sendMessage}>
                                <SendIcon className={message ? "text-blue-600" : "text-gray-800"} />
                            </button>
                            <input
                                type="text" name='message' value={message}
                                className={`w-full h-12 pr-14 pl-6 outline-none border-2 border-gray-500 text-black py-2 rounded-full placeholder:text-gray-600 placeholder:font-medium bg-gray-100`}
                                placeholder="Enter message here" onChange={e => setMessage(e.target.value)}
                            />
                        </div>
                    }

                    {
                        users &&
                        <div className="relative -top-1/3 mx-auto flex justify-center items-center w-14 h-14 overflow-hidden bg-red-600 rounded-full outline outline-4 outline-white cursor-pointer" onClick={endMeeting}>
                            <CallIcon className='pointer-events-none' />
                        </div>
                    }

                </div>

            </aside>
        </>
    )
}
