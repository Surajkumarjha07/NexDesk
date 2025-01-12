// import React from 'react'
// import input from '../Interfaces/input'
// import shape from '../Interfaces/shape'
// import note from '../Interfaces/note'
// import image from '../Interfaces/image'
// import { useAppSelector } from '../Redux/hooks'

// type saveInterface = {
//     texts: input[],
//     shapes: shape[],
//     notes: note[],
//     images: image[]
// }

// export default function Save({texts, shapes, notes, images}: saveInterface) {
//     const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);
//     const save = () => {
        
//     }

//     const donotSave = () => {
//         // set
//     }

//     return (
//         <>
//             <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-fit h-fit p-8 z-50 rounded-lg'>
//                 <p className='text-gray-700 font-semibold'>
//                     Do you want to save it on cloud or in our database?
//                 </p>
//                 <div className='flex justify-center items-center gap-4 mt-4'>
//                     <button className='text-white bg-blue-600 px-2 py-1 text-sm rounded-sm' onClick={save}> Save </button>
//                     <button className='text-white bg-blue-600 px-2 py-1 text-sm rounded-sm' onClick={donotSave}> Don't Save </button>
//                 </div>
//             </div>
//         </>
//     )
// }
