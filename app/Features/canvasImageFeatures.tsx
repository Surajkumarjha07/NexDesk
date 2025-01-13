import React, { RefObject, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import { deleteImage, setImages } from '../Redux/slices/images';
import { setSelectedItem } from '../Redux/slices/selectedItem';
import { useSocket } from '../socketContext';
import image from '../Interfaces/image';

type imageDependencies = {
    canvasRef: RefObject<HTMLCanvasElement>,
}

export default function CanvasImageFeatures({ canvasRef }: imageDependencies) {
    const functionality = useAppSelector(state => state.Functionality.functionality);
    const imageId = useRef<number>(0);
    const imageRef = useRef<image | null>(null);
    const images = useAppSelector(state => state.ImageFeatures.images);
    const dispatch = useAppDispatch();
    const isEraserOpen = useAppSelector(state => state.Eraser.isEraserOpen);
    const isMoving = useRef<boolean>(false);
    const XPos = useRef(0);
    const YPos = useRef(0);
    const imgBrightness = useAppSelector(state => state.ImageFeatures.imageBrightness);
    const imgContrast = useAppSelector(state => state.ImageFeatures.imageContrast);
    const imgSaturation = useAppSelector(state => state.ImageFeatures.imageSaturation);
    const isModifying = useRef<boolean>(false);
    const isResizing = useRef<boolean>(false);
    const socket = useSocket();
    const meetingCode = useAppSelector(state => state.MeetingCode.meetingCode);
    const selectedItem = useAppSelector(state => state.SelectedItem.selectedItem);
    const openedWhiteboard = useAppSelector(state => state.Whiteboard.openedWhiteboard);
    const isNewMeeting = useAppSelector(state => state.MeetingCode.isNewMeeting);

    useEffect(() => {
        dispatch(setImages(openedWhiteboard.images));
    }, [openedWhiteboard, dispatch]);

    useEffect(() => {
        if (images.some(image => image.modify === true) && !(selectedItem === "image")) {
            const updatedArr = images.map(image => ({
                ...image,
                modify: false
            })
            )
            dispatch(setImages(updatedArr));
        }
    }, [selectedItem, dispatch, images])

    const handleImageSelect = (id: number) => {
        if (functionality === 'arrow') {
            imageId.current = id;
            imageRef.current = images.find(image => image.id === id) || null;
            const updatedArr = images.map(image => ({
                ...image,
                modify: image.id === id ? true : false
            })
            );

            dispatch(setImages(updatedArr));
            dispatch(setSelectedItem("image"))
            isModifying.current = true;
            if (socket) {
                socket.emit("imageSelect", { meetingCode, id });
            }
        }
    };

    const handleImageModification = () => {
        if (isModifying.current) {
            const updatedArr = images.map(image =>
                ({ ...image, brightness: image.id === imageId.current ? imgBrightness : image.brightness, contrast: image.id === imageId.current ? imgContrast : image.contrast, saturation: image.id === imageId.current ? imgSaturation : image.saturation })
            )
            dispatch(setImages(updatedArr));
            if (socket) {
                socket.emit("imageModify", { meetingCode, id: imageId.current, imgBrightness, imgContrast, imgSaturation })
            }
        }
    }

    useEffect(() => {
        if (functionality === "arrow" && isModifying.current) {
            handleImageModification();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imgBrightness, imgContrast, imgSaturation, functionality])

    const handleImageModificationStop = () => {
        const updatedArray = images.map(image =>
            ({ ...image, modify: false })
        )
        dispatch(
            setImages(updatedArray)
        )
        isModifying.current = false
        isMoving.current = false;
        isResizing.current = false;
        if (socket) {
            socket.emit("imageUnSelect", meetingCode)
        }
    }

    const handleImageClick = (e: MouseEvent | React.MouseEvent, id: number) => {
        if (functionality === "hand") {
            e.preventDefault();
            const image = images.find(image => image.id === id);
            imageId.current = id;
            imageRef.current = image || null;
            if (image) {
                XPos.current = e.clientX - image.x;
                YPos.current = e.clientY - image.y;
            }
            isMoving.current = true;
        }
    }

    const handleImageMove = (e: React.MouseEvent | MouseEvent) => {
        if (functionality === "hand") {
            e.preventDefault();
            if (isMoving.current) {
                const XPosition = e.clientX - XPos.current;
                const YPosition = e.clientY - YPos.current;

                const updatedArr = images.map(image => (
                    { ...image, x: image.id === imageId.current ? XPosition : image.x, y: image.id === imageId.current ? YPosition : image.y }
                ))
                dispatch(setImages(updatedArr))
                if (socket) {
                    socket.emit("imageMove", { meetingCode, id: imageId.current, x: XPosition, y: YPosition });
                }
            }
        }
    }

    const handleImageMoveStop = () => {
        isMoving.current = false
    }

    const handleErase = (id: number) => {
        if (isEraserOpen) {
            dispatch(deleteImage(id));
            if (socket) {
                socket.emit("imageErase", { meetingCode, id });
            }
        }
    }

    const handleImgResizeStart = () => {
        isResizing.current = true;
    }

    const handleImgWidthResize = (e: MouseEvent | React.MouseEvent) => {
        if (isResizing.current) {
            let newWidth: number;
            if (imageRef.current) {
                newWidth = (e.clientX - imageRef.current.x);
            }
            const updatedImages = images.map(image => (
                { ...image, width: image.id === imageId.current ? newWidth : image.width }
            ))
            dispatch(setImages(updatedImages));
            if (socket) {
                socket.emit("imageWidthResize", { meetingCode, id: imageId.current, newWidth: newWidth! })
            }
        }
    }

    const handleImgHeightResize = (e: MouseEvent | React.MouseEvent) => {
        if (isResizing.current) {
            let newHeight: number;
            if (imageRef.current) {
                newHeight = (e.clientY - imageRef.current.y);
            }
            const updatedImages = images.map(image => (
                { ...image, height: image.id === imageId.current ? newHeight : image.height }
            ))
            dispatch(setImages(updatedImages));
            if (socket) {
                socket.emit("imageHeightResize", { meetingCode, id: imageId.current, newHeight: newHeight! })
            }
        }
    }

    const handleImgResizeStop = () => {
        isResizing.current = false;
    }

    useEffect(() => {

        const handleImageSelected = (id: number) => {
            imageId.current = id;
            imageRef.current = images.find(image => image.id === id) || null;
            const updatedArr = images.map(image => ({
                ...image,
                modify: image.id === id ? true : false
            })
            );

            dispatch(setImages(updatedArr));
            dispatch(setSelectedItem("image"))
            isModifying.current = true;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleImageModified = (data: any) => {
            const { id, imgBrightness, imgContrast, imgSaturation } = data;
            const updatedArr = images.map(image =>
                ({ ...image, brightness: image.id === id ? imgBrightness : image.brightness, contrast: image.id === id ? imgContrast : image.contrast, saturation: image.id === id ? imgSaturation : image.saturation })
            )
            dispatch(setImages(updatedArr));
        }

        const handleImageUnSelected = () => {
            const updatedArray = images.map(image =>
                ({ ...image, modify: false })
            )
            dispatch(
                setImages(updatedArray)
            )
            isModifying.current = false
            isMoving.current = false;
            isResizing.current = false;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleImageMoved = (data: any) => {
            const { id, x, y } = data;

            const updatedArr = images.map(image => (
                { ...image, x: image.id === id ? x : image.x, y: image.id === id ? y : image.y }
            ))
            dispatch(setImages(updatedArr))
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleImageHeightResize = (data: any) => {
            const { id, newHeight } = data;
            const updatedImages = images.map(image => (
                { ...image, height: image.id === id ? newHeight : image.width }
            ))
            dispatch(setImages(updatedImages));
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleImageWidthResize = (data: any) => {
            const { id, newWidth } = data;
            const updatedImages = images.map(image => (
                { ...image, width: image.id === id ? newWidth : image.width }
            ))
            dispatch(setImages(updatedImages));
        }

        const handleImageErased = (id: number) => {
            dispatch(deleteImage(id));
        }

        if (socket) {
            socket.on("imageSelected", handleImageSelected);
            socket.on("imageModified", handleImageModified);
            socket.on("imageUnSelected", handleImageUnSelected);
            socket.on("imageMoved", handleImageMoved);
            socket.on("imageHeightResized", handleImageHeightResize);
            socket.on("imageWidthResized", handleImageWidthResize);
            socket.on("imageErased", handleImageErased);
        }

        return () => {
            if (socket) {
                socket.off("imageSelected", handleImageSelected);
                socket.off("imageModified", handleImageModified);
                socket.off("imageUnSelected", handleImageUnSelected);
                socket.off("imageMoved", handleImageMoved);
                socket.off("imageHeightResized", handleImageHeightResize);
                socket.off("imageWidthResized", handleImageWidthResize);
                socket.off("imageErased", handleImageErased);
            }
        }
    }, [socket, dispatch, images])

    useEffect(() => {
        if (isNewMeeting) {
            dispatch(setImages([]));
        }
    }, [isNewMeeting, dispatch]);

    useEffect(() => {

        const canvasElement = canvasRef.current;
        if (canvasElement) {
            if (functionality !== "images" && images.some(image => image.modify === true)) {
                canvasElement.addEventListener("click", handleImageModificationStop);
            }
        }

        return () => {
            if (canvasElement) {
                canvasElement.removeEventListener("click", handleImageModificationStop);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [functionality, images, canvasRef])

    return { images, handleImageSelect, handleErase, handleImageClick, handleImageMove, handleImageMoveStop, handleImgResizeStart, handleImgResizeStop, handleImgHeightResize, handleImgWidthResize }
}
