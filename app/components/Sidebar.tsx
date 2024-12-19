"use client"
import React from 'react'
import BottomComponent from './bottomComponent'
import TextBottomComponent from './textBottomComponent';
import NotesBottomComponent from './notesBottomComponent';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { setTextBrightness, setTextColor } from '../Redux/slices/textFeatures';
import { setNoteBackgroundColor, setNoteTextBrightness } from '../Redux/slices/noteFeatures';
import { setShapeColor, setShapeOpacity } from '../Redux/slices/shapes';
import { setColor, setPencilThickness } from '../Redux/slices/pencil';
import { setImageBrightness, setImageContrast, setImageSaturation } from '../Redux/slices/images';

export default function Sidebar() {
    const dispatch = useAppDispatch();
    const functionality = useAppSelector(state => state.Functionality.functionality);
    const selectedItem = useAppSelector(state => state.SelectedItem.selectedItem);

    const handleColorChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        let target = e.target as HTMLButtonElement;
        dispatch(setTextColor(target.name));
        dispatch(setNoteBackgroundColor(target.name))
        dispatch(setShapeColor(target.name))
        dispatch(setColor(target.name))
    }

    const handleBrightness = (e: React.ChangeEvent) => {
        let target = e.target as HTMLInputElement;
        let value: number = parseInt(target.value) * 5;
        let PencilValue = parseInt(target.value);
        dispatch(setTextBrightness(value));
        dispatch(setNoteTextBrightness(value));
        dispatch(setShapeOpacity(value));
        dispatch(setPencilThickness(PencilValue));
    }

    const handleImgBrightness = (e: React.ChangeEvent) => {
        let target = e.target as HTMLInputElement;
        let imgBrightness = parseInt(target.value) * 0.5;
        dispatch(setImageBrightness(imgBrightness));
    }

    const handleImgContrast = (e: React.ChangeEvent) => {
        let target = e.target as HTMLInputElement;
        let imgContrast = parseInt(target.value) * 0.5;
        dispatch(setImageContrast(imgContrast));
    }

    const handleImgSaturation = (e: React.ChangeEvent) => {
        let target = e.target as HTMLInputElement;
        let imgSaturation = parseInt(target.value) * 50;
        dispatch(setImageSaturation(imgSaturation));
    }

    return (
        <>
            <aside className={`bg-white w-80 h-fit shadow-md shadow-gray-400 rounded-md absolute top-8 right-5 px-4 py-5 z-30 ${(functionality == "hand" || functionality == "eraser") ? 'hidden' : 'flex'} flex-col justify-evenly`}>
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
                            <input type="range" min={1} max={5} defaultValue={2} name="brightness" className='w-full' onChange={handleImgBrightness} />
                        </div> :

                        <div className='mt-4'>
                            <input type="range" min={1} max={20} defaultValue={functionality === 'pencil' || functionality === "upRightArrow" ? 5 : 20} name="thickness" className='w-full' onChange={handleBrightness} />
                        </div>
                }

                {
                    (selectedItem === "image" && functionality === "arrow") &&
                    <div className='mt-2'>
                        <p className='text-gray-600 font-medium text-sm'> Contrast </p>
                        <input type="range" min={1} max={5} defaultValue={2} name="contrast" className='w-full' onChange={handleImgContrast} />
                    </div>
                }

                {
                    (selectedItem === "image" && functionality === "arrow") &&
                    <div className='mt-2'>
                        <p className='text-gray-600 font-medium text-sm'> Saturation </p>
                        <input type="range" min={1} max={5} defaultValue={2} name="contrast" className='w-full' onChange={handleImgSaturation} />
                    </div>
                }

                <hr />

                {
                    functionality === "text" ?
                        <TextBottomComponent /> :
                        functionality === "notes" ?
                            <NotesBottomComponent /> :
                            <BottomComponent />
                }

            </aside>
        </>
    )
}
