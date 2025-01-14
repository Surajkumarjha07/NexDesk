"use client"
import React from 'react'
import Image from 'next/image'
import { useAppDispatch } from '../Redux/hooks'
import { setNoteTextSize, setNoteTextAlign } from '../Redux/slices/noteFeatures';
import { setNoteFontFamily } from '../Redux/slices/noteFeatures';

export default function NotesBottomComponent() {
    const dispatch = useAppDispatch();

    function TextSize(e: React.MouseEvent) {
        const target = e.target as HTMLButtonElement;
        dispatch(setNoteTextSize(target.name));
    }

    function FontFamily(e: React.MouseEvent) {
        const target = e.target as HTMLButtonElement;
        dispatch(setNoteFontFamily(target.name));
    }

    function textAlign(e: React.MouseEvent) {
        const target = e.target as HTMLButtonElement;
        if (target && target.name) {
            dispatch(setNoteTextAlign(target.name));
        };
    }

    return (
        <>
            <div className='flex flex-col justify-between gap-1 relative'>
                <div className='flex justify-center items-center gap-8'>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md' name='text-3xl' onClick={TextSize}> S </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md' name='text-4xl' onClick={TextSize}> M </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md' name='text-5xl' onClick={TextSize}> L </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md' name='text-6xl' onClick={TextSize}> XL </button>
                </div>

                <div className='flex justify-center items-center gap-8'>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md drawFont' name='font-extrabold' onClick={FontFamily}> Aa </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md font-sans' name='font-sans' onClick={FontFamily}> Aa </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md font-serif' name='font-serif' onClick={FontFamily}> Aa </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md font-mono' name='font-mono' onClick={FontFamily}> Aa </button>
                </div>

                <div className='flex justify-center items-center gap-8'>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md' name='text-start' onClick={textAlign}>
                        <Image src={'/Images/alignLeft.png'} alt='right' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md' name='text-center' onClick={textAlign}>
                        <Image src={'/Images/alignCenter.png'} alt='right' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md' name='text-end' onClick={textAlign}>
                        <Image src={'/Images/alignRight.png'} alt='right' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                </div>
            </div>
        </>
    )
}
