import React, { useCallback, useEffect, useRef, useState } from 'react'
import input from '../Interfaces/input'
import canvasTextFeature from '../Interfaces/canvasTextFeatures'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import { textBrightnessMap } from '../ObjectMapping'
import { setSelectedItem } from '../Redux/slices/selectedItem'

export default function canvasTextFeatures({ canvasRef, textColor, textSize, fontFamily, textBrightness, textAlign }: canvasTextFeature) {
  const [inputs, setInputs] = useState<input[]>([]);
  const functionality = useAppSelector(state => state.Functionality.functionality)
  const textId = useRef(0);
  const isMoving = useRef(false);
  const isEraserOpen = useAppSelector(state => state.Eraser.isEraserOpen);
  const inputId = useRef<number | null>(null);
  const inputRef = useRef<input | null>(null);
  const dispatch = useAppDispatch();

  const handleInputModify = (id: number) => {
    if (functionality === "arrow") {
      if (inputs.some(input => input.modify === true)) {
        inputs.forEach(input => input.modify = false);
      }
      inputId.current = id;
      let input = inputs.find(input => input.id === id);
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
  }

  const handleInputModification = () => {
    setInputs(prevInputs =>
      prevInputs.map(input =>
        (input.id === inputId.current && input.modify) ?
          { ...input, textColor, textSize, fontFamily, textBrightness, textAlign } : input
      )
    )
  }

  const handleInputModifyStop = () => {
    setInputs(prevInputs =>
      prevInputs.map(input =>
        input.id === inputId.current ?
          { ...input, modify: false } : input
      )
    )
  }

  const handleTextEraser = useCallback((e: MouseEvent | React.MouseEvent, id: number) => {
    if (isEraserOpen) {
      let updatedInputs = inputs.filter(shape => shape.id !== id);
      setInputs(updatedInputs);
    }

  }, [isEraserOpen, inputs])


  const handleTextClick = useCallback((e: MouseEvent | React.MouseEvent, id: number) => {
    if (functionality === 'hand') {
      textId.current = id;
      isMoving.current = true;
    }
  }, [functionality, inputs])

  const handleTextMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (isMoving.current) {
      let XPosition = e.clientX;
      let YPosition = e.clientY;

      let updatedInputs = inputs.map(input =>
        input.id === textId.current ?
          { ...input, x: XPosition, y: YPosition } : input
      )
      setInputs(updatedInputs);
    }
  }, [inputs])

  const handleTextStop = useCallback(() => {
    isMoving.current = false;
  }, [])

  useEffect(() => {
    handleInputModification();
  }, [textColor, textSize, fontFamily, textBrightness, textAlign])

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
      }
    };

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      if (functionality === "text" && !inputs.some(input => input.modify === true)) {
        canvasElement.addEventListener("click", handleCanvasClick);
        canvasElement.addEventListener("mousemove", handleTextMove);
        canvasElement.addEventListener("mouseup", handleTextStop);
      }
      else {
        canvasElement.addEventListener("click", handleInputModifyStop)
      }
    }

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener("click", handleCanvasClick);
        canvasElement.removeEventListener("mousemove", handleTextMove);
        canvasElement.removeEventListener("mouseup", handleTextStop);
        canvasElement.removeEventListener("click", handleInputModifyStop)
      }
    };
  }, [functionality, textSize, textColor, fontFamily, textBrightness, textAlign, inputs])

  const removeInput = () => {
    let filterArr = inputs.filter(input => input.text !== "")
    setInputs(filterArr);
  }

  const settingText = (e: React.ChangeEvent, id: number) => {
    let target = e.target as HTMLInputElement;

    let updatedInputs = inputs.map(input => (
      input.id === id ?
        { ...input, text: target.value } : input
    ))
    setInputs(updatedInputs)
  };

  return { settingText, removeInput, inputs, handleTextClick, handleTextMove, handleTextStop, handleTextEraser, handleInputModify };

}
