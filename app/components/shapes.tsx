import React from 'react'
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import ChangeHistoryOutlinedIcon from '@mui/icons-material/ChangeHistoryOutlined';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import { useAppDispatch } from '../Redux/hooks';
import { setShapeType } from '../Redux/slices/shapes';

export default function Shapes() {
    const dispatch = useAppDispatch();

    const selectShape = (e: React.MouseEvent) => {
        let target = e.target as HTMLButtonElement
        if (target.name) {
            dispatch(setShapeType(target.name))
        }
    }

    return (
        <>
            <div className='grid grid-cols-4 grid-rows-1 gap-5 shadow-gray-400 shadow-md px-2 py-4 absolute bottom-16 right-0 w-56 rounded-md z-40'>
                <button name='rectangle' onClick={(e: React.MouseEvent) => selectShape(e)}>
                    <RectangleOutlinedIcon className='text-black pointer-events-none' />
                </button>
                <button name='circle' onClick={(e: React.MouseEvent) => selectShape(e)}>
                    <CircleOutlinedIcon className='text-black pointer-events-none' />
                </button>
                <button name='triangle' onClick={(e: React.MouseEvent) => selectShape(e)}>
                    <ChangeHistoryOutlinedIcon className='text-black pointer-events-none' />
                </button>
                <button name='hexagon' onClick={(e: React.MouseEvent) => selectShape(e)}>
                    <HexagonOutlinedIcon className='text-black pointer-events-none' />
                </button>
            </div>
        </>
    )
}
