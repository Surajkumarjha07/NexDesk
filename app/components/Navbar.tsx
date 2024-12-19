"use client"
import React, { useEffect, useState } from 'react'
import Logo from './Logo'

export default function Navbar() {
    const [time, setTime] = useState('')

    const nowTime = new Date();

    useEffect(() => {
        const time = nowTime.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: 'numeric',
            weekday: 'short',
            month: 'short',
        })
        setTime(time)
    }, [])

    return (
        <>
            <nav className='w-screen h-[10vh] relative flex justify-between items-center px-8'>
                <div className='flex justify-start items-center'>
                    <Logo />
                    <p className='text-xl font-semibold text-gray-500'> NexDesk </p>
                </div>

                <div className='flex justify-center items-center gap-4'>
                    <p className='text-gray-600 text-xl'> {time} </p>
                    <div className='rounded-full w-16 h-16 bg-gray-300'>

                    </div>
                </div>
            </nav>
        </>
    )
}
