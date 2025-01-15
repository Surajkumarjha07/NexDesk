"use client"
import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { setUserEmail, setUserName } from '../Redux/slices/user';
import { useRouter } from 'next/navigation';
import { setFetchedMeetingCode, setIsNewMeeting } from '../Redux/slices/meetingCode';
import { setOpenedWhiteboard } from '../Redux/slices/whiteboard';
import { toast } from 'react-toastify';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import OpenWithOutlinedIcon from '@mui/icons-material/OpenWithOutlined';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import { setIsDarkMode } from '../Redux/slices/darkMode';

export default function Navbar() {
    const [time, setTime] = useState('');
    const username = useAppSelector(state => state.UserCredential.username);
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);
    const [color, setColor] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cookie, setCookie] = useState<any>(null);
    const confirmSaveWhiteboard = useAppSelector(state => state.UserCredential.confirmSaveWhiteboard);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [whiteboards, setWhiteboards] = useState<any[]>([]);
    const [optionIndex, setOptionIndex] = useState(0);
    const router = useRouter();
    const [toggleMeets, setToggleMeets] = useState(false);
    const [color2, setColor2] = useState("");
    const isDarkMode = useAppSelector(state => state.DarkMode.isDarkMode);

    const nowTime = new Date();
    const colors = ["bg-red-500", "bg-blue-500", "bg-yellow-500", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-violet-500"];
    const colors2 = ["bg-red-200", "bg-blue-200", "bg-yellow-200", "bg-green-200", "bg-orange-200", "bg-pink-200", "bg-violet-200"];

    useEffect(() => {
        if (typeof document !== "undefined") {
            const cookies = document.cookie.split(";");
            const targetCookie = cookies.find(cookie => cookie.startsWith("authtoken="));
            const cookie = targetCookie && targetCookie.split("=")[1];
            setCookie(cookie);
            if (cookie) {
                try {
                    const payload = JSON.parse(atob(cookie.split(".")[1]));
                    if (payload.email && payload.name) {
                        dispatch(setUserEmail(payload.email));
                        dispatch(setUserName(payload.name));
                    }
                } catch (error) {
                    console.error("Error parsing the cookie: ", error);
                }
            }

            const time = nowTime.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                day: 'numeric',
                weekday: 'short',
                month: 'short',
            });
            setTime(time);

            setColor(colors[Math.floor(Math.random() * colors.length)]);
            setColor2(colors2[Math.floor(Math.random() * colors2.length)]);

            document.addEventListener("click", (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                if (!target.classList.contains("box") && !target.classList.contains("box2") && !target.classList.contains("box3") && !target.classList.contains("box4") && !target.classList.contains("emailText") && !target.classList.contains("signOut")) {
                    setVisible(false);
                }
            });
        }

        return () => {
            document.removeEventListener("click", () => { });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cookie, dispatch]);


    const handleBoxVisible = () => {
        setVisible(!visible);
    }

    const signOut = async () => {
        const response = await fetch("https://nexdesk-backend.onrender.com/signOut", {
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

    const getWhiteboards = async () => {
        try {
            const response = await fetch("https://nexdesk-backend.onrender.com/getWhiteboards", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`
                },
                credentials: "include"
            })

            if (response.ok) {
                const res = await response.json();
                setWhiteboards(res.whiteboards)
            }

        } catch (error) {
            console.error("error: ", error);
        }
    }

    useEffect(() => {
        getWhiteboards();

        document.addEventListener("click", (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.classList.contains("openOption")) {
                setShowOptions(false);
            }
            else {
                setShowOptions(true);
            }
        })
        setColor(colors[Math.floor(Math.random() * 7)]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [confirmSaveWhiteboard])

    const openOptions = (index: number) => {
        setShowOptions(true);
        setOptionIndex(index);
    }

    const openWhiteboard = async (e: React.MouseEvent) => {
        const target = e.target as HTMLDivElement;
        const meetCode = target.parentElement?.parentElement?.childNodes[0].textContent;
        dispatch(setFetchedMeetingCode(meetCode));
        dispatch(setIsNewMeeting(false));
        try {
            const response = await fetch(`https://nexdesk-backend.onrender.com/openWhiteboard?meetingCode=${meetCode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`
                },
                credentials: "include"
            })

            if (response.ok) {
                const res = await response.json();
                dispatch(setOpenedWhiteboard(res.whiteboard));

                toast.success("New whiteboard opening up!", {
                    hideProgressBar: true,
                    autoClose: 1500,
                    type: 'success',
                    position: 'top-center',
                });
                router.push(`./CanvasPage/${meetCode?.trim()}`);
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }

    const deleteWhiteboard = async (e: React.MouseEvent) => {
        const target = e.target as HTMLDivElement;
        const meetCode = target.parentElement?.parentElement?.childNodes[0].textContent;

        const response = await fetch("https://nexdesk-backend.onrender.com/deleteWhiteboard", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookie}`
            },
            body: JSON.stringify({ meetingCode: meetCode }),
            credentials: "include"
        })

        if (response.ok) {
            toast.success("Whiteboard deleted!", {
                hideProgressBar: true,
                autoClose: 1500,
                type: 'success',
                position: 'top-center',
            });
            getWhiteboards();
        }
        else {
            toast.error("Failed to delete!", {
                hideProgressBar: true,
                autoClose: 1500,
                type: 'error',
                position: 'top-center',
            });
        }
    }

    const closeSidebar = () => {
        setToggleMeets(false);
    }

    const openSidebar = () => {
        setToggleMeets(true);
    }

    const enableDarkMode = () => {
        dispatch(setIsDarkMode(!isDarkMode));
    }

    return (
        <>
            <nav className='w-screen h-[10vh] relative flex justify-between items-center px-8 z-50'>
                <div className='flex justify-start items-center'>
                    <Logo />
                    <p className={`${isDarkMode ? "text-gray-200" : "text-gray-500"} text-xl font-semibold`}> NexDesk </p>
                </div>

                <div className='flex justify-center items-center gap-4 relative'>
                    <button className={isDarkMode ? 'p-2 rounded-md' : 'p-2 rounded-md'} name='isDarkMode' onClick={enableDarkMode}>
                        <Brightness4OutlinedIcon className={`pointer-events-none w-8 h-8 ${isDarkMode ? "text-white" : "text-black"}`} />
                    </button>

                    <div className='relative'>
                        <button className={`p-2 rounded-md ${toggleMeets ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-600"}` : `${isDarkMode ? "hover:bg-gray-600" : "hover:bg-blue-200"}`}`} name='saves' onClick={openSidebar}>
                            <FolderSpecialRoundedIcon className={`pointer-events-none w-8 h-8 ${toggleMeets ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} />
                        </button>

                        <aside className={`${isDarkMode ? "bg-gray-800 shadow-none" : "bg-white shadow-sm shadow-gray-400 "} absolute top-14 right-1/2 transform translate-x-1/2 px-6 ${toggleMeets ? 'opacity-100 h-[32rem] z-50' : 'opacity-0 h-0 -z-10'} w-80 flex flex-col rounded-2xl overflow-hidden transition-all duration-500`}>
                            <div className='flex justify-between items-center h-[12%]'>
                                <p className={`${isDarkMode ? "text-white" : "text-gray-700"} text-gray-700 font-medium text-xl`}> Saved Meetings </p>
                                <button onClick={closeSidebar}>
                                    <CloseOutlinedIcon className={`${isDarkMode ? "text-white" : "text-gray-800"}`} />
                                </button>
                            </div>
                            {
                                whiteboards.length !== 0 ?
                                    (
                                        whiteboards.map((whiteboard, index) => (
                                            <div className={`relative my-2 w-full h-fit flex justify-between items-center rounded-md py-2 px-4 ${color2}`} key={index} >
                                                <p className='text-gray-800 text-sm font-semibold'> {whiteboard.meetingCode} </p>
                                                <button className='openOption' onClick={() => openOptions(index)}>
                                                    <MoreVertRoundedIcon className='text-gray-800 font-semibold pointer-events-none' />
                                                </button>
                                                {
                                                    (optionIndex === index && showOptions) &&
                                                    <div className='absolute flex justify-center items-center w-fit h-fit top-10 right-0 bg-white rounded-md px-2 py-1 shadow-sm shadow-gray-400 z-40'>
                                                        <button className='w-full text-xs font-semibold text-blue-600 hover:bg-gray-200 px-2 py-1 rounded-md' onClick={openWhiteboard}>
                                                            <OpenWithOutlinedIcon className='pointer-events-none' />
                                                        </button>
                                                        <button className='w-full text-xs font-semibold text-red-600 hover:bg-red-200 px-2 py-1 rounded-md' onClick={deleteWhiteboard}>
                                                            <DeleteRoundedIcon className='pointer-events-none' />
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                        ))
                                    )
                                    : <p className='m-auto text-gray-500 text-xl font-bold'> No saved whiteboard data </p>
                            }
                        </aside>
                    </div>

                    <p className={`${isDarkMode ? "text-white" : "text-gray-600"} text-xl`}> {time} </p>
                    <button className={`box rounded-full cursor-pointer w-16 h-16 ${color} flex justify-center items-center text-2xl text-white`} onClick={handleBoxVisible}>
                        {username.toUpperCase().charAt(0)}
                    </button>
                    {
                        visible &&
                        <div className='box2 bg-white shadow-sm shadow-gray-300 flex justify-center items-center gap-4 rounded-md px-4 py-2 absolute top-20 right-0'>
                            <div className={`box3 rounded-full w-14 h-14 ${color} flex justify-center items-center text-2xl text-white`}> {username.toUpperCase().charAt(0)} </div>
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
