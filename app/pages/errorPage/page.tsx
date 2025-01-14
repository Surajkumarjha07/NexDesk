import Image from 'next/image'
import React from 'react'

export default function ErrorPage() {
    return (
        <>
        <div className='relative w-screen h-screen bg-white text-center text-4xl text-gray-700 font-bold flex flex-col justify-center items-center gap-7'>
            <Image src={"/Images/error.png"} alt='Error' width={100} height={100}/>
            The page is accessible for large systems only.
        </div>
        </>
    )
}
