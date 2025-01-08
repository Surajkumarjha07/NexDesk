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
    const XPos = useRef(0);
    const YPos = useRef(0);
    const isEraserOpen = useAppSelector(state => state.Eraser.isEraserOpen);
    const isModified = useRef(false);
    const noteId = useRef<number | null>(null);
    const noteRef = useRef<note | null>(null);
    const dispatch = useAppDispatch();
    const socket = useSocket();
    const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);
    const selectedItem = useAppSelector(state => state.SelectedItem.selectedItem);

    useEffect(() => {
        if (notes.some(note => note.modify === true) || !(selectedItem === "note")) {
            notes.forEach(note => note.modify = false);
        }
    }, [selectedItem, notes])

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
            const updatedNotes = notes.filter(shape => shape.id !== id);
            setNotes(updatedNotes);
            if (socket) {
                socket.emit("noteErase", { meetingCode, id });
            }
        }

    }, [isEraserOpen, notes, meetingCode, socket])


    const handleNotesClick = useCallback((e: MouseEvent | React.MouseEvent, id: number) => {
        if (functionality === 'hand') {
            noteId.current = id;
            const note = notes.find(note => note.id === id);
            if (note) {
                XPos.current = e.clientX - note.x;
                YPos.current = e.clientY - note.y;
            }
            isMoving.current = true;
        }
    }, [functionality, notes])

    const handleNotesMove = useCallback((e: MouseEvent | React.MouseEvent) => {
        if (isMoving.current) {
            const XPosition = e.clientX - XPos.current;
            const YPosition = e.clientY - YPos.current;

            const updatedNotes = notes.map(note =>
                note.id === noteId.current ?
                    { ...note, x: XPosition, y: YPosition } : note
            )
            setNotes(updatedNotes);
            if (socket) {
                socket.emit("noteMove", { meetingCode, id: noteId.current, x: XPosition, y: YPosition });
            }
        }
    }, [notes, meetingCode, socket])

    const handleNotesStop = useCallback(() => {
        isMoving.current = false;
    }, [])

    useEffect(() => {
        handleNoteModify();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteBackgroundColor, noteFontFamily, noteTextSize, noteTextBrightness, noteTextAlign])

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleItemDrawed = (data: any) => {
            const { id, x, y, text, noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, modify, noteTextAlign } = data;
            setNotes(prev => [
                ...prev,
                { id, x, y, text, noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, modify, noteTextAlign }
            ])
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleNoteText = (data: any) => {
            const { id, value } = data;
            const updatedNotes = notes.map(note =>
                note.id === id ?
                    { ...note, text: value } : note
            )
            setNotes(updatedNotes)
        }

        const handleNoteRemoved = () => {
            const updatedNotes = notes.filter(note => note.text !== "");
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            const updatedNotes = notes.filter(shape => shape.id !== id);
            setNotes(updatedNotes);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [functionality, noteBackgroundColor, noteTextSize, noteFontFamily, noteTextBrightness, noteTextAlign, canvasRef, notes, meetingCode, socket])

    const removeNote = () => {
        const filterArr1 = notes.filter(note => note.text != "")
        setNotes(filterArr1);
        if (socket) {
            socket.emit("noteRemove", meetingCode)
        }
    }

    const settingNoteText = (e: React.ChangeEvent, id: number) => {
        const target = e.target as HTMLTextAreaElement;
        if (socket) {
            socket.emit("setNoteText", { meetingCode, id, value: target.value });
        }
        const updatedNotes = notes.map(note =>
            note.id === id ?
                { ...note, text: target.value } : note
        )
        setNotes(updatedNotes)
    }

    return { notes, removeNote, settingNoteText, handleNotesClick, handleNotesMove, handleNotesStop, handleNotesEraser, handleModify };
}
