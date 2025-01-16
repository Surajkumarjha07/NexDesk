import React, { useEffect, useState } from 'react'
import input from '../Interfaces/input'
import shape from '../Interfaces/shape'
import note from '../Interfaces/note'
import image from '../Interfaces/image'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import { toast } from "react-toastify";
import { setConfirmSaveWhiteboard } from '../Redux/slices/user'
import { useParams } from 'next/navigation'
import { setFunctionality } from '../Redux/slices/functionality'
import Cookies from 'js-cookie'

type saveInterface = {
    texts: input[],
    shapes: shape[],
    notes: note[],
    images: image[]
}

export default function Save({ texts, shapes, notes, images }: saveInterface) {
    const dispatch = useAppDispatch();
    const params = useParams();
    const [whiteboardName, setWhiteboardName] = useState(params.RoomCode);
    const isDarkMode = useAppSelector(state => state.DarkMode.isDarkMode);
    const [cookie, setCookie] = useState<string>("");

    useEffect(() => {
        const fetchedCookie = Cookies.get("authtoken");
        if (fetchedCookie) {
            setCookie(fetchedCookie);
        }
    }, [])

    const save = async () => {
        if (!whiteboardName) {
            toast.error("Enter whiteBoard name", {
                hideProgressBar: true,
                autoClose: 1500,
                type: 'error',
                position: 'top-center',
            });
            return;
        }
        
        try {
            const response = await fetch("https://nexdesk-backend.onrender.com/saveWhiteBoard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`
                },
                body: JSON.stringify({ meetingCode: whiteboardName, texts, shapes, notes, images }),
                credentials: "include"
            })

            if (response.status === 200 || response.ok) {
                toast.success("Whiteboard saved!", {
                    hideProgressBar: true,
                    autoClose: 1500,
                    type: 'success',
                    position: 'top-center',
                })
                dispatch(setConfirmSaveWhiteboard(false));
                dispatch(setFunctionality(""));
            }
            else {
                toast.error("Whiteboard not saved!", {
                    hideProgressBar: true,
                    autoClose: 1500,
                    type: 'error',
                    position: 'top-center',
                })
            }
        } catch (error) {
            console.error("error: ", error);
            toast.error("Something went wrong! Try again later", {
                hideProgressBar: true,
                autoClose: 1500,
                type: 'error',
                position: 'top-center',
            })
        }
    }

    const donotSave = () => {
        dispatch(setConfirmSaveWhiteboard(false));
        dispatch(setFunctionality(""));
    }

    const handleWhiteboardName = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        if (target) {
            setWhiteboardName(target.value.trim());
        }
    }

    return (
        <>
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit p-8 z-50 rounded-lg`}>
                <p className={`${isDarkMode ? "text-white" : "text-gray-700"} font-semibold`}>
                    Do you want to save it on cloud or in our database?
                </p>
                <input type="text" name="whiteboardName" className='border-2 border-gray-700 outline-none w-full px-4 py-2 mt-4 font-semibold text-gray-700 rounded-sm' placeholder='Enter whiteboard name' onChange={handleWhiteboardName} value={whiteboardName} />
                <div className='flex justify-center items-center gap-4 mt-4'>
                    <button className='text-white bg-blue-600 px-4 py-2 text-sm rounded-sm' onClick={save}> Save </button>
                    <button className='text-white bg-blue-600 px-4 py-2 text-sm rounded-sm' onClick={donotSave}> Don&apos;t Save </button>
                </div>
            </div>
        </>
    )
}
