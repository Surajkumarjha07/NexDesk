import React, { useCallback, useEffect, useRef, useState } from 'react'
import pencilFeature from '../Interfaces/pencilFeature'
import { useAppSelector } from '../Redux/hooks'
import { lineColorMap } from '../ObjectMapping';
import Line from '../Interfaces/arrow';

export default function canvasPencilFeature({ canvasRef }: pencilFeature) {
  const functionality = useAppSelector(state => state.Functionality.functionality)
  const isDrawing = useRef(false);
  const LineCTX = useRef<CanvasRenderingContext2D | null>(null);
  const thickness = useAppSelector(state => state.PencilFeatures.thickness);
  const color = useAppSelector(state => state.PencilFeatures.color);
  let currentThickness = useRef(thickness);
  let currentColor = useRef(color);
  const startX = useRef(0);
  const startY = useRef(0);
  const endX = useRef(0);
  const endY = useRef(0);
  const [lines, setLines] = useState<Line[]>([])

  useEffect(() => {
    if (thickness !== currentThickness.current) {
      currentThickness.current = thickness;
      console.log('curr: ', currentThickness.current);
    }

    if (color !== currentColor.current) {
      currentColor.current = color;
      console.log('curr: ', currentColor.current);
    }

  }, [thickness, color])

  const handleClick = useCallback((e: MouseEvent) => {
    isDrawing.current = true;
    let XPosition = e.offsetX;
    let YPosition = e.offsetY;
    startX.current = XPosition;
    startY.current = YPosition;
    
    let canvas = LineCTX.current;
    if (canvas) {
      canvas.beginPath();
      canvas.moveTo(XPosition, YPosition);
    }
  }, [])

  const handleMove = useCallback((e: MouseEvent) => {
    if (isDrawing.current) {
      let XPosition = e.offsetX;
      let YPosition = e.offsetY;
      endX.current = XPosition;
      endY.current = YPosition;

      setLines(prevLines => [
        ...prevLines,
        { id: prevLines.length + 1, startX: startX.current, startY: startY.current, endX: XPosition, endY: YPosition, lineColor: "black", lineWidth: 4 }
      ]
      )

      let canvas = LineCTX.current;
      if (canvas) {
        canvas.lineTo(XPosition, YPosition);
        canvas.strokeStyle = `${lineColorMap.get(currentColor.current)}`;
        canvas.lineWidth = currentThickness.current;
        canvas.stroke();
      }
    }
  }, [])

  const handleStop = useCallback(() => {
    isDrawing.current = false;
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      let ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
      canvasRef.current.height = window.innerHeight * window.devicePixelRatio;

      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
      LineCTX.current = ctx;
      // canvasRef.current.style.width = `${window.innerWidth}px`;
      // canvasRef.current.style.height = `${window.innerHeight}px`;
    }

    let canvasElement = canvasRef.current;
    if (canvasElement && functionality === 'pencil') {
      canvasElement.addEventListener('mousedown', handleClick);
      canvasElement.addEventListener('mousemove', handleMove);
      canvasElement.addEventListener('mouseup', handleStop);
    }

    return () => {
      canvasElement?.removeEventListener('mousedown', handleClick);
      canvasElement?.removeEventListener('mousemove', handleMove);
      canvasElement?.removeEventListener('mouseup', handleStop);
    }

  }, [functionality, handleClick, handleMove, handleStop])

  return {lines, LineCTX}
}
