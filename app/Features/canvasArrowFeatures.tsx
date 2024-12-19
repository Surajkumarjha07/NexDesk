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
        let canvas = CTX.current;
        if (canvas) {
            canvas.beginPath();
            canvas.moveTo(XPosition, YPosition);
        }
    }, [])

    const handleStop = useCallback((e: MouseEvent) => {
        if (isDrawing.current) {
            let XPosition = e.offsetX;
            let YPosition = e.offsetY;
            let canvas = CTX.current;
            if (canvas) {
                canvas.lineTo(XPosition, YPosition);
                canvas.strokeStyle = `${lineColorMap.get(currentColor.current)}`;
                canvas.lineWidth = currentThickness.current;
                canvas.stroke();
            }
        }
        isDrawing.current = false;
    }, [])

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

    }, [functionality, handleClick, handleStop])

    return {}
}
