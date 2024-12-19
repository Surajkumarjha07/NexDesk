import React, { useEffect, useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SendIcon from '@mui/icons-material/Send';
import { useAppSelector, useAppDispatch } from '../Redux/hooks';
import { setFunctionality } from '../Redux/slices/functionality';
import { setToggle } from '../Redux/slices/toggle';
import { useSocket } from '../socketContext';
import { SocketAddress } from 'net';

type message = {
    from: string,
    msg: string
}

export default function ChatComponent() {
    const functionality = useAppSelector(state => state.Functionality.functionality);
    const dispatch = useAppDispatch();
    const toggle = useAppSelector(state => state.Toggle.toggle);
    const [message, setMessage] = useState<string>('');
    const socket = useSocket();
    const [email, setEmail] = useState<string>("");
    const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);
    const [messageArr, setMessageArr] = useState<message[]>([]);
    const [members, setMembers] = useState<string[]>([]);

    useEffect(() => {
        let email = sessionStorage.getItem("email");
        setEmail(email!)

        if (socket) {
            socket.emit("getMembers", meetingCode);

            socket.on("fetchedMembers", (members) => {
                setMembers(prev => [...prev, members])
            })
        }

    }, [socket])

    useEffect(() => {
        if (socket) {
            const handleMessageArrived = (email: string, message: string) => {
                setMessageArr(prev => [...prev, { from: email, msg: message }]);
                console.log("message arrived: ", email, message);
                console.log("messages: ", messageArr);
            };
            socket.on("messageArrived", handleMessageArrived);

            // Cleanup to avoid duplication
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
                    <p className='text-gray-700 font-medium text-xl'> {functionality === 'chat' ? 'Messages' : functionality === "members" ? 'People' : 'Messages'} </p>
                    <button onClick={closeSidebar}>
                        <CloseOutlinedIcon className='text-gray-800' />
                    </button>
                </div>

                <div className='w-full flex-grow px-4'>
                    {
                        functionality == "chat" ?
                            messageArr.map(({ from, msg }, index) => (
                                <div key={index} className='bg-gray-200 my-3 px-3 py-2 rounded-xl w-fit'>
                                    <p className='text-gray-600 text-xs font-semibold'> {from} </p>
                                    <p className='text-gray-700 text-sm font-semibold mt-1'> {msg} </p>
                                </div>
                            )) :
                            members.map((user, index) => (
                                <div key={index} className='bg-gray-200 my-3 px-3 py-2 rounded-xl w-fit'>
                                    <p className='text-gray-600 text-xs font-semibold'> {user} </p>
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
                            className={`${(functionality === 'users') ? 'hidden' : 'visible'} w-full h-12 pr-14 pl-6 outline-none border-2 border-gray-500 text-black py-2 rounded-full placeholder:text-gray-600 placeholder:font-medium bg-gray-100`}
                            placeholder="Enter message here" onChange={e => setMessage(e.target.value)}
                        />
                    </div>
                </div>

            </aside>
        </>
    )
}
