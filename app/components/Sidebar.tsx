"use client"
import React from 'react'
import BottomComponent from './bottomComponent'
import TextBottomComponent from './textBottomComponent';
import NotesBottomComponent from './notesBottomComponent';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { setTextBrightness, setTextColor } from '../Redux/slices/textFeatures';
import { setNoteBackgroundColor, setNoteTextBrightness } from '../Redux/slices/noteFeatures';
import { setShapeColor, setShapeOpacity } from '../Redux/slices/shapes';
import { setImageBrightness, setImageContrast, setImageSaturation } from '../Redux/slices/images';
import { Box, Slider } from '@mui/material';

export default function Sidebar() {
    const dispatch = useAppDispatch();
    const functionality = useAppSelector(state => state.Functionality.functionality);
    const selectedItem = useAppSelector(state => state.SelectedItem.selectedItem);
    const isDarkMode = useAppSelector(state => state.DarkMode.isDarkMode);

    const handleColorChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement;
        dispatch(setTextColor(target.name));
        dispatch(setNoteBackgroundColor(target.name))
        dispatch(setShapeColor(target.name))
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleBrightness = (event: Event, value: number | number[], activeThumb: number) => {
        if (typeof value === "number") {
            const finalValue = value * 5;
            dispatch(setTextBrightness(finalValue));
            dispatch(setNoteTextBrightness(finalValue));
            dispatch(setShapeOpacity(finalValue));
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleImgBrightness = (event: Event, value: number | number[], activeThumb: number) => {
        if (typeof value === "number") {
            const imgBrightness = value * 0.5;
            dispatch(setImageBrightness(imgBrightness));
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleImgContrast = (event: Event, value: number | number[], activeThumb: number) => {
        if (typeof value === "number") {
            const imgContrast = value * 0.5;
            dispatch(setImageContrast(imgContrast));
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleImgSaturation = (event: Event, value: number | number[], activeThumb: number) => {
        if (typeof value === "number") {
            const imgSaturation = value * 50;
            dispatch(setImageSaturation(imgSaturation));
        }
    }

    return (
        <>
            <aside className={`bg-white w-80 h-fit ${isDarkMode ? "shadow-none" : "shadow-gray-400 shadow-sm"} rounded-md absolute top-8 right-5 px-4 py-5 z-30 ${(functionality == "hand" || functionality == "eraser") ? 'hidden' : 'flex'} flex-col justify-evenly`}>
                <div className='flex justify-center gap-8 flex-wrap'>
                    <button className='bg-black rounded-full w-7 h-7' name='black' onClick={handleColorChange} />
                    <button className='bg-gray-500 rounded-full w-7 h-7' name='gray-500' onClick={handleColorChange} />
                    <button className='bg-purple-400 rounded-full w-7 h-7' name='purple-400' onClick={handleColorChange} />
                    <button className='bg-purple-600 rounded-full w-7 h-7' name='purple-600' onClick={handleColorChange} />
                    <button className='bg-blue-600 rounded-full w-7 h-7' name='blue-600' onClick={handleColorChange} />
                    <button className='bg-blue-400 rounded-full w-7 h-7' name='blue-400' onClick={handleColorChange} />
                    <button className='bg-yellow-400 rounded-full w-7 h-7' name='yellow-400' onClick={handleColorChange} />
                    <button className='bg-orange-600 rounded-full w-7 h-7' name='orange-600' onClick={handleColorChange} />
                    <button className='bg-green-600 rounded-full w-7 h-7' name='green-600' onClick={handleColorChange} />
                    <button className='bg-green-400 rounded-full w-7 h-7' name='green-400' onClick={handleColorChange} />
                    <button className='bg-red-400 rounded-full w-7 h-7' name='red-400' onClick={handleColorChange} />
                    <button className='bg-red-600 rounded-full w-7 h-7' name='red-600' onClick={handleColorChange} />
                    <button className='bg-pink-400 rounded-full w-7 h-7' name='pink-400' onClick={handleColorChange} />
                    <button className='bg-pink-600 rounded-full w-7 h-7' name='pink-600' onClick={handleColorChange} />
                    <button className='bg-lime-500 rounded-full w-7 h-7' name='lime-500' onClick={handleColorChange} />
                    <button className='bg-cyan-600 rounded-full w-7 h-7' name='cyan-600' onClick={handleColorChange} />
                    <button className='bg-cyan-400 rounded-full w-7 h-7' name='cyan-400' onClick={handleColorChange} />
                    <button className='bg-indigo-500 rounded-full w-7 h-7' name='indigo-500' onClick={handleColorChange} />
                </div>

                {
                    (selectedItem === "image" && functionality === "arrow") ?
                        <div className='mt-4'>
                            <p className='text-gray-600 font-medium text-sm'> Brightness </p>
                            <Box sx={{ width: "auto" }}>
                                <Slider
                                    aria-label="brightness"
                                    defaultValue={2}
                                    name='brightness'
                                    color="primary"
                                    min={1}
                                    max={5}
                                    onChange={handleImgBrightness}
                                />
                            </Box>
                        </div> :

                        <div className='mt-4'>
                            <Box sx={{ width: "auto" }}>
                                <Slider
                                    aria-label="thickness"
                                    defaultValue={20}
                                    name='thickness'
                                    color="primary"
                                    min={1}
                                    max={20}
                                    onChange={handleBrightness}
                                />
                            </Box>
                        </div>
                }

                {
                    (selectedItem === "image" && functionality === "arrow") &&
                    <div className='mt-2'>
                        <p className='text-gray-600 font-medium text-sm'> Contrast </p>
                        <Box sx={{ width: "auto" }}>
                            <Slider
                                aria-label="contrast"
                                defaultValue={2}
                                name='contrast'
                                color="primary"
                                min={1}
                                max={5}
                                onChange={handleImgContrast}
                            />
                        </Box>
                    </div>
                }

                {
                    (selectedItem === "image" && functionality === "arrow") &&
                    <div className='mt-2'>
                        <p className='text-gray-600 font-medium text-sm'> Saturation </p>
                        <Box sx={{ width: "auto" }}>
                            <Slider
                                aria-label="saturation"
                                defaultValue={2}
                                name='saturation'
                                color="primary"
                                min={1}
                                max={5}
                                onChange={handleImgSaturation}
                            />
                        </Box>
                    </div>
                }

                <hr />

                {
                    (functionality === "text" || selectedItem === "text") ?
                        <TextBottomComponent /> :
                        (functionality === "notes" || selectedItem === "note") ?
                            <NotesBottomComponent /> :
                            !(selectedItem === "image") ?
                                <BottomComponent /> : null
                }

            </aside>
        </>
    )
}
