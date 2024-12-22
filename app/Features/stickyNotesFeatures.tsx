import React, { useCallback, useEffect, useRef, useState } from 'react'
import stickyNotesFeature from '../Interfaces/stickyNotesFeature'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import note from '../Interfaces/note';
import { setSelectedItem } from '../Redux/slices/selectedItem';
import { useSocket } from '../socketContext';

export default function StickyNotesFeatures({ canvasRef, noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, noteTextAlign }: stickyNotesFeature) {
    const functionality = useAppSelector(state => state.Functionality.functionality);
    const [notes, setNotes] = useState<note[]>([]);
    const isMoving = useRef(false);
    const notesId = useRef(0);
    const XPos = useRef(0);
    const YPos = useRef(0);
    const isEraserOpen = useAppSelector(state => state.Eraser.isEraserOpen);
    const isModified = useRef(false);
    const noteId = useRef<number | null>(null);
    const noteRef = useRef<note | null>(null);
    const dispatch = useAppDispatch();
    const socket = useSocket();
    const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);

    const handleModify = (id: number) => {
        if (functionality === 'arrow') {
            if (notes.some(note => note.modify === true)) {
                notes.forEach(note => note.modify = false);
            }
            const note = notes.find(note => note.id === id);
            noteId.current = id;
            if (note) {
                noteRef.current = note;
            };
            setNotes(prevNote =>
                prevNote.map(note =>
                    note.id === id ?
                        { ...note, modify: true } : note
                )
            )
            isModified.current = true;
            dispatch(setSelectedItem("note"))
            if (socket) {
                socket.emit("noteSelect", { meetingCode, id })
            }
        }
    }

    const handleNoteModify = () => {
        if (isModified.current) {
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    (note.id === noteId.current && note.modify) ?
                        { ...note, noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, noteTextAlign } : note
                )
            )
            if (socket) {
                socket.emit("noteModify", { meetingCode, id: noteId.current, noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, noteTextAlign });
            }
        }
    }

    const handleModifyStop = () => {
        isModified.current = false;
        setNotes(prevNote =>
            prevNote.map(note =>
                note.modify === true ?
                    { ...note, modify: false } : note
            )
        )
        if (socket) {
            socket.emit("noteUnSelect", meetingCode);
        }
    }

    const handleNotesEraser = useCallback((e: MouseEvent | React.MouseEvent, id: number) => {
        if (isEraserOpen) {
            let updatedNotes = notes.filter(shape => shape.id !== id);
            setNotes(updatedNotes);
            if (socket) {
                socket.emit("noteErase", { meetingCode, id });
            }
        }

    }, [isEraserOpen, notes])


    const handleNotesClick = useCallback((e: MouseEvent | React.MouseEvent, id: number) => {
        if (functionality === 'hand') {
            notesId.current = id;
            let note = notes.find(note => note.id === id);
            if (note) {
                XPos.current = e.clientX - note.x;
                YPos.current = e.clientY - note.y;
            }
            isMoving.current = true;
        }
    }, [functionality, notes])

    const handleNotesMove = useCallback((e: MouseEvent | React.MouseEvent) => {
        if (isMoving.current) {
            let XPosition = e.clientX - XPos.current;
            let YPosition = e.clientY - YPos.current;

            let updatedNotes = notes.map(note =>
                note.id === notesId.current ?
                    { ...note, x: XPosition, y: YPosition } : note
            )
            setNotes(updatedNotes);
            if (socket) {
                socket.emit("noteMove", { meetingCode, id: noteId.current, x: XPosition, y: YPosition });
            }
        }
    }, [notes])

    const handleNotesStop = useCallback(() => {
        isMoving.current = false;
    }, [])

    useEffect(() => {
        handleNoteModify();
    }, [noteBackgroundColor, noteFontFamily, noteTextSize, noteTextBrightness, noteTextAlign])

    useEffect(() => {

        const handleItemDrawed = (data: any) => {
            const { id, x, y, text, noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, modify, noteTextAlign } = data;
            setNotes(prev => [
                ...prev,
                { id, x, y, text, noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, modify, noteTextAlign }
            ])
        }

        const handleNoteText = (data: any) => {
            const { id, value } = data;
            console.log(data);
            let updatedNotes = notes.map(note =>
                note.id === id ?
                    { ...note, text: value } : note
            )
            setNotes(updatedNotes)
        }

        const handleNoteRemoved = () => {
            let updatedNotes = notes.filter(note => note.text !== "");
            setNotes(updatedNotes);
        }

        const handleNoteSelected = (id: number) => {
            if (notes.some(note => note.modify === true)) {
                notes.forEach(note => note.modify = false);
            }
            const note = notes.find(note => note.id === id);
            noteId.current = id;
            if (note) {
                noteRef.current = note;
            };
            setNotes(prevNote =>
                prevNote.map(note =>
                    note.id === id ?
                        { ...note, modify: true } : note
                )
            )
            dispatch(setSelectedItem("note"))
        }

        const handleNoteModified = (data: any) => {
            const { id, noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, noteTextAlign } = data;
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note.id === id ?
                        { ...note, noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, noteTextAlign } : note
                )
            )
        }

        const handleNoteUnSelected = () => {
            setNotes(prevNote =>
                prevNote.map(note =>
                    note.modify === true ?
                        { ...note, modify: false } : note
                )
            )
        }

        const handleNoteErased = (id: number) => {
            let updatedNotes = notes.filter(shape => shape.id !== id);
            setNotes(updatedNotes);
        }

        const handleNoteMoved = (data: any) => {
            const { id, x, y } = data;
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note.id === id ?
                        { ...note, x, y } : note
                )
            )
        }

        if (socket) {
            socket.on("noteDrawed", handleItemDrawed);
            socket.on("noteTextSetted", handleNoteText);
            socket.on("noteRemoved", handleNoteRemoved);
            socket.on("noteSelected", handleNoteSelected);
            socket.on("noteModified", handleNoteModified);
            socket.on("noteUnSelected", handleNoteUnSelected);
            socket.on("noteErased", handleNoteErased);
            socket.on("noteMoved", handleNoteMoved);
        }

        return () => {
            if (socket) {
                socket.off("noteDrawed", handleItemDrawed);
                socket.off("noteTextSetted", handleNoteText);
                socket.off("noteRemoved", handleNoteRemoved);
                socket.off("noteSelected", handleNoteSelected);
                socket.off("noteModified", handleNoteModified);
                socket.off("noteUnSelected", handleNoteUnSelected);
                socket.off("noteErased", handleNoteErased);
                socket.off("noteMoved", handleNoteMoved);
            }
        }
    }, [socket, dispatch, notes])

    useEffect(() => {
        const handleCanvasClick = (e: MouseEvent) => {
            if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                const XPosition = e.clientX - rect.left;
                const YPosition = e.clientY - rect.top;

                setNotes((prev) => [
                    ...prev,
                    { id: prev.length + 1, x: XPosition, y: YPosition, text: '', noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, modify: false, noteTextAlign },
                ]);
                if (socket && meetingCode && XPosition && YPosition) {
                    socket.emit("noteDraw", { meetingCode, id: notes.length + 1, x: XPosition, y: YPosition, text: '', noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, modify: false, noteTextAlign })
                }
            }
        };

        const canvasElement = canvasRef.current;
        if (canvasElement) {
            if (functionality === 'notes' && !notes.some(note => note.modify === true)) {
                canvasElement.addEventListener("click", handleCanvasClick);
            } else {
                canvasElement.addEventListener("click", handleModifyStop);
            }
        }

        return () => {
            if (canvasElement) {
                canvasElement.removeEventListener("click", handleCanvasClick);
                canvasElement.removeEventListener("click", handleModifyStop);
            }
        };
    }, [functionality, noteBackgroundColor, noteTextSize, noteFontFamily, noteTextBrightness, noteTextAlign, notes])

    const removeNote = () => {
        let filterArr1 = notes.filter(note => note.text != "")
        setNotes(filterArr1);
        if (socket) {
            socket.emit("noteRemove", meetingCode)
        }
    }

    const settingNoteText = (e: React.ChangeEvent, id: number) => {
        let target = e.target as HTMLTextAreaElement;
        if (socket) {
            socket.emit("setNoteText", { meetingCode, id, value: target.value });
        }
        let updatedNotes = notes.map(note =>
            note.id === id ?
                { ...note, text: target.value } : note
        )
        setNotes(updatedNotes)
    }

    return { notes, removeNote, settingNoteText, handleNotesClick, handleNotesMove, handleNotesStop, handleNotesEraser, handleModify };
}
