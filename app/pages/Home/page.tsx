"use client"
import Navbar from '@/app/components/Navbar'
import React, { useEffect, useRef, useState } from 'react'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/app/socketContext';
import { useAppDispatch, useAppSelector } from '@/app/Redux/hooks';
import { setMeetingCode } from '@/app/Redux/slices/meetingCode';
import { motion } from "framer-motion"

export default function HomePage() {
    const router = useRouter();
    const socket = useSocket();
    const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);
    const dispatch = useAppDispatch();
    const [visibleContent, setVisibleContent] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    const username = useAppSelector(state => state.UserCredential.username);

    useEffect(() => {
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find((cookie) => cookie.startsWith("authtoken="));
        const mainCookie = cookie ? cookie.split("=")[1] : null;

        const authorized = async () => {
            if (!mainCookie) {
                router.push("/");
                return;
            }

            try {
                const response = await fetch("http://localhost:4000/userAuthenticated", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${mainCookie}`
                    },
                    credentials: "include"
                })

                if (!response.ok) {
                    router.push("/");
                }
                else {
                    setVisibleContent(true);
                }
            } catch (error) {
                console.log("error: ", error);
                router.push("/")
            }
        };

        authorized();
    }, [router]);

    useEffect(() => {
        if (socket) {
            socket.on('roomCreated', (username: string, meetingCode: string) => {
                dispatch(setMeetingCode(meetingCode.trim()));
                router.push(`./CanvasPage/${meetingCode.trim()}`)
            })

            socket.on("roomJoined", (username: string, meetingCode: string) => {
                console.log("you are joined the room: ", username, meetingCode);
                router.push(`./CanvasPage/${meetingCode.trim()}`);
            })
        }
    }, [socket, dispatch, router])

    const newMeeting = () => {
        if (socket && username) {
            socket.emit('newMeeting', username)
        }
    };

    const handleJoinRoom = () => {
        if (socket && meetingCode && username) {
            socket.emit("joinRoom", username, meetingCode);
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
                        <p className='text-4xl text-gray-900 my-2'>
                            Sketch, Share, and Solve Together in Real Time
                        </p>
                        <p className='text-xl text-gray-600'>
                            Collaborate in Real Time, Create Without Limits
                        </p>
                    </div>

                    <div className='flex justify-start items-center gap-5'>
                        <motion.button whileTap={{ scale: 0.9 }} className='bg-blue-500 flex justify-center items-center gap-4 py-3 px-3 rounded-md' onClick={newMeeting}>
                            <DashboardCustomizeOutlinedIcon />
                            <span className='font-semibold'> New Whiteboard </span>
                        </motion.button>

                        <input type="text" className='text-gray-700 px-3 py-3 w-64 border-2 border-gray-400 outline-none rounded-md placeholder:text-gray-500 placeholder:font-medium' placeholder='Enter Code' onChange={e => dispatch(setMeetingCode(e.target.value))} />

                        <button className={`${meetingCode ? 'text-blue-500' : 'text-gray-500 '} font-semibold`} onClick={handleJoinRoom}>
                            Join
                        </button>
                    </div>
                    <hr />
                    <p className='text-gray-500 font-semibold'> NexDesk </p>
                </div>

                <motion.div ref={divRef} className='w-1/2 h-screen flex justify-center items-center' initial={{rotate: 0, scale: 1, opacity: 1}} animate={{rotate:150, scale: 0, opacity: 0}} transition={{duration: 10, repeat: Infinity, repeatType: "mirror", repeatDelay:4}}>
                    <div className='w-1/2 h-1/2 border-4 border-pink-600 bg-pink-200 bg-opacity-45 backdrop-blur-md rounded-lg relative'>
                        <motion.div className='absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 w-44 h-44 shadow-inner shadow-orange-600 bg-opacity-75 backdrop-opacity-15 rounded-md bg-orange-500 flex justify-center items-center text-white text-3xl font-mono'>
                            <p>
                                {
                                    textArr[0]
                                }
                            </p>
                        </motion.div>
                        <motion.div className='absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-44 h-44 shadow-inner shadow-green-600 bg-opacity-75 backdrop-opacity-15 rounded-md bg-green-500 flex justify-center items-center text-white text-3xl font-mono'>
                            <p>
                                {
                                    textArr[1]
                                }
                            </p>
                        </motion.div>
                        <motion.div className='absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-44 h-44 shadow-inner shadow-blue-600 bg-opacity-75 backdrop-opacity-15 rounded-md bg-blue-500 flex justify-center items-center text-white text-3xl font-mono'>
                            <p>
                                {
                                    textArr[2]
                                }
                            </p>
                        </motion.div>
                        <motion.div className='absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 w-44 h-44 shadow-inner shadow-yellow-600 bg-opacity-75 backdrop-opacity-15 rounded-md bg-yellow-500 flex justify-center items-center text-white text-3xl font-mono'>
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
