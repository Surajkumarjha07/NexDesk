import React from 'react'

export default function Background() {
    return (
        <>
            <section className='w-screen h-screen bg-white backdrop-blur-3xl bg-opacity-90 z-0 fixed top-0 right-0 left-0 bottom-0'></section>
            <section className='w-screen h-screen grid grid-cols-2 grid-rows-2 gap-10 -z-10 p-10 fixed'>
                <div className='w-full h-full bg-orange-500 rounded-3xl'> </div>
                <div className='w-full h-full bg-green-500 rounded-3xl'> </div>
                <div className='w-full h-full bg-blue-400 rounded-3xl'> </div>
                <div className='w-full h-full bg-yellow-400 rounded-3xl'> </div>
            </section>
        </>
    )
}
