"use client"
import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { setUserEmail, setUserName } from '../Redux/slices/user';

export default function Navbar() {
    const [time, setTime] = useState('');
    const username = useAppSelector(state => state.UserCredential.username);
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);
    const [color, setColor] = useState("");

    const nowTime = new Date();
    const colors = ["bg-red-500", "bg-blue-500", "bg-yellow-500", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-violet-500"];

    useEffect(() => {
        const time = nowTime.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: 'numeric',
            weekday: 'short',
            month: 'short',
        })
        setTime(time);
        const cookies = document.cookie.split(";");
        const targetCookie = cookies.find((cookie) => cookie.startsWith("authtoken="));
        const cookie = targetCookie ? targetCookie.split("=")[1] : null;
        const payload = JSON.parse(atob(cookie!.split(".")[1]));

        dispatch(setUserEmail(payload.email));
        dispatch(setUserName(payload.name));

        setColor(colors[Math.floor(Math.random() * colors.length)]);

        document.addEventListener("click", (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.classList.contains("box") && !target.classList.contains("box2") && !target.classList.contains("box3") && !target.classList.contains("box4") && !target.classList.contains("emailText") && !target.classList.contains("signOut")) {
                setVisible(false);
            }
        })
    }, [])

    const handleBoxVisible = () => {
        setVisible(!visible);
    }

    const signOut = async () => {
        const response = await fetch("http://localhost:4000/signOut", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        if (response.ok) {
            window.location.reload();
        }
    }

    return (
        <>
            <nav className='w-screen h-[10vh] relative flex justify-between items-center px-8 z-50'>
                <div className='flex justify-start items-center'>
                    <Logo />
                    <p className='text-xl font-semibold text-gray-500'> NexDesk </p>
                </div>

                <div className='flex justify-center items-center gap-4 relative'>
                    <p className='text-gray-600 text-xl'> {time} </p>
                    <button className={`box rounded-full cursor-pointer w-16 h-16 ${color} flex justify-center items-center text-2xl text-white`} onClick={handleBoxVisible}>
                        {username.toUpperCase().charAt(0)}
                    </button>
                    {
                        visible &&
                        <div className='box2 bg-white shadow-sm shadow-gray-300 flex justify-center items-center gap-4 rounded-md px-4 py-2 absolute top-20 right-0'>
                            <div className={`box3 rounded-full w-14 h-14 ${colors[Math.floor(Math.random() * colors.length)]} flex justify-center items-center text-2xl text-white`}> {username.toUpperCase().charAt(0)} </div>
                            <div className='box4 flex flex-col justify-center items-start'>
                                <p className='emailText text-gray-700 font-semibold'> {username} </p>
                                <button className='signOut text-red-600 font-medium text-sm mt-1' onClick={signOut}> Sign Out </button>
                                <div className='flex justify-start items-center gap-4 my-2'>
                                    <Link href={"./UpdateUser"}>
                                        <button className='px-2 py-1 hover:bg-blue-100 rounded-lg'>
                                            <DriveFileRenameOutlineRoundedIcon className='text-blue-600' />
                                        </button>
                                    </Link>
                                    <Link href={"./DeleteUser"}>
                                        <button className='px-2 py-1 hover:bg-red-100 rounded-lg'>
                                            <DeleteRoundedIcon className='text-red-600' />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </nav>
        </>
    )
}
