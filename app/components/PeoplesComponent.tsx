import React from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SendIcon from '@mui/icons-material/Send';
import { useAppSelector } from '../Redux/hooks';

export default function PeoplesComponent() {
    const functionality = useAppSelector(state => state.Functionality.functionality);

    return (
        <>
            <section className={`${functionality === 'users' ? 'opacity-100 h-[32rem] z-50' : 'opacity-0 h-0 -z-10'} w-80 bg-white shadow-md shadow-gray-400 absolute top-28 left-5 flex flex-col rounded-2xl overflow-hidden transition-all duration-500`}>
                <div className='flex justify-between items-center h-[12%] bg-blue-50 px-4 rounded-b-3xl border-b-2 border-b-gray-400'>
                    <p className='text-gray-500 font-semibold text-xl'> Peoples </p>
                    <CloseOutlinedIcon className='text-gray-700' />
                </div>

                <div className='w-full flex-grow px-4'>

                </div>

                <div className="flex items-center h-[15%] px-4">
                    <div className="relative w-full overflow-hidden">
                        <button className="absolute right-1 top-1/2  transform -translate-y-1/2 hover:bg-gray-300 w-12 h-4/5 rounded-full">
                            <SendIcon className="text-gray-500" />
                        </button>
                    </div>
                </div>

            </section>
        </>
    )
}
