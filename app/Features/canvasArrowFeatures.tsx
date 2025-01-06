import { useCallback, useEffect, useRef, useState } from 'react'
import pencilFeature from '../Interfaces/pencilFeature'
import { useAppSelector } from '../Redux/hooks'
import arrow from '../Interfaces/arrow';

export default function CanvasArrowFeature({ canvasRef }: pencilFeature) {
    const functionality = useAppSelector(state => state.Functionality.functionality)
    const isDrawing = useRef(false);
    const CTX = useRef<CanvasRenderingContext2D | null>(null);
    const thickness = useAppSelector(state => state.PencilFeatures.thickness);
    const color = useAppSelector(state => state.PencilFeatures.color);
    const currentThickness = useRef(thickness);
    const currentColor = useRef(color);
    const startX = useRef(0);
    const startY = useRef(0);
    const endX = useRef(0);
    const endY = useRef(0);
    const [arrows, setArrows] = useState<arrow[]>([])

    useEffect(() => {
        if (thickness !== currentThickness.current) {
            currentThickness.current = thickness;
        }

        if (color !== currentColor.current) {
            currentColor.current = color;
        }

    }, [thickness, color])


    const handleClick = useCallback((e: MouseEvent) => {
        isDrawing.current = true;
        const XPosition = e.offsetX;
        const YPosition = e.offsetY;
        startX.current = XPosition;
        startY.current = YPosition;
    }, [])
    
    const handleArrowErase = (id: number) => {
        console.log("id: ", id);        
        const updatedArrows = arrows.filter(arrow => arrow.id !== id);
        setArrows(updatedArrows);
    }

    const handleStop = useCallback((e: MouseEvent) => {
        if (isDrawing.current) {
            const XPosition = e.offsetX;
            const YPosition = e.offsetY;
            endX.current = XPosition;
            endY.current = YPosition;
            setArrows(prevArrows => [
                ...prevArrows,
                { id: prevArrows.length + 1, startX: startX.current, startY: startY.current, endX: endX.current, endY: endY.current, lineColor: "black", lineWidth: 4 }
            ])
        }
        isDrawing.current = false;
    }, [])

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
            canvasRef.current.height = window.innerHeight * window.devicePixelRatio;

            ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
            CTX.current = ctx;
            // canvasRef.current.style.width = `${window.innerWidth}px`;
            // canvasRef.current.style.height = `${window.innerHeight}px`;
        }

        const canvasElement = canvasRef.current;
        if (canvasElement && functionality === 'upRightArrow') {
            canvasElement.addEventListener('mousedown', handleClick);
            canvasElement.addEventListener('mouseup', handleStop);
        }

        return () => {
            canvasElement?.removeEventListener('mousedown', handleClick);
            canvasElement?.removeEventListener('mouseup', handleStop);
        }

    }, [functionality, canvasRef, arrows, handleClick , handleStop])

    return { arrows, CTX, handleArrowErase }
}
