import React, { useState } from 'react'
import input from '../Interfaces/input'
import shape from '../Interfaces/shape'
import note from '../Interfaces/note'
import image from '../Interfaces/image'
import { useAppDispatch } from '../Redux/hooks'
import { toast } from "react-toastify";
import { setConfirmSaveWhiteboard } from '../Redux/slices/user'
import { useParams } from 'next/navigation'

type saveInterface = {
    texts: input[],
    shapes: shape[],
    notes: note[],
    images: image[]
}

export default function Save({ texts, shapes, notes, images }: saveInterface) {
    const cookies = document.cookie.split(";");
    const targetCookie = cookies.find(cookie => cookie.startsWith("authtoken="));
    const cookie = targetCookie ? targetCookie.split("=")[1] : null;
    const dispatch = useAppDispatch();
    const params = useParams();
    const [whiteboardName, setWhiteboardName] = useState(params.RoomCode);

    const save = async () => {
        try {
            if (!whiteboardName) {
                toast.error("Enter whiteBoard name", {
                    hideProgressBar: true,
                    autoClose: 1500,
                    type: 'error',
                    position: 'top-center',
                });
                return;
            }
            const response = await fetch("http://localhost:4000/saveWhiteBoard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`
                },
                credentials: "include",
                body: JSON.stringify({ meetingCode: whiteboardName || 123, texts, shapes, notes, images })
            })

            if (response.ok) {
                toast.success("WhiteBoard Saved", {
                    hideProgressBar: true,
                    autoClose: 1500,
                    type: 'success',
                    position: 'top-center',
                })
                dispatch(setConfirmSaveWhiteboard(false));
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }

    const donotSave = () => {
        dispatch(setConfirmSaveWhiteboard(false));
    }

    const handleWhiteboardName = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        if (target) {
            setWhiteboardName(target.value.trim());
        }
    }

    return (
        <>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-fit h-fit p-8 z-50 rounded-lg'>
                <p className='text-gray-700 font-semibold'>
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
