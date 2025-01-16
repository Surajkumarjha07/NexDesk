"use client"
import Sidebar from '@/app/components/Sidebar';
import React, { useEffect, useRef, useState } from 'react';
import BottomBar from '@/app/components/BottomBar';
import { useAppDispatch, useAppSelector } from '@/app/Redux/hooks';
import StickyNotesFeatures from '@/app/Features/stickyNotesFeatures';
import { bgColorMap, borderColorMap, noteTextBrightnessMap, textBrightnessMap, textColorMap } from '../../ObjectMapping';
import UserFeatures from '@/app/components/UserFeatures';
import ChatComponent from '@/app/components/ChatComponent';
import Image from 'next/image';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useSocket } from '@/app/socketContext';
import { useRouter } from 'next/navigation';
import CanvasShapeFeatures from '@/app/Features/canvasShapeFeature';
import CanvasTextFeatures from '@/app/Features/canvasTextFeatures';
import CanvasImageFeatures from '@/app/Features/canvasImageFeatures';
import { setDisconnectedUser } from '@/app/Redux/slices/user';
import Save from '@/app/components/save';
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

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
  const userDisconnectRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [visibleContent, setVisibleContent] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [toggleDisconnectBox, setToggleDisconnectBox] = useState<boolean>(false);
  const disconnectedUser = useAppSelector(state => state.UserCredential.disconnectedUser);
  const confirmSaveWhiteboard = useAppSelector(state => state.UserCredential.confirmSaveWhiteboard);
  const isNewMeeting = useAppSelector(state => state.MeetingCode.isNewMeeting);
  const isDarkMode = useAppSelector(state => state.DarkMode.isDarkMode);
  const [cookie, setCookie] = useState<string>("");

  useEffect(() => {
    const fetchedCookie = Cookies.get("authtoken");
    if (!fetchedCookie) {
      router.push("/");
    }
    else {
      setCookie(fetchedCookie);
    }
    const authorized = async () => {
      try {
        await fetch("https://nexdesk-backend.onrender.com/userAuthenticated", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`
          },
          credentials: "include"
        })
          .then(response => {
            if (response.status === 200 || response.ok) {
              setVisibleContent(true);
            }
            else {
              router.push("/");
            }
          })
      } catch (error) {
        console.error("error: ", error);
        toast.error("Unable to authorize. Please try again later.", {
          hideProgressBar: true,
          autoClose: 2000,
          position: "top-center",
        });
        router.push("/")
      }
    };

    if (cookie) {
      authorized();
    }
  }, [router, cookie]);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUserDisconnected = (data: any) => {
    const { username } = data;
    dispatch(setDisconnectedUser(username));
    setToggleDisconnectBox(true);
    setTimeout(() => {
      setToggleDisconnectBox(false);
    }, 5000);
  }

  const handleURDisconnected = () => {
    router.push("../Home");
  }

  useEffect(() => {
    if (socket) {
      socket.on("userDisconnected", handleUserDisconnected);
      socket.on("urDisconnected", handleURDisconnected);
    }

    return () => {
      if (socket) {
        socket.off("userDisconnected", handleUserDisconnected);
        socket.off("urDisconnected", handleURDisconnected);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  return (
    visibleContent &&
    <>
      <section className='relative w-screen h-screen pr-10'>

        {
          isNewMeeting &&
          <div ref={messageRef} className={`${isDarkMode ? "bg-gray-800 shadow-none" : "bg-white shadow-gray-400 shadow-sm"} w-fit h-fit rounded-md absolute top-4 left-1/2 transform -translate-x-1/2 z-30 py-3 px-4 flex justify-between items-center gap-4`}>
            <p className={`${isDarkMode ? "text-white" : "text-gray-600"} text-lg font-semibold`}> Send this <span className='text-lg text-blue-500 underline font-bold cursor-copy' onClick={copyToClipBoard}> {meetingCode} </span> to your team, friends to collaborate </p>
            <button onClick={hideMessage}>
              <CloseOutlinedIcon className={`${isDarkMode ? "text-white" : "text-gray-600"}`} />
            </button>
          </div>
        }

        {
          confirmSaveWhiteboard &&
          <>
            <div className='absolute top-0 w-screen h-screen bg-gray-400 backdrop-filter bg-opacity-45 z-40' />
            <Save texts={inputs} shapes={shapes} notes={notes} images={images} />
          </>
        }

        {
          toggleBox &&
          <>
            <audio ref={audioRef} src="/sounds/notification.wav" autoPlay />
            <div ref={userJoinedBox} className={`${isDarkMode ? "bg-gray-800 shadow-none" : "bg-white shadow-sm shadow-gray-400"} w-fit h-fit rounded-md absolute bottom-20 left-4 z-50 py-3 px-4 flex justify-between items-center gap-4`}>
              <p className={`${isDarkMode ? "text-white" : "text-gray-600"} text-gray-600 text-base font-semibold`}> <span className='text-lg text-blue-500 underline font-bold cursor-copy' onClick={copyToClipBoard}> {userJoined} </span> joined into your team </p>
              <button onClick={hideuserJoinedMessage}>
                <CloseOutlinedIcon className={`${isDarkMode ? "text-white" : "text-gray-600"}`} />
              </button>
            </div>
          </>
        }

        {
          toggleDisconnectBox &&
          <>
            <audio ref={audioRef} src="/sounds/notification.wav" autoPlay />
            <div ref={userDisconnectRef} className={`${isDarkMode ? "bg-gray-800 shadow-none" : "bg-white shadow-sm shadow-gray-400 "} w-fit h-fit rounded-md absolute bottom-20 left-4 z-50 py-3 px-4 flex justify-between items-center gap-4`}>
              <p className={`${isDarkMode ? "text-white" : "text-gray-600"} text-gray-600 text-base font-semibold`}> <span className='text-lg text-blue-500 underline font-bold cursor-copy' onClick={copyToClipBoard}> {disconnectedUser} </span> has left the room </p>
              <button onClick={hideuserJoinedMessage}>
                <CloseOutlinedIcon className={`${isDarkMode ? "text-white" : "text-gray-600"}`} />
              </button>
            </div>
          </>
        }

        <UserFeatures />
        <ChatComponent />
        <Sidebar />
        <canvas className={`${isDarkMode ? "bg-gray-900" : "bg-white"} rounded-md w-screen h-screen ${functionality === 'eraser' ? 'cursor-auto' : 'cursor-crosshair'}`} ref={canvasRef} >
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
                width: `auto`,
                padding: '4px 8px',
                outline: 'none',
                backgroundColor: 'transparent',
              }}

              className={`rounded-lg ${textColorMap.get(input.textColor)} ${input.fontFamily} ${input.textAlign} ${input.textSize} ${textBrightnessMap.get(input.textBrightness)} ${functionality === 'hand' ? 'hover:cursor-grab' : 'cursor-auto'} ${functionality === "arrow" ? "cursor-default" : ''} ${input.modify ? "border-2 border-blue-500" : ""}`}
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
