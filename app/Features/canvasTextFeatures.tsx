import React, { useCallback, useEffect, useRef, useState } from 'react'
import input from '../Interfaces/input'
import canvasTextFeature from '../Interfaces/canvasTextFeatures'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import { setSelectedItem } from '../Redux/slices/selectedItem'
import { useSocket } from '../socketContext'

export default function CanvasTextFeatures({ canvasRef, textColor, textSize, fontFamily, textBrightness, textAlign }: canvasTextFeature) {
  const [inputs, setInputs] = useState<input[]>([]);
  const functionality = useAppSelector(state => state.Functionality.functionality)
  const isMoving = useRef(false);
  const isEraserOpen = useAppSelector(state => state.Eraser.isEraserOpen);
  const isModified = useRef(false);
  const inputId = useRef<number | null>(null);
  const inputRef = useRef<input | null>(null);
  const XPos = useRef<number | null>(null);
  const YPos = useRef<number | null>(null);
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);

  const handleInputModify = (id: number) => {
    if (functionality === "arrow") {
      if (inputs.some(input => input.modify === true)) {
        inputs.forEach(input => input.modify = false);
      }
      inputId.current = id;
      isModified.current = true;
      const input = inputs.find(input => input.id === id);
      if (input) {
        inputRef.current = input;
      }
      setInputs(prevInputs =>
        prevInputs.map(input =>
          input.id === id ?
            { ...input, modify: true } : input
        )
      )
      dispatch(setSelectedItem("text"))
      if (socket) {
        socket.emit("inputSelect", { meetingCode, id })
      }
    }
  }

  const handleInputModification = () => {
    if (isModified.current) {
      setInputs(prevInputs =>
        prevInputs.map(input =>
          (input.id === inputId.current && input.modify) ?
            { ...input, textColor, textSize, fontFamily, textBrightness, textAlign } : input
        )
      )
      if (socket) {
        socket.emit("inputModify", { meetingCode, id: inputId.current, textColor, textSize, fontFamily, textBrightness, textAlign })
      }
    }
  }

  const handleInputModifyStop = () => {
    isModified.current = false;
    setInputs(prevInputs =>
      prevInputs.map(input =>
        input.id === inputId.current ?
          { ...input, modify: false } : input
      )
    )
    if (socket) {
      socket.emit("inputUnSelect", meetingCode)
    }
  }

  const handleTextEraser = useCallback((e: MouseEvent | React.MouseEvent, id: number) => {
    if (isEraserOpen) {
      const updatedInputs = inputs.filter(input => input.id !== id);
      setInputs(updatedInputs);
      if (socket) {
        socket.emit("inputErase", { meetingCode, id });
      }
    }

  }, [isEraserOpen, inputs, meetingCode, socket])


  const handleTextClick = useCallback((e: MouseEvent | React.MouseEvent, id: number) => {
    if (functionality === 'hand') {
      inputId.current = id;
      const note = inputs.find(note => note.id === id);
      if (note) {
        XPos.current = e.clientX - note.x;
        YPos.current = e.clientY - note.y;
      }
      isMoving.current = true;
    }
  }, [functionality, inputs])

  const handleTextMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (isMoving.current) {
      const XPosition = e.clientX - XPos.current!;
      const YPosition = e.clientY - YPos.current!;

      const updatedNotes = inputs.map(input =>
        input.id === inputId.current ?
          { ...input, x: XPosition, y: YPosition } : input
      )
      setInputs(updatedNotes);
      if (socket) {
        socket.emit("inputMove", { meetingCode, id: inputId.current, x: XPosition, y: YPosition });
      }
    }
  }, [inputs, meetingCode, socket])

  const handleTextStop = useCallback(() => {
    isMoving.current = false;
  }, [])

  useEffect(() => {
    handleInputModification();
  }, [textColor, textSize, fontFamily, textBrightness, textAlign])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleTextDrawed = (data: any) => {
      const { id, x, y, text, textColor, textSize, fontFamily, textBrightness, modify, textAlign } = data;
      setInputs(prev => [
        ...prev,
        { id, x, y, text, textColor, textSize, fontFamily, textBrightness, modify, textAlign }
      ])
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputText = (data: any) => {
      const { id, value } = data;
      setInputs(prevInputs =>
        prevInputs.map(input =>
          input.id === id ?
            { ...input, text: value } : input
        )
      )
    }

    const handleInputFocusRemove = () => {
      const filterArr = inputs.filter(input => input.text !== "")
      setInputs(filterArr);
    }

    const handleInputSelect = (id: number) => {
      if (inputs.some(input => input.modify === true)) {
        inputs.forEach(input => input.modify = false);
      }
      inputId.current = id;
      isModified.current = true;
      const input = inputs.find(input => input.id === id);
      if (input) {
        inputRef.current = input;
      }
      setInputs(prevInputs =>
        prevInputs.map(input =>
          input.id === id ?
            { ...input, modify: true } : input
        )
      )
      dispatch(setSelectedItem("text"))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputModify = (data: any) => {
      const { id, textColor, textSize, fontFamily, textBrightness, textAlign } = data;
      setInputs(prevInputs =>
        prevInputs.map(input =>
          input.id === id ?
            { ...input, textColor, textSize, fontFamily, textBrightness, textAlign } : input
        )
      )
    }

    const handleInputUnSelect = () => {
      setInputs(prevInputs =>
        prevInputs.map(input =>
          input.modify === true ?
            { ...input, modify: false } : input
        )
      )
    }

    const handleInputErased = (id: number) => {
      setInputs(prevInputs =>
        prevInputs.filter(input =>
          input.id !== id
        )
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputMoved = (data: any) => {
      const { id, x, y } = data;
      setInputs(prevInputs =>
        prevInputs.map(input =>
          input.id === id ?
            { ...input, x, y } : input
        )
      )
    }

    if (socket) {
      socket.on("inputDrawed", handleTextDrawed);
      socket.on("inputTextSetted", handleInputText);
      socket.on("focusRemoved", handleInputFocusRemove);
      socket.on("inputSelected", handleInputSelect);
      socket.on("inputModified", handleInputModify);
      socket.on("inputUnSelected", handleInputUnSelect);
      socket.on("inputErased", handleInputErased);
      socket.on("inputMoved", handleInputMoved);
    }

    return () => {
      if (socket) {
        socket.off("inputDrawed", handleTextDrawed);
        socket.off("inputTextSetted", handleInputText);
        socket.off("focusRemoved", handleInputFocusRemove);
        socket.off("inputSelected", handleInputSelect);
        socket.off("inputModified", handleInputModify);
        socket.off("inputUnSelected", handleInputUnSelect);
        socket.off("inputErased", handleInputErased);
        socket.off("inputMoved", handleInputMoved);
      }
    }
  }, [socket, dispatch, inputs])


  useEffect(() => {
    const handleCanvasClick = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const XPosition = e.clientX - rect.left;
        const YPosition = e.clientY - rect.top;

        setInputs((prev) => [
          ...prev,
          { id: prev.length + 1, x: XPosition, y: YPosition, text: '', textColor, textSize, fontFamily, textBrightness, modify: false, textAlign },
        ]);
        if (socket && meetingCode && XPosition && YPosition) {
          socket.emit("inputDraw", { meetingCode, id: inputs.length + 1, x: XPosition, y: YPosition, text: "", textColor, textSize, fontFamily, textBrightness, modify: false, textAlign })
        }
      }
    };

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      if (functionality === "text" && !inputs.some(input => input.modify === true)) {
        canvasElement.addEventListener("click", handleCanvasClick);
      }
      else {
        canvasElement.addEventListener("click", handleInputModifyStop)
      }
    }

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener("click", handleCanvasClick);
        canvasElement.removeEventListener("click", handleInputModifyStop)
      }
    };
  }, [functionality, textSize, textColor, fontFamily, textBrightness, textAlign, inputs, canvasRef, meetingCode, socket])

  const removeInput = () => {
    const filterArr = inputs.filter(input => input.text !== "")
    setInputs(filterArr);
    if (socket) {
      socket.emit("removeFocus", meetingCode)
    }
  }

  const settingText = (e: React.ChangeEvent, id: number) => {
    const target = e.target as HTMLInputElement;
    const updatedInputs = inputs.map(input => (
      input.id === id ?
        { ...input, text: target.value } : input
    ))
    setInputs(updatedInputs)
    if (socket) {
      socket.emit("setInputText", { meetingCode, id, value: target.value });
    }
  };

  return { settingText, removeInput, inputs, handleTextClick, handleTextMove, handleTextStop, handleTextEraser, handleInputModify };

}
