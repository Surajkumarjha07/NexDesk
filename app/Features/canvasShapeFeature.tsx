import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import shapeFeature from '../Interfaces/shapeFeature'
import { setResize } from '../Redux/slices/shapes'
import { setSelectedItem } from '../Redux/slices/selectedItem'

export default function canvasTextFeatures({ canvasRef, shapeType, shapeColor, patternType, borderType, opacity }: shapeFeature) {
  const [shapes, setShapes] = useState<shape[]>([])
  const functionality = useAppSelector(state => state.Functionality.functionality)
  const isEraserOpen = useAppSelector(state => state.Eraser.isEraserOpen);
  const isMoving = useRef(false);
  const shapeId = useRef<number | null>(null);
  const XPos = useRef(0);
  const YPos = useRef(0);
  const shapeRef = useRef<shape | undefined>(undefined)
  const isResizing = useRef<boolean>(false);
  const isModified = useRef<boolean>(false);
  const dispatch = useAppDispatch();

  const handleShapeSelected = (e: React.MouseEvent | MouseEvent, id: number) => {
    if (functionality == "arrow") {
      if (shapes.some(shape => shape.resize === true)) {
        shapes.forEach(shape => shape.resize = false);
      }
      shapeId.current = id;
      let shape = shapes.find(shape => shape.id === id);
      shapeRef.current = shape;
      let updatedShapes = shapes.map(shape =>
        (shape.id === id && !shape.resize) ?
          { ...shape, resize: true } : shape
      );
      setShapes(updatedShapes);
      dispatch(setSelectedItem("shape"));
      isModified.current = true;
    }
  }

  const handleShapeModify = () => {
    if (isModified.current) {
      setShapes(prevShapes =>
        prevShapes.map(shape =>
          (shape.id === shapeId.current && shape.resize) ?
            { ...shape, shapeColor, patternType, borderType, opacity } : shape
        )
      )
    }
  }

  const handleShapeResizeStart = useCallback(() => {
    isResizing.current = true;
  }, [])

  const handleHeightResize = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (isResizing.current) {
      let YPosition: number;
      if (shapeRef.current) {
        YPosition = (e.clientY - shapeRef.current.y);
      }
      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === shapeId.current
            ? { ...shape, height: YPosition }
            : shape
        )
      );
    }
  }, [])

  const handleWidthResize = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (isResizing.current) {
      let XPosition: number;
      if (shapeRef.current) {
        XPosition = (e.clientX - shapeRef.current.x);
      }
      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === shapeId.current
            ? { ...shape, width: XPosition }
            : shape
        )
      );
    }
  }, [])

  const handleShapeResizingStop = useCallback(() => {
    isResizing.current = false;
  }, []);

  const handleSRStop = () => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === shapeId.current
          ? { ...shape, resize: false }
          : shape
      )
    );
  }

  const handleEraser = useCallback((e: MouseEvent | React.MouseEvent, id: number) => {
    if (isEraserOpen) {
      let updatedShapes = shapes.filter(shape => shape.id !== id);
      setShapes(updatedShapes);
    }
  }, [isEraserOpen, shapes])

  const handleClick = useCallback((e: MouseEvent | React.MouseEvent, id: number) => {
    if (functionality === 'hand') {
      shapeId.current = id;
      let shape = shapes.find(shape => shape.id === id);
      if (shape) {
        XPos.current = e.clientX - shape.x;
        YPos.current = e.clientY - shape.y;
      }
      isMoving.current = true;
    }
  }, [shapes, functionality])

  const handleMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (isMoving.current) {
      let XPosition = e.clientX - XPos.current;
      let YPosition = e.clientY - YPos.current;

      const updatedShapes = shapes.map(shape =>
        shape.id === shapeId.current ?
          { ...shape, x: XPosition, y: YPosition } : shape
      )
      setShapes(updatedShapes);
    }
  }, [shapes, isMoving.current])

  const handleStop = useCallback(() => {
    isMoving.current = false;
  }, [])

  useEffect(() => {
    handleShapeModify();
  }, [shapeColor, borderType, patternType, opacity])

  useEffect(() => {
    const handleCanvasClick = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const XPosition = e.clientX - rect.left;
        const YPosition = e.clientY - rect.top;

        setShapes((prev) => [
          ...prev,
          { id: prev.length + 1, x: XPosition, y: YPosition, width: 200, height: 200, shapeColor: shapeColor, shapeType: shapeType, patternType: patternType, borderType: borderType, opacity: opacity, resize: false },
        ]);
      }
    };

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      if (functionality === "shapes" && !shapes.some(shape => shape.resize === true)) {
        canvasElement.addEventListener("click", handleCanvasClick);
      }
      else {
        canvasElement.addEventListener("click", handleSRStop)
      }
    }

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener("click", handleCanvasClick);
        canvasElement.removeEventListener("click", handleSRStop)
      }
    };
  }, [functionality, shapeColor, shapeType, patternType, borderType, opacity, shapes])

  return { shapes, handleClick, handleMove, handleStop, handleEraser, handleShapeSelected, handleShapeResizeStart, handleHeightResize, handleWidthResize, handleShapeResizingStop };

}
