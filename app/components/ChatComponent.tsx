import React, { useEffect, useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SendIcon from '@mui/icons-material/Send';
import { useAppSelector, useAppDispatch } from '../Redux/hooks';
import { useSocket } from '../socketContext';
import { setToggle } from '../Redux/slices/ToggleMessage';

type message = {
    from: string,
    msg: string,
    color: string
}

type memberType = {
    user: string,
    color: string
}

export default function ChatComponent() {
    const dispatch = useAppDispatch();
    const [message, setMessage] = useState<string>('');
    const socket = useSocket();
    const [email, setEmail] = useState<string>("");
    const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);
    const [messageArr, setMessageArr] = useState<message[]>([]);
    const [membersArr, setMembers] = useState<Set<memberType>>(new Set());
    const users = useAppSelector(state => state.ToggleMessage.users);
    const chat = useAppSelector(state => state.ToggleMessage.chat);
    const toggle = useAppSelector(state => state.ToggleMessage.toggle);

    const colors = ["bg-red-200", "bg-blue-200", "bg-yellow-200", "bg-green-200", "bg-orange-200", "bg-pink-200", "bg-violet-200"];

    useEffect(() => {
        let email = sessionStorage.getItem("email");
        setEmail(email!)

        if (socket) {
            socket.emit("getMembers", meetingCode);

            const handleMembers = (members: string[]) => {
                if (Array.isArray(members)) {
                    setMembers((prev) => {
                        const updatedSet = new Set(prev);
                        members.forEach((member) => {
                            if (!([...updatedSet].some(existingMember => existingMember.user === member))) {
                                updatedSet.add({ user: member, color: colors[Math.floor(Math.random() * 7)] })
                            }
                        });
                        return updatedSet;
                    });
                }
            }

            socket.on("fetchedMembers", handleMembers);

            return () => {
                if (socket) {
                    socket.off("fetchedMembers", handleMembers);
                }
            }
        }

    }, [socket, meetingCode])

    useEffect(() => {
        if (socket) {
            const handleMessageArrived = (email: string, message: string) => {
                setMessageArr(prev => [...prev, { from: email, msg: message, color: colors[Math.floor(Math.random() * 7)] }]);
            };
            socket.on("messageArrived", handleMessageArrived);

            return () => {
                socket.off("messageArrived", handleMessageArrived);
            };
        }
    }, [socket, messageArr]);


    const closeSidebar = () => {
        dispatch(setToggle(false));
    }

    const sendMessage = () => {
        if (socket && message !== "") {
            socket.emit('message', email, message, meetingCode);
        }
        setMessage("");
    };

    return (
        <>
            <aside className={`${toggle ? 'opacity-100 h-[32rem] z-50' : 'opacity-0 h-0 -z-10'} w-80 bg-white shadow-md shadow-gray-400 absolute top-28 left-5 flex flex-col rounded-2xl overflow-hidden transition-all duration-500`}>
                <div className='flex justify-between items-center h-[12%] px-4'>
                    <p className='text-gray-700 font-medium text-xl'> { users ? "People" : "Messages" } </p>
                    <button onClick={closeSidebar}>
                        <CloseOutlinedIcon className='text-gray-800' />
                    </button>
                </div>

                <div className='w-full h-5/6 overflow-y-scroll flex-grow px-4'>
                    {
                        users &&
                        [...membersArr].map(({ user, color }, index) => (
                            <div key={index} className={`my-3 px-3 py-2 rounded-xl w-full ${color}`}>
                                <p className='text-gray-800 text-xs font-semibold'> {user} </p>
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
                </div>

                <div className="flex items-center h-[15%] px-4">
                    <div className="relative w-full overflow-hidden">
                        <button className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:bg-gray-300 w-12 h-4/5 rounded-full" onClick={sendMessage}>
                            <SendIcon className={message ? "text-blue-600" : "text-gray-800"} />
                        </button>
                        <input
                            type="text" name='message' value={message}
                            className={`${(users) ? 'hidden' : 'visible'} w-full h-12 pr-14 pl-6 outline-none border-2 border-gray-500 text-black py-2 rounded-full placeholder:text-gray-600 placeholder:font-medium bg-gray-100`}
                            placeholder="Enter message here" onChange={e => setMessage(e.target.value)}
                        />
                    </div>
                </div>

            </aside>
        </>
    )
}
