import React from 'react'
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { setShapeType } from '../Redux/slices/shapes';

export default function Shapes() {
    const dispatch = useAppDispatch();
    const isDarkMode = useAppSelector(state => state.DarkMode.isDarkMode);

    const selectShape = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement
        if (target.name) {
            dispatch(setShapeType(target.name))
        }
    }

    return (
        <>
            <div className={`${isDarkMode ? "bg-gray-800 shadow-none" : "bg-white shadow-gray-400 shadow-sm"} grid grid-cols-2 grid-rows-1 gap-1 py-4 absolute bottom-16 right-0 w-20 rounded-md z-40`}>
                <button name='rectangle' onClick={(e: React.MouseEvent) => selectShape(e)}>
                    <RectangleOutlinedIcon className={`${isDarkMode ? "text-white" : "text-black"} pointer-events-none`} />
                </button>
                <button name='circle' onClick={(e: React.MouseEvent) => selectShape(e)}>
                    <CircleOutlinedIcon className={`${isDarkMode ? "text-white" : "text-black"} pointer-events-none`} />
                </button>
            </div>
        </>
    )
}
