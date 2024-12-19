import React, { useCallback, useEffect, useRef, useState } from 'react'
import stickyNotesFeature from '../Interfaces/stickyNotesFeature'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import note from '../Interfaces/note';
import { setSelectedItem } from '../Redux/slices/selectedItem';

export default function StickyNotesFeatures({ canvasRef, noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, noteTextAlign }: stickyNotesFeature) {
    const functionality = useAppSelector(state => state.Functionality.functionality);
    const [notes, setNotes] = useState<note[]>([]);
    const isMoving = useRef(false);
    const notesId = useRef(0);
    const XPos = useRef(0);
    const YPos = useRef(0);
    const isEraserOpen = useAppSelector(state => state.Eraser.isEraserOpen);
    const noteId = useRef<number | null>(null);
    const noteRef = useRef<note | null>(null);
    const dispatch = useAppDispatch();

    const handleModify = (id: number) => {
        if (functionality === 'arrow') {
            if (notes.some(note => note.resize === true)) {
                notes.forEach(note => note.resize = false);
            }
            const note = notes.find(note => note.id === id);
            noteId.current = id;
            if (note) {
                noteRef.current = note;
            };
            setNotes(prevNote =>
                prevNote.map(note =>
                    note.id === id ?
                        { ...note, resize: true } : note
                )
            )
            dispatch(setSelectedItem("note"))
        }
    }

    const handleNoteModify = () => {
        setNotes(prevNotes =>
            prevNotes.map(note =>
                (note.id === noteId.current && note.resize) ?
                    { ...note, noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, noteTextAlign } : note
            )
        )
    }

    const handleModifyStop = () => {
        setNotes(prevNote =>
            prevNote.map(note =>
                note.resize === true ?
                    { ...note, resize: false } : note
            )
        )
    }

    const handleNotesEraser = useCallback((e: MouseEvent | React.MouseEvent, id: number) => {
        if (isEraserOpen) {
            let updatedNotes = notes.filter(shape => shape.id !== id);
            setNotes(updatedNotes);
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
        }
    }, [notes])

    const handleNotesStop = useCallback(() => {
        isMoving.current = false;
    }, [])

    useEffect(() => {
        handleNoteModify();
    }, [noteBackgroundColor, noteFontFamily, noteTextSize, noteTextBrightness, noteTextAlign])

    useEffect(() => {
        const handleCanvasClick = (e: MouseEvent) => {
            if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                const XPosition = e.clientX - rect.left;
                const YPosition = e.clientY - rect.top;

                setNotes((prev) => [
                    ...prev,
                    { id: prev.length + 1, x: XPosition, y: YPosition, text: '', noteTextSize, noteFontFamily, noteBackgroundColor, noteTextBrightness, resize: false, noteTextAlign},
                ]);
            }
        };

        const canvasElement = canvasRef.current;
        if (canvasElement) {
            if (functionality === 'notes' && !notes.some(note => note.resize === true)) {
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
    }

    const settingNoteText = (e: React.ChangeEvent, id: number) => {
        let target = e.target as HTMLTextAreaElement;
        let updatedNotes = notes.map(note =>
            note.id === id ?
                { ...note, text: target.value } : note
        )
        setNotes(updatedNotes)
    }

    return { notes, removeNote, settingNoteText, handleNotesClick, handleNotesMove, handleNotesStop, handleNotesEraser, handleModify };
}
