import React from 'react'
import Image from 'next/image'
import { useAppDispatch } from '../Redux/hooks';
import { setBorderType, setPatternType } from '../Redux/slices/shapes';

export default function BottomComponent() {
    const dispatch = useAppDispatch()

    const handlePatternType = (e: React.MouseEvent) => {
        let target = e.target as HTMLButtonElement;
        if (target) {
            dispatch(setPatternType(target.name));
        }
    }

    const handleBorderType = (e: React.MouseEvent) => {
        let target = e.target as HTMLButtonElement;
        if (target) {
            dispatch(setBorderType(target.name));
        }
    }

    return (
        <>
            <div className='flex flex-col justify-between gap-1'>
                <div className='flex justify-center items-center gap-8'>
                    <button className='hover:bg-gray-200 p-2 rounded-md' name='transparent' onClick={handlePatternType}>
                        <Image src={'/Images/square1.png'} alt='square' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                    <button className='hover:bg-gray-200 p-2 rounded-md' name='opaque' onClick={handlePatternType}>
                        <Image src={'/Images/square2.png'} alt='square' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                    <button className='hover:bg-gray-200 p-2 rounded-md' name='coloured' onClick={handlePatternType}>
                        <Image src={'/Images/square3.png'} alt='square' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                    <button className='hover:bg-gray-200 p-2 rounded-md' name='dashed' onClick={handlePatternType}>
                        <Image src={'/Images/square4.png'} alt='square' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                </div>

                <div className='flex justify-center items-center gap-8'>
                    <button className='hover:bg-gray-200 p-2 rounded-md' name='roundedBorder' onClick={handleBorderType}>
                        <Image src={'/Images/boldCircle.png'} alt='square' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                    <button className='hover:bg-gray-200 p-2 rounded-md' name='dashedBorder' onClick={handleBorderType}>
                        <Image src={'/Images/tracedCircle.png'} alt='square' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                    <button className='hover:bg-gray-200 p-2 rounded-md' name='dottedBorder' onClick={handleBorderType}>
                        <Image src={'/Images/dottedCircle.png'} alt='square' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                    <button className='hover:bg-gray-200 p-2 rounded-md' name='solidBorder' onClick={handleBorderType}>
                        <Image src={'/Images/circle.png'} alt='square' height={100} width={100} className='w-6 h-6 pointer-events-none' />
                    </button>
                </div>

                <div className='flex justify-center items-center gap-8'>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md'> S </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md'> M </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md'> L </button>
                    <button className='text-2xl text-black font-semibold hover:bg-gray-200 py-1 px-2 rounded-md'> XL </button>
                </div>
            </div>
        </>
    )
}
