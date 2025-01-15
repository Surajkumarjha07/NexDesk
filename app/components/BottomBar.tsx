"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { setFunctionality } from '../Redux/slices/functionality';
import Shapes from './shapes';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { setEraser } from '../Redux/slices/Eraser';
import { setImages } from '../Redux/slices/images';
import { useSocket } from '../socketContext';
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded';
import { setConfirmSaveWhiteboard } from '../Redux/slices/user';

export default function BottomBar() {
    const dispatch = useAppDispatch();
    const shapeType = useAppSelector(state => state.ShapeFeatures.shapeType);
    const functionality = useAppSelector(state => state.Functionality.functionality);
    const images = useAppSelector(state => state.ImageFeatures.images);
    const imgBrightness = useAppSelector(state => state.ImageFeatures.imageBrightness);
    const imgContrast = useAppSelector(state => state.ImageFeatures.imageContrast);
    const imgSaturation = useAppSelector(state => state.ImageFeatures.imageSaturation);
    const socket = useSocket();
    const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);
    const isDarkMode = useAppSelector(state => state.DarkMode.isDarkMode);

    const handleActive = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement;
        dispatch(setFunctionality(target.name));
        if (target.name === "save") {
            dispatch(setConfirmSaveWhiteboard(true));
        }
        if (target.name === 'eraser') {
            dispatch(setEraser(true));
        }
        else {
            dispatch(setEraser(false));
        }
    }

    const handleImage = (e: React.ChangeEvent) => {
        const xPosition = Math.floor(Math.random() * 500);
        const YPosition = Math.floor(Math.random() * 200);
        dispatch(setFunctionality('images'))
        const target = e.target as HTMLInputElement;
        const file = target.files![0];
        let result;
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                result = e.target!.result;
                if (typeof result === 'string') {
                    dispatch(setImages({
                        id: images.length + 1, x: xPosition, y: YPosition, src: result, width: 300, height: 300, brightness: imgBrightness, contrast: imgContrast, saturation: imgSaturation, modify: false
                    }))
                }
                if (socket && result) {
                    socket.emit("imageDraw", { meetingCode, id: images.length + 1, x: xPosition, y: YPosition, src: result, width: 300, height: 300, brightness: imgBrightness, contrast: imgContrast, saturation: imgSaturation, modify: false })
                }
            }
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleImageDrawed = (data: any) => {
            const { id, x, y, src, width, height, brightness, contrast, saturation, modify } = data;
            dispatch(setImages({
                id, x, y, src, width, height, brightness, contrast, saturation, modify
            })
            )
        }

        if (socket) {
            socket.on("imageDrawed", handleImageDrawed);
        }

        return () => {
            if (socket) {
                socket.off("imageDrawed", handleImageDrawed);
            }
        }
    }, [socket, dispatch, images])

    return (
        <>
            <section className={`${isDarkMode ? "bg-gray-800 shadow-none" : "bg-white shadow-sm shadow-gray-400"} w-2/4 h-16 rounded-md absolute bottom-10 left-1/2 transform -translate-x-1/2 flex justify-evenly items-center gap-8 z-40`}>
                <button className={`p-2 rounded-md ${functionality === "arrow" ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-700"}` : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-200"}`}`} name='arrow' onClick={handleActive}>
                    <NearMeOutlinedIcon className={`pointer-events-none ${functionality === "arrow" ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} />
                </button>
                <button className={`p-2 rounded-md ${functionality === "hand" ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-700"}` : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-200"}`}`} name='hand' onClick={handleActive}>
                    <BackHandOutlinedIcon className={`pointer-events-none ${functionality === "hand" ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} />
                </button>
                <button className={`p-2 rounded-md ${functionality === "eraser" ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-700"}` : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-200"}`}`} name='eraser' onClick={handleActive}>
                    {
                        <Image
                            src={
                                !isDarkMode
                                    ? (functionality === "eraser" ? "/Images/eraser2.png" : "/Images/eraser.png")
                                    : (functionality === "eraser" ? "/Images/eraser2.png" : "/Images/eraser2.png")
                            }
                            alt="Eraser"
                            height={100}
                            width={100}
                            className="w-6 h-6 pointer-events-none"
                        />
                    }
                </button>
                <button className={`p-2 rounded-md ${functionality === "text" ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-700"}` : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-200"}`}`} name='text' onClick={handleActive}>
                    <FormatItalicOutlinedIcon className={`pointer-events-none ${functionality === "text" ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} />
                </button>
                <button className={`p-2 rounded-md ${functionality === "notes" ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-700"}` : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-200"}`}`} name='notes' onClick={handleActive}>
                    <StickyNote2OutlinedIcon className={`pointer-events-none ${functionality === "notes" ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} />
                </button>
                <button className={`p-2 rounded-md ${functionality === "images" ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-700"}` : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-200"}`}`} name='images' onClick={handleActive}>
                    <div className='w-fit h-fit relative'>
                        <PhotoOutlinedIcon className={`pointer-events-none ${functionality === "images" ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} />
                        <input type="file" name="imageFile" onChange={handleImage} className='w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer' />
                    </div>
                </button>
                <button className={`p-2 rounded-md ${functionality === "shapes" ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-700"}` : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-200"}`}`} name='shapes' onClick={handleActive}>
                    {
                        shapeType === "rectangle" ? <RectangleOutlinedIcon className={`pointer-events-none ${functionality === "shapes" ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} /> : <CircleOutlinedIcon className={`pointer-events-none ${functionality === "shapes" ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} />
                    }
                </button>

                <div className='relative'>
                    {
                        functionality === "upArrow" ?
                            <Shapes /> : ''
                    }
                    <button className={`p-2 rounded-md ${functionality === "upArrow" ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-700"}` : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-200"}`}`} name='upArrow' onClick={handleActive}>
                        <KeyboardArrowUpOutlinedIcon className={`pointer-events-none ${functionality === "upArrow" ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} />
                    </button>
                </div>

                <button className={`p-2 rounded-md ${functionality === "save" ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-700"}` : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-200"}`}`} name='save' onClick={handleActive}>
                    <FolderSpecialRoundedIcon fontSize='large' className={`pointer-events-none ${functionality === "save" ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} />
                </button>
            </section>
        </>
    )
}
