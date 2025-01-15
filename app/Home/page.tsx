"use client"
import Navbar from '@/app/components/Navbar'
import React, { useEffect, useRef, useState } from 'react'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/app/socketContext';
import { useAppDispatch, useAppSelector } from '@/app/Redux/hooks';
import { setIsNewMeeting, setMeetingCode } from '@/app/Redux/slices/meetingCode';
import { motion } from "framer-motion"
import { setToggle } from '@/app/Redux/slices/ToggleMessage';
import { toast } from "react-toastify";

export default function HomePage() {
    const router = useRouter();
    const socket = useSocket();
    const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);
    const dispatch = useAppDispatch();
    const [visibleContent, setVisibleContent] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    const username = useAppSelector(state => state.UserCredential.username);
    const userEmail = useAppSelector(state => state.UserCredential.userEmail);
    const isDarkMode = useAppSelector(state => state.DarkMode.isDarkMode);

    useEffect(() => {
        if (typeof document !== "undefined") {
            const cookies = document.cookie.split("; ");
            const cookie = cookies.find((cookie) => cookie.startsWith("authtoken="));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let mainCookie: any;
            if (cookie) {
                mainCookie = cookie.split("=")[1];
            }

            dispatch(setMeetingCode(""));
            dispatch(setToggle(false));

            const authorized = async () => {
                try {
                    await fetch("https://nexdesk-backend.onrender.com/userAuthenticated", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${mainCookie}`
                        },
                        credentials: "include"
                    }).then(response => {
                        if (response.status === 200) {
                            setVisibleContent(true);
                        }
                        else {
                            router.push("/");
                        }
                    })
                } catch (error) {
                    console.error("error: ", error);
                    toast.error("Unable to authorize. Please try again later.", {
                        hideProgressBar: true,
                        autoClose: 2000,
                        position: "top-center",
                    });
                    router.push("/")
                }
            };

            authorized();
        }
    }, [router, dispatch]);

    useEffect(() => {
        if (socket) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            socket.on('roomCreated', (data: any) => {
                const { meetingCode } = data;
                if (meetingCode) {
                    dispatch(setMeetingCode(meetingCode.trim()));
                    router.push(`./CanvasPage/${meetingCode.trim()}`)
                }
            })

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            socket.on("roomJoined", (data: any) => {
                const { meetingCode } = data;
                router.push(`./CanvasPage/${meetingCode.trim()}`);
            })
        }
    }, [socket, dispatch, router])

    const newMeeting = () => {
        if (socket && username) {
            socket.emit('newMeeting', username, userEmail)
            dispatch(setIsNewMeeting(true));
        }
    };

    const handleJoinRoom = () => {
        if (socket && meetingCode && username) {
            socket.emit("joinRoom", username, userEmail, meetingCode);
            dispatch(setIsNewMeeting(true));
        }
    };

    const textArr = ["Create", "Sketch", "Share", "Solve"];

    return (
        visibleContent &&
        <>
            <Navbar />
            <section className='w-screen h-screen absolute top-0 flex justify-center items-center'>
                <div className='w-1/2 px-14'>
                    <div className='my-8'>
                        <p className={`${isDarkMode ? "text-white" : "text-gray-900"} text-4xl my-2`}>
                            Sketch, Share, and Solve Together in Real Time
                        </p>
                        <p className={`${isDarkMode ? "text-white" : "text-gray-600"} text-xl`}>
                            Collaborate in Real Time, Create Without Limits
                        </p>
                    </div>

                    <div className='flex justify-start items-center gap-5'>
                        <motion.button whileTap={{ scale: 0.9 }} className='bg-blue-500 flex justify-center items-center gap-4 py-3 px-3 rounded-md' onClick={newMeeting}>
                            <DashboardCustomizeOutlinedIcon />
                            <span className='font-semibold'> New Whiteboard </span>
                        </motion.button>

                        <input type="text" className='text-gray-700 px-3 py-3 w-64 border-2 border-gray-400 outline-none rounded-md placeholder:text-gray-500 placeholder:font-medium z-50' placeholder='Enter Code' onChange={e => dispatch(setMeetingCode(e.target.value))} />

                        <button className={`${!meetingCode ? 'text-gray-500' : isDarkMode ? "text-white" : "text-blue-500"} font-semibold z-50`} onClick={handleJoinRoom}>
                            Join
                        </button>
                    </div>
                    <hr />
                    <p className={`${isDarkMode ? "text-gray-200" : "text-gray-500"} text-gray-500 font-semibold`}> NexDesk </p>
                </div>

                <motion.div ref={divRef} className='w-1/2 h-screen flex justify-center items-center' initial={{ rotate: 0, scale: 1, opacity: 1 }} animate={{ rotate: 150, scale: 0, opacity: 0 }} transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", repeatDelay: 4 }}>
                    <div className='w-1/2 h-1/2 border-4 border-pink-600 bg-opacity-45 backdrop-blur-md rounded-lg relative'>
                        <motion.div className='absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 w-44 h-44 shadow-inner shadow-orange-600 rounded-md bg-orange-500 flex justify-center items-center text-white text-3xl font-mono'>
                            <p>
                                {
                                    textArr[0]
                                }
                            </p>
                        </motion.div>
                        <motion.div className='absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-44 h-44 shadow-inner shadow-green-600 rounded-md bg-green-500 flex justify-center items-center text-white text-3xl font-mono'>
                            <p>
                                {
                                    textArr[1]
                                }
                            </p>
                        </motion.div>
                        <motion.div className='absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-44 h-44 shadow-inner shadow-blue-600 rounded-md bg-blue-500 flex justify-center items-center text-white text-3xl font-mono'>
                            <p>
                                {
                                    textArr[2]
                                }
                            </p>
                        </motion.div>
                        <motion.div className='absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 w-44 h-44 shadow-inner shadow-yellow-600 rounded-md bg-yellow-500 flex justify-center items-center text-white text-3xl font-mono'>
                            <p>
                                {
                                    textArr[3]
                                }
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </>
    )
}
