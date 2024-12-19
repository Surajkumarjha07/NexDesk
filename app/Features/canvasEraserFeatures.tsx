import React, { useEffect, useRef } from 'react'
import { useAppSelector } from '../Redux/hooks'
import eraserFeatures from '../Interfaces/eraserFeatures';

export default function canvasEraserFeatures({canvasRef} : eraserFeatures) {
    const functionality = useAppSelector(state => state.Functionality.functionality);
    const erasing = useRef(false);

    useEffect(() => {
      const canvasElement = canvasRef.current;
      
      const handleClick = () => {
        console.log('eraser started');
      }

      const handleMove = (e: MouseEvent) => {
        let target = e.target as HTMLElement;
        console.log(target.classList);
        
      }

      const handleStop = () => {

      }

      if (canvasElement && functionality === 'eraser') {
        canvasElement.addEventListener('mousedown', handleClick);
        canvasElement.addEventListener('mousemove', handleMove);
        canvasElement.addEventListener('mouseup', handleStop);
      }
    
      return () => {
        // canvasElement?.removeEventListener('click',handleClick);
      }
    }, [functionality])
    

  return {}
}
