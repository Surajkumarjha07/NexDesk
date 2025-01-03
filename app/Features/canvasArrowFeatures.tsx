import React, { useCallback, useEffect, useRef, useState } from 'react'
import pencilFeature from '../Interfaces/pencilFeature'
import { useAppSelector } from '../Redux/hooks'
import { lineColorMap } from '../ObjectMapping';
import arrow from '../Interfaces/arrow';

export default function canvasArrowFeature({ canvasRef }: pencilFeature) {
    const functionality = useAppSelector(state => state.Functionality.functionality)
    const isDrawing = useRef(false);
    const CTX = useRef<CanvasRenderingContext2D | null>(null);
    const thickness = useAppSelector(state => state.PencilFeatures.thickness);
    const color = useAppSelector(state => state.PencilFeatures.color);
    let currentThickness = useRef(thickness);
    let currentColor = useRef(color);
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
        let XPosition = e.offsetX;
        let YPosition = e.offsetY;
        startX.current = XPosition;
        startY.current = YPosition;
    }, [arrows])
    
    const handleArrowErase = (id: number) => {
        console.log("id: ", id);        
        let updatedArrows = arrows.filter(arrow => arrow.id !== id);
        setArrows(updatedArrows);
    }

    const handleStop = useCallback((e: MouseEvent) => {
        if (isDrawing.current) {
            let XPosition = e.offsetX;
            let YPosition = e.offsetY;
            endX.current = XPosition;
            endY.current = YPosition;
            setArrows(prevArrows => [
                ...prevArrows,
                { id: prevArrows.length + 1, startX: startX.current, startY: startY.current, endX: endX.current, endY: endY.current, lineColor: "black", lineWidth: 4 }
            ])
        }
        isDrawing.current = false;
    }, [arrows])

    useEffect(() => {
        if (canvasRef.current) {
            let ctx = canvasRef.current.getContext('2d');
            canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
            canvasRef.current.height = window.innerHeight * window.devicePixelRatio;

            ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
            CTX.current = ctx;
            // canvasRef.current.style.width = `${window.innerWidth}px`;
            // canvasRef.current.style.height = `${window.innerHeight}px`;
        }

        let canvasElement = canvasRef.current;
        if (canvasElement && functionality === 'upRightArrow') {
            canvasElement.addEventListener('mousedown', handleClick);
            canvasElement.addEventListener('mouseup', handleStop);
        }

        return () => {
            canvasElement?.removeEventListener('mousedown', handleClick);
            canvasElement?.removeEventListener('mouseup', handleStop);
        }

    }, [functionality, arrows, handleClick , handleStop])

    return { arrows, CTX, handleArrowErase }
}
