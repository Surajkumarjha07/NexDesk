"use client"
import Navbar from '@/app/components/Navbar'
import React, { useEffect, useMemo, useState } from 'react'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/app/socketContext';
import { useAppDispatch, useAppSelector } from '@/app/Redux/hooks';
import { setMeetingCode } from '@/app/Redux/slices/meetingCode';

export default function HomePage() {
    const [email, setEmail] = useState<string>('');
    const router = useRouter();
    const socket = useSocket();
    const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);
    const dispatch = useAppDispatch();
    const [visibleContent, setVisibleContent] = useState<boolean>(false);

    useEffect(() => {
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find((cookie) => cookie.startsWith("authtoken="));
        const mainCookie = cookie ? cookie.split("=")[1] : null;

        const authorized = async () => {
            if (!mainCookie) {
                router.push("/");
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
                    router.push("/")
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
    }, []);

    useEffect(() => {
        const email = sessionStorage.getItem("email");
        if (email) {
            setEmail(email);
        };

        if (socket) {
            socket.on('roomCreated', (email: string, meetingCode: string) => {
                dispatch(setMeetingCode(meetingCode.trim()));
                router.push(`./CanvasPage/${meetingCode.trim()}`)
            })

            socket.on("roomJoined", (email: string, meetingCode: string) => {
                console.log("you are joined the room: ", email, meetingCode);
                router.push(`./CanvasPage/${meetingCode.trim()}`);
            })
        }
    }, [socket])

    const newMeeting = () => {
        if (socket && email) {
            socket.emit('newMeeting', email)
        }
    }

    const handleJoinRoom = () => {
        if (socket && meetingCode && email) {
            socket.emit("joinRoom", email, meetingCode);
        }
    }

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
                        <button className='bg-blue-500 flex justify-center items-center gap-4 py-3 px-3 rounded-md' onClick={newMeeting}>
                            <DashboardCustomizeOutlinedIcon />
                            <span className='font-semibold'> New Whiteboard </span>
                        </button>

                        <input type="text" className='text-gray-700 px-3 py-3 w-64 border-2 border-gray-400 outline-none rounded-md placeholder:text-gray-500 placeholder:font-medium' placeholder='Enter Code' onChange={e => dispatch(setMeetingCode(e.target.value))} />

                        <button className={`${meetingCode ? 'text-blue-500' : 'text-gray-500 '} font-semibold`} onClick={handleJoinRoom}>
                            Join
                        </button>
                    </div>
                    <hr className='' />
                    <p className='text-gray-500 font-semibold'> NexDesk </p>
                </div>

                <div className='w-1/2'>

                </div>
            </section>
        </>
    )
}
