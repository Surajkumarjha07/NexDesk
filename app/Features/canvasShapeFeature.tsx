import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import shapeFeature from '../Interfaces/shapeFeature'
import { setSelectedItem } from '../Redux/slices/selectedItem'
import { useSocket } from '../socketContext'
import shape from '../Interfaces/shape'
import { setBorderType, setPatternType, setShapeColor, setShapeOpacity, setShapeType } from '../Redux/slices/shapes'

export default function CanvasShapeFeatures({ canvasRef, shapeType, shapeColor, patternType, borderType, opacity }: shapeFeature) {
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
  const socket = useSocket();
  const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);
  const selectedItem = useAppSelector(state => state.SelectedItem.selectedItem);
  const openedWhiteboard = useAppSelector(state => state.Whiteboard.openedWhiteboard);
  const isNewMeeting = useAppSelector(state => state.MeetingCode.isNewMeeting);

  useEffect(() => {
    setShapes(openedWhiteboard.shapes);
  }, [openedWhiteboard])

  useEffect(() => {
    if (shapes.some(shape => shape.modify === true) && !(selectedItem === "shape")) {
      setShapes(prevShapes =>
        prevShapes.map(shape => ({
          ...shape,
          modify: shape.modify === true ? false : true
        }))
      )
    }
  }, [selectedItem, shapes])

  const handleShapeSelected = (id: number) => {
    if (functionality == "arrow") {
      if (shapes.some(shape => shape.modify === true)) {
        shapes.forEach(shape => shape.modify = false);
      }
      shapeId.current = id;
      const shape = shapes.find(shape => shape.id === id);
      shapeRef.current = shape;
      setShapes(prevShapes =>
        prevShapes.map(shape => ({
          ...shape,
          modify: shape.id === shapeId.current ? true : false
        }))
      )
      dispatch(setSelectedItem("shape"));
      dispatch(setShapeType(shape?.shapeType));
      dispatch(setShapeColor(shape?.shapeColor));
      dispatch(setPatternType(shape?.patternType));
      dispatch(setBorderType(shape?.borderType));
      dispatch(setShapeOpacity(shape?.opacity));
      isModified.current = true;
      if (socket) {
        socket.emit("itemSelect", { meetingCode, id });
      }
    }
  }

  const handleShapeModify = () => {
    if (isModified.current && selectedItem === "shape") {
      setShapes(prevShapes =>
        prevShapes.map(shape =>
          (shape.id === shapeId.current && shape.modify) ?
            { ...shape, shapeColor, patternType, borderType, opacity } : shape
        )
      )
      if (socket) {
        socket.emit("itemModify", { meetingCode, id: shapeId.current, shapeColor, patternType, borderType, opacity })
      }
    }
  }

  const handleShapeResizeStart = useCallback(() => {
    isResizing.current = true;
  }, [])

  const handleHeightResize = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (isResizing.current) {
      let newHeight: number;
      if (shapeRef.current) {
        newHeight = (e.clientY - shapeRef.current.y);
      }
      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === shapeId.current
            ? { ...shape, height: newHeight }
            : shape
        )
      );
      if (socket) {
        socket.emit("itemHeightResize", { meetingCode, id: shapeId.current, newHeight: newHeight! })
      }
    }
  }, [socket, meetingCode])

  const handleWidthResize = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (isResizing.current) {
      let newWidth: number;
      if (shapeRef.current) {
        newWidth = (e.clientX - shapeRef.current.x);
      }
      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === shapeId.current
            ? { ...shape, width: newWidth }
            : shape
        )
      );
      if (socket) {
        socket.emit("itemWidthResize", { meetingCode, id: shapeId.current, newWidth: newWidth! });
      }
    }
  }, [meetingCode, socket])

  const handleShapeResizingStop = useCallback(() => {
    isResizing.current = false;
  }, []);

  const handleShapeUnSelected = () => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === shapeId.current
          ? { ...shape, modify: false }
          : shape
      )
    );
    if (socket) {
      socket.emit("itemUnSelect", meetingCode);
    }
  }

  const handleEraser = useCallback((e: MouseEvent | React.MouseEvent, id: number) => {
    if (isEraserOpen) {
      const updatedShapes = shapes.filter(shape => shape.id !== id);
      setShapes(updatedShapes);
      if (socket) {
        socket.emit("itemErase", { meetingCode, id })
      }
    }
  }, [isEraserOpen, shapes, meetingCode, socket])

  const handleClick = useCallback((e: MouseEvent | React.MouseEvent, id: number) => {
    if (functionality === 'hand') {
      shapeId.current = id;
      const shape = shapes.find(shape => shape.id === id);
      if (shape) {
        XPos.current = e.clientX - shape.x;
        YPos.current = e.clientY - shape.y;
      }
      isMoving.current = true;
    }
  }, [shapes, functionality])

  const handleMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (isMoving.current) {
      const XPosition = e.clientX - XPos.current;
      const YPosition = e.clientY - YPos.current;

      const updatedShapes = shapes.map(shape =>
        shape.id === shapeId.current ?
          { ...shape, x: XPosition, y: YPosition } : shape
      )
      setShapes(updatedShapes);
      if (socket) {
        socket.emit("itemMoving", { meetingCode, id: shapeId.current, x: XPosition, y: YPosition });
      }
    }
  }, [shapes, meetingCode, socket])

  const handleStop = useCallback(() => {
    isMoving.current = false;
  }, [])

  useEffect(() => {
    handleShapeModify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeColor, borderType, patternType, opacity])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleItemDraw = (data: any) => {
      const { id, x, y, width, height, shapeColor, shapeType, borderType, patternType, opacity, modify } = data;
      setShapes(prev => [
        ...prev,
        { id, x, y, width, height, shapeColor, shapeType, borderType, patternType, opacity, modify }
      ])
    }

    const handleItemSelected = (id: number) => {
      if (shapes.some(shape => shape.modify === true)) {
        shapes.forEach(shape => shape.modify = false);
      }
      shapeId.current = id;
      const shape = shapes.find(shape => shape.id === id);
      shapeRef.current = shape;
      setShapes(prevShapes =>
        prevShapes.map(shape => ({
          ...shape,
          modify: shape.id === shapeId.current ? true : false
        }))
      )
      dispatch(setSelectedItem("shape"));
    }

    const handleItemUnSelected = () => {
      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === shapeId.current
            ? { ...shape, modify: false }
            : shape
        )
      );
    }

    const handleItemErase = (id: number) => {
      setShapes(prevShapes =>
        prevShapes.filter(shape =>
          shape.id !== id
        )
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleItemModify = (data: any) => {
      const { id, shapeColor, patternType, borderType, opacity } = data;
      if (selectedItem === "shape") {
        setShapes(prevShapes =>
          prevShapes.map(shape => (
            shape.id === id ? {
              ...shape, shapeColor, patternType, borderType, opacity
            } : shape
          ))
        )
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleItemMoving = (data: any) => {
      const { id, x, y } = data;

      setShapes(prevShapes =>
        prevShapes.map(shape => (
          shape.id === id ? {
            ...shape, x, y
          } : shape
        ))
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleItemHeightResize = (data: any) => {
      const { id, newHeight } = data;
      setShapes(prevShapes =>
        prevShapes.map(shape =>
          shape.id === id ?
            { ...shape, height: newHeight } : shape
        )
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleItemWidthResize = (data: any) => {
      const { id, newWidth } = data;
      setShapes(prevShapes =>
        prevShapes.map(shape =>
          shape.id === id ?
            { ...shape, width: newWidth } : shape
        )
      )
    }

    if (socket) {
      socket.on("itemDrawed", handleItemDraw);
      socket.on("itemSelected", handleItemSelected);
      socket.on("itemUnSelected", handleItemUnSelected);
      socket.on("itemErased", handleItemErase);
      socket.on("itemModified", handleItemModify);
      socket.on("itemMoved", handleItemMoving);
      socket.on("itemHeightResized", handleItemHeightResize);
      socket.on("itemWidthResized", handleItemWidthResize);
    }

    return () => {
      if (socket) {
        socket.off("itemDrawed", handleItemDraw);
        socket.off("itemSelected", handleItemSelected);
        socket.off("itemUnSelected", handleItemUnSelected);
        socket.off("itemErased", handleItemErase);
        socket.off("itemModified", handleItemModify);
        socket.off("itemMoved", handleItemMoving);
        socket.off("itemHeightResized", handleItemHeightResize);
        socket.off("itemWidthResized", handleItemWidthResize);
      }
    }
  }, [socket, dispatch, shapes, selectedItem])

  useEffect(() => {
    if (isNewMeeting) {
      setShapes([]);
    }
  }, [isNewMeeting])

  useEffect(() => {
    const handleCanvasClick = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const XPosition = e.clientX - rect.left;
        const YPosition = e.clientY - rect.top;

        setShapes((prev) => [
          ...prev,
          { id: prev.length + 1, x: XPosition, y: YPosition, width: 200, height: 200, shapeColor: shapeColor, shapeType: shapeType, patternType: patternType, borderType: borderType, opacity: opacity, modify: false },
        ]);
        if (socket && meetingCode && XPosition && YPosition) {
          socket.emit("itemDraw", { meetingCode, id: shapes.length + 1, x: XPosition, y: YPosition, width: 200, height: 200, shapeColor, shapeType, patternType, borderType, opacity, modify: false })
        }
      }
    };

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      if (functionality === "shapes" && !shapes.some(shape => shape.modify === true)) {
        canvasElement.addEventListener("click", handleCanvasClick);
      }
      else {
        canvasElement.addEventListener("click", handleShapeUnSelected)
      }
    }

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener("click", handleCanvasClick);
        canvasElement.removeEventListener("click", handleShapeUnSelected)
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functionality, shapeColor, shapeType, patternType, borderType, opacity, shapes, canvasRef, meetingCode, socket])

  return { shapes, handleClick, handleMove, handleStop, handleEraser, handleShapeSelected, handleShapeResizeStart, handleHeightResize, handleWidthResize, handleShapeResizingStop };

}
