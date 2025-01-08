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
import ChangeHistoryOutlinedIcon from '@mui/icons-material/ChangeHistoryOutlined';
import { setEraser } from '../Redux/slices/Eraser';
import { setImages } from '../Redux/slices/images';
import { useSocket } from '../socketContext';

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

    const handleActive = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement;
        dispatch(setFunctionality(target.name));
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
            console.log(data);
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
            <section className='w-2/4 h-16 bg-white rounded-md shadow-md shadow-gray-400 absolute bottom-10 left-1/2 transform -translate-x-1/2 flex justify-evenly items-center gap-8 z-40'>
                <button className={functionality === "arrow" ? 'bg-blue-500 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='arrow' onClick={handleActive}>
                    <NearMeOutlinedIcon className={functionality !== "arrow" ? 'text-black pointer-events-none' : 'text-white pointer-events-none'} />
                </button>
                <button className={functionality === "hand" ? 'bg-blue-500 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='hand' onClick={handleActive}>
                    <BackHandOutlinedIcon className={functionality !== "hand" ? 'text-black pointer-events-none' : 'text-white pointer-events-none'} />
                </button>
                {/* <button className={functionality === "pencil" ? 'bg-blue-500 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='pencil' onClick={handleActive}>
                    <CreateOutlinedIcon className={functionality !== "pencil" ? 'text-black pointer-events-none' : 'text-white pointer-events-none'} />
                </button> */}
                <button className={functionality === "eraser" ? 'bg-blue-500 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='eraser' onClick={handleActive}>
                    {
                        functionality === "eraser" ?
                            <Image src={'/Images/eraser2.png'} alt='Eraser' height={100} width={100} className='w-6 h-6 pointer-events-none' /> :
                            <Image src={'/Images/eraser.png'} alt='Eraser' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    }
                </button>
                {/* <button className={functionality === "upRightArrow" ? 'bg-blue-500 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='upRightArrow' onClick={handleActive}>
                    <ArrowOutwardOutlinedIcon className={functionality !== "upRightArrow" ? 'text-black pointer-events-none' : 'text-white pointer-events-none'} />
                </button> */}
                <button className={functionality === "text" ? 'bg-blue-500 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='text' onClick={handleActive}>
                    <FormatItalicOutlinedIcon className={functionality !== "text" ? 'text-black pointer-events-none' : 'text-white pointer-events-none'} />
                </button>
                <button className={functionality === "notes" ? 'bg-blue-500 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='notes' onClick={handleActive}>
                    <StickyNote2OutlinedIcon className={functionality !== "notes" ? 'text-black pointer-events-none' : 'text-white pointer-events-none'} />
                </button>
                <button className={functionality === "images" ? 'bg-blue-500 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='images' onClick={handleActive}>
                    <div className='w-fit h-fit relative'>
                        <PhotoOutlinedIcon className={functionality !== "images" ? 'text-black pointer-events-none' : 'text-white pointer-events-none'} />
                        <input type="file" name="imageFile" onChange={handleImage} className='w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer' />
                    </div>
                </button>
                <button className={functionality === "shapes" ? 'bg-blue-500 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='shapes' onClick={handleActive}>
                    {
                        shapeType === "rectangle" ? <RectangleOutlinedIcon className={`${functionality === 'shapes' ? 'text-white' : 'text-black'} pointer-events-none`} /> : shapeType === "circle" ? <CircleOutlinedIcon className={`${functionality === 'shapes' ? 'text-white' : 'text-black'} pointer-events-none`} /> : shapeType === "triangle" ? <ChangeHistoryOutlinedIcon className={`${functionality === 'shapes' ? 'text-white' : 'text-black'} pointer-events-none`} /> : null
                    }
                </button>

                <div className='relative'>
                    {
                        functionality === "upArrow" ?
                            <Shapes /> : ''
                    }
                    <button className={functionality === "upArrow" ? 'bg-blue-500 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='upArrow' onClick={handleActive}>
                        <KeyboardArrowUpOutlinedIcon className={functionality !== "upArrow" ? 'text-black pointer-events-none' : 'text-white pointer-events-none'} />
                    </button>
                </div>
            </section>
        </>
    )
}
