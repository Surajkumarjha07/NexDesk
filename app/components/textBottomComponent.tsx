import React, { useState } from 'react'
import Image from 'next/image'
import { useAppDispatch } from '../Redux/hooks';
import { setTextAlign, setTextSize } from '../Redux/slices/textFeatures';
import { setFontFamily } from '../Redux/slices/textFeatures';

export default function TextBottomComponent() {
    const dispatch = useAppDispatch();

    function TextSize(e: React.MouseEvent<HTMLButtonElement>) {
        let target = e.currentTarget
        if (target && target.name) {
            dispatch(setTextSize(target.name))
        }
    }

    function FontFamily(e: React.MouseEvent<HTMLButtonElement>) {
        let target = e.currentTarget;
        if (target && target.name) {
            dispatch(setFontFamily(target.name))
        }
    }

    function textAlign(e: React.MouseEvent) {
        let target = e.target as HTMLButtonElement;
        if (target && target.name) {
            dispatch(setTextAlign(target.name));
        }
    }

    return (
        <>
            <div className='flex flex-col justify-between gap-1'>
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
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md' name='text-start' onClick={textAlign} >
                        <Image src={'/Images/alignLeftText.png'} alt='right' height={100} width={100} className='w-6 h-6 pointer-events-none'/>
                    </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md' name='text-center' onClick={textAlign}>
                        <Image src={'/Images/alignCenterText.png'} alt='right' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md' name='text-end' onClick={textAlign}>
                        <Image src={'/Images/alignRightText.png'} alt='right' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md pointer-events-none'>
                        <Image src={'/Images/upArrow2.png'} alt='right' height={100} width={100} className='w-4 h-4' />
                    </button>
                </div>
            </div>
        </>
    )
}
