"use client"
import Sidebar from '@/app/components/Sidebar';
import React, { useEffect, useRef, useState } from 'react';
import BottomBar from '@/app/components/BottomBar';
import { useAppSelector } from '@/app/Redux/hooks';
import StickyNotesFeatures from '@/app/Features/stickyNotesFeatures';
import { bgColorMap, borderColorMap, noteTextBrightnessMap, textBrightnessMap, textColorMap } from '../../../ObjectMapping';
import UserFeatures from '@/app/components/UserFeatures';
import ChatComponent from '@/app/components/ChatComponent';
import Image from 'next/image';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useSocket } from '@/app/socketContext';
import { useRouter } from 'next/navigation';
import CanvasShapeFeatures from '@/app/Features/canvasShapeFeature';
import CanvasTextFeatures from '@/app/Features/canvasTextFeatures';
import CanvasArrowFeature from '@/app/Features/canvasArrowFeatures';
// import CanvasPencilFeature from '@/app/Features/canvasPencilFeature';
import CanvasImageFeatures from '@/app/Features/canvasImageFeatures';

export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textColor = useAppSelector(state => state.TextFeatures.textColor);
  const functionality = useAppSelector(state => state.Functionality.functionality);
  const textSize = useAppSelector(state => state.TextFeatures.textSize);
  const textAlign = useAppSelector(state => state.TextFeatures.textAlign)
  const fontFamily = useAppSelector(state => state.TextFeatures.fontFamily);
  const textBrightness = useAppSelector(state => state.TextFeatures.textBrightness);
  const noteTextSize = useAppSelector(state => state.NoteFeatures.noteTextSize);
  const noteFontFamily = useAppSelector(state => state.NoteFeatures.noteFontFamily);
  const noteBackgroundColor = useAppSelector(state => state.NoteFeatures.noteBackgroundColor);
  const noteTextBrightness = useAppSelector(state => state.NoteFeatures.noteTextBrightness);
  const noteTextAlign = useAppSelector(state => state.NoteFeatures.noteTextAlign);
  const shapeType = useAppSelector(state => state.ShapeFeatures.shapeType);
  const shapeColor = useAppSelector(state => state.ShapeFeatures.shapeColor);
  const patternType = useAppSelector(state => state.ShapeFeatures.patternType);
  const borderType = useAppSelector(state => state.ShapeFeatures.borderType);
  const opacity = useAppSelector(state => state.ShapeFeatures.opacity);
  const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const userJoinedBox = useRef<HTMLDivElement | null>(null);
  const [toggleBox, setToggleBox] = useState<boolean>(false);
  const [userJoined, setUserJoined] = useState<string>("");
  const socket = useSocket();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const [visibleContent, setVisibleContent] = useState<boolean>(false);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const cookie = cookies.find((cookie) => cookie.startsWith("authtoken="));
    const mainCookie = cookie ? cookie.split("=")[1] : null;

    const authorized = async () => {
      if (!mainCookie) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/userAuthenticated", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mainCookie}`
          },
          credentials: "include"
        })

        if (!response.ok) {
          router.push("/");
        }
        else {
          setVisibleContent(true);
        }
      } catch (error) {
        console.log("error: ", error);
        router.push("/")
      }
    };

    authorized();
  }, [router]);

  const { settingText, removeInput, inputs, handleTextClick, handleTextMove, handleTextStop, handleTextEraser, handleInputModify } = CanvasTextFeatures({
    canvasRef,
    textColor,
    textSize,
    fontFamily,
    textBrightness,
    textAlign
  })

  const { notes, removeNote, settingNoteText, handleNotesClick, handleNotesMove, handleNotesStop, handleNotesEraser, handleModify } = StickyNotesFeatures({
    canvasRef,
    noteTextSize,
    noteFontFamily,
    noteBackgroundColor,
    noteTextBrightness,
    noteTextAlign
  })

  const { shapes, handleClick, handleMove, handleStop, handleEraser, handleShapeSelected, handleShapeResizeStart, handleHeightResize, handleWidthResize, handleShapeResizingStop } = CanvasShapeFeatures({
    canvasRef,
    shapeColor,
    shapeType,
    patternType,
    borderType,
    opacity
  })

  const { arrows, CTX } = CanvasArrowFeature({ canvasRef })

  // const { lines, LineCTX } = CanvasPencilFeature({ canvasRef })

  const { images, handleImageSelect, handleErase, handleImageClick, handleImageMove, handleImageMoveStop, handleImgHeightResize, handleImgResizeStart, handleImgResizeStop, handleImgWidthResize } = CanvasImageFeatures({ canvasRef })

  const copyToClipBoard = (e: React.MouseEvent) => {
    const target = e.target as HTMLSpanElement;
    if (target) {
      navigator.clipboard.writeText(target.innerHTML.trim());
    }
  }

  const hideMessage = () => {
    if (messageRef.current) {
      sessionStorage.removeItem("showBox");
      messageRef.current.style.visibility = "hidden";
    }
  }

  const hideuserJoinedMessage = () => {
    if (userJoinedBox.current) {
      setToggleBox(false);
      userJoinedBox.current.style.visibility = "hidden";
    }
  }

  useEffect(() => {
    if (socket) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.on("newUserJoined", (data: any) => {
        const { username } = data;
        console.log("new user");
        setToggleBox(true);
        setUserJoined(username);
        if (audioRef.current) {
          audioRef.current.play();
        }
        setTimeout(() => {
          setToggleBox(false);
        }, 10000);
      })
    }
  }, [socket]);

  useEffect(() => {
    const canvas = CTX.current;
    arrows.forEach(arrow => {
      if (canvas) {
        canvas.beginPath();
        canvas.moveTo(arrow.startX, arrow.startY);
        canvas.lineTo(arrow.endX, arrow.endY);
        canvas.lineWidth = arrow.lineWidth;
        canvas.strokeStyle = arrow.lineColor!;
        canvas.stroke();
      }
    });

    const handleErase = (e: React.MouseEvent | MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      const mouseX = e.clientX - rect!.left;
      const mouseY = e.clientY - rect!.top;

      console.log("x: ", mouseX, "y: ", mouseY);
    }

    canvasRef.current?.addEventListener("mousemove", (e) => handleErase(e));

  }, [arrows, CTX, functionality]);

  // useEffect(() => {
  //   const canvas = LineCTX.current;
  //   lines.forEach(line => {
  //     if (canvas) {
  //       canvas.beginPath();
  //       canvas.moveTo(line.startX, line.startY);
  //       canvas.lineTo(line.endX, line.endY);
  //       canvas.lineWidth = line.lineWidth;
  //       canvas.strokeStyle = line.lineColor;
  //       canvas.stroke();
  //     }
  //   })
  // }, [lines, LineCTX, functionality])

  return (
    visibleContent &&
    <>
      <section className='relative w-screen h-screen pr-10'>
        <div ref={messageRef} className='bg-white w-fit h-fit rounded-md absolute top-4 left-1/2 transform -translate-x-1/2 z-50 shadow-md shadow-gray-400 py-3 px-4 flex justify-between items-center gap-4'>
          <p className='text-gray-600 text-lg font-semibold'> Send this <span className='text-lg text-blue-500 underline font-bold cursor-copy' onClick={copyToClipBoard}> {meetingCode} </span> to your team, friends to collaborate </p>
          <button onClick={hideMessage}>
            <CloseOutlinedIcon className='text-gray-600' />
          </button>
        </div>

        {
          toggleBox &&
          <>
            <audio ref={audioRef} src="/sounds/notification.wav" autoPlay />
            <div ref={userJoinedBox} className='bg-white w-fit h-fit rounded-md absolute bottom-20 left-4 z-50 shadow-md shadow-gray-400 py-3 px-4 flex justify-between items-center gap-4'>
              <p className='text-gray-600 text-base font-semibold'> <span className='text-lg text-blue-500 underline font-bold cursor-copy' onClick={copyToClipBoard}> {userJoined} </span> joined into your team </p>
              <button onClick={hideuserJoinedMessage}>
                <CloseOutlinedIcon className='text-gray-600' />
              </button>
            </div>
          </>
        }

        <UserFeatures />
        <ChatComponent />
        <Sidebar />
        <canvas className={`bg-white rounded-md shadow-md w-screen h-screen ${functionality === 'eraser' ? 'cursor-auto' : 'cursor-crosshair'}`} ref={canvasRef} >
        </canvas>

        {
          images.map(image => (
            <div key={image.id}
              style={{
                position: 'absolute',
                top: `${image.y}px`,
                left: `${image.x}px`,
                width: "fit-content",
                height: "fit-content",
              }}
            >
              <Image key={image.id} src={image.src} alt='image' height={image.height} width={image.width}
                style={{
                  width: `${image.width}px`,
                  height: `${image.height}px`,
                  filter: `saturate(${image.saturation}%) brightness(${image.brightness}) contrast(${image.contrast})`,
                }}
                className={`${image.modify === true ? 'border-4 border-blue-400' : ''} ${functionality === "hand" ? "cursor-grab" : "cursor-default"}`}
                onMouseOver={() => handleErase(image.id)}
                onClick={() => handleImageSelect(image.id)}
                onMouseDown={(e) => handleImageClick(e, image.id)}
                onMouseMove={(e) => handleImageMove(e)}
                onMouseUp={handleImageMoveStop}
              />
              <div className={`border border-blue-400 bg-blue-100 w-6 h-3 absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 ${(image.modify) ? 'visible' : 'hidden'} cursor-e-resize`} onMouseDown={handleImgResizeStart} onMouseMove={handleImgWidthResize} onMouseUp={handleImgResizeStop} />
              <div className={`border border-blue-400 bg-blue-100 w-3 h-6 absolute bottom-0 left-1/2 transform translate-y-1/2 -translate-x-1/2 ${(image.modify) ? 'visible' : 'hidden'} cursor-ns-resize`} onMouseDown={handleImgResizeStart} onMouseMove={handleImgHeightResize} onMouseUp={handleImgResizeStop} />
            </div>
          ))
        }

        {
          shapes.map(shape => (
            shape.shapeType === "hexagon" ? <div key={shape.id}
              style={{
                position: 'absolute',
                top: `${shape.y}px`,
                left: `${shape.x}px`,
                width: '150px',
                height: '150px',
                backgroundColor: 'transparent',
                border: '5px solid black',
                clipPath: 'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)'
              }}
              onMouseDown={(e) => handleClick(e, shape.id)} onMouseMove={(e) => handleMove(e)} onMouseUp={handleStop}
              onMouseOver={(e) => handleEraser(e, shape.id)}
            /> :

              shape.shapeType === "circle" ?
                <div key={shape.id}
                  style={{
                    position: 'absolute',
                    top: `${shape.y}px`,
                    left: `${shape.x}px`,
                    width: `${shape.width}px`,
                    height: `${shape.height}px`
                  }}
                  className={`${textBrightnessMap.get(shape.opacity)} ${borderColorMap.get(shape.shapeColor)} rounded-full ${shape.patternType === 'transparent' ? 'bg-transparent' : shape.patternType === 'opaque' ? 'bg-white' : shape.patternType === 'coloured' ? `${bgColorMap.get(shape.shapeColor)} bg-opacity-60` : 'bg-gradient-to-b from-red-600 via-pink-600 to-purple-600'} ${shape.borderType === 'roundedBorder' ? 'rounded-full' : shape.borderType === 'dashedBorder' ? 'border-dashed' : shape.borderType === 'solidBorder' ? 'rounded-full' : 'border-dotted'} ${functionality === 'hand' ? 'hover:cursor-grab' : 'cursor-auto'} ${(shape.modify) ? 'border-2' : 'border-4'}`}
                  onMouseDown={(e) => handleClick(e, shape.id)} onMouseMove={(e) => handleMove(e)} onMouseUp={handleStop}
                  onMouseOver={(e) => handleEraser(e, shape.id)} onClick={() => handleShapeSelected(shape.id)}
                >
                  <div className={`border border-blue-400 bg-blue-100 w-3 h-3 absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 ${(shape.modify) ? 'visible' : 'hidden'} cursor-e-resize`} onMouseDown={handleShapeResizeStart} onMouseMove={handleWidthResize} onMouseUp={handleShapeResizingStop} />
                  <div className={`border border-blue-400 bg-blue-100 w-3 h-3 absolute bottom-0 left-1/2 transform translate-y-1/2 -translate-x-1/2 ${(shape.modify) ? 'visible' : 'hidden'} cursor-ns-resize`} onMouseDown={handleShapeResizeStart} onMouseMove={handleHeightResize} onMouseUp={handleShapeResizingStop} />
                </div> :

                <div key={shape.id}
                  style={{
                    position: 'absolute',
                    top: `${shape.y}px`,
                    left: `${shape.x}px`,
                    width: `${shape.width}px`,
                    height: `${shape.height}px`
                  }}
                  className={`${textBrightnessMap.get(shape.opacity)} ${borderColorMap.get(shape.shapeColor)} ${shape.patternType === 'transparent' ? 'bg-transparent' : shape.patternType === 'opaque' ? 'bg-white' : shape.patternType === 'coloured' ? `${bgColorMap.get(shape.shapeColor)} bg-opacity-60` : 'bg-gradient-to-b from-red-600 via-pink-600 to-purple-600'} ${shape.borderType === 'roundedBorder' ? 'rounded-md' : shape.borderType === 'dashedBorder' ? 'border-dashed' : shape.borderType === 'solidBorder' ? 'rounded-none' : 'border-dotted'} ${functionality === 'hand' ? 'hover:cursor-grab' : 'cursor-auto'} ${(shape.modify) ? 'border-2' : 'border-4'}`}
                  onMouseDown={(e) => handleClick(e, shape.id)} onMouseMove={(e) => handleMove(e)} onMouseUp={handleStop}
                  onMouseOver={(e) => handleEraser(e, shape.id)} onClick={() => handleShapeSelected(shape.id)}
                >
                  <div className={`border border-blue-400 bg-blue-100 w-6 h-3 absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 ${(shape.modify) ? 'visible' : 'hidden'} cursor-e-resize`} onMouseDown={handleShapeResizeStart} onMouseMove={handleWidthResize} onMouseUp={handleShapeResizingStop} />
                  <div className={`border border-blue-400 bg-blue-100 w-3 h-6 absolute bottom-0 left-1/2 transform translate-y-1/2 -translate-x-1/2 ${(shape.modify) ? 'visible' : 'hidden'} cursor-ns-resize`} onMouseDown={handleShapeResizeStart} onMouseMove={handleHeightResize} onMouseUp={handleShapeResizingStop} />
                </div>
          ))
        }

        {
          notes.map((note) => (
            <div key={note.id} className='w-full h-full border-4 border-blue-500 z-40 bg-blue-300 p-2'>
              <textarea key={note.id} cols={15} rows={5} onBlur={removeNote}
                style={{
                  position: 'absolute',
                  top: `${note.y}px`,
                  left: `${note.x}px`,
                  padding: '8px 8px',
                }}
                autoFocus
                className={`${note.noteTextSize} ${note.noteFontFamily} ${note.noteTextAlign} ${bgColorMap.get(note.noteBackgroundColor)} ${noteTextBrightnessMap.get(note.noteTextBrightness)} rounded-md outline-none resize-none  text-black ${functionality === 'hand' ? 'hover:cursor-grab' : 'cursor-auto'} ${note.modify ? 'border-4 border-blue-300' : ''} ${functionality === "arrow" ? 'cursor-default' : ''}`}
                value={note.text}
                onChange={(e) => settingNoteText(e, note.id)}
                onMouseDown={(e) => handleNotesClick(e, note.id)} onMouseMove={(e) => handleNotesMove(e)} onMouseUp={handleNotesStop}
                onMouseOver={(e) => handleNotesEraser(e, note.id)} onClick={() => handleModify(note.id)}
              >
              </textarea>
            </div>
          ))
        }

        {
          inputs.map((input) => (
            <input key={input.id} type='text' onBlur={() => removeInput()}
              style={{
                position: "absolute",
                left: `${input.x}px`,
                top: `${input.y}px`,
                height: "auto",
                width: "auto",
                minWidth: "50px",
                padding: '4px 8px',
                outline: 'none',
                backgroundColor: 'transparent',
                overflow: "hidden"
              }}
              className={`${textColorMap.get(input.textColor)} ${input.fontFamily} ${input.textAlign} ${input.textSize} ${textBrightnessMap.get(input.textBrightness)} ${functionality === 'hand' ? 'hover:cursor-grab' : 'cursor-auto'} ${functionality === "arrow" ? "cursor-default" : ''} ${input.modify ? "border-2 border-blue-300" : ""}`}
              value={input.text}
              autoFocus
              onChange={(e) => settingText(e, input.id)}
              onMouseDown={(e) => handleTextClick(e, input.id)} onMouseMove={(e) => handleTextMove(e)} onMouseUp={handleTextStop}
              onMouseOver={() => handleTextEraser(input.id)} onClick={() => handleInputModify(input.id)}
            />
          ))
        }
        <BottomBar />
      </section >
    </>
  )
}
