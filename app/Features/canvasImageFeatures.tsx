import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import image from '../Interfaces/image';
import { deleteImage, setImageBrightness, setImageContrast, setImages, setImageSaturation } from '../Redux/slices/images';
import { setSelectedItem } from '../Redux/slices/selectedItem';
import { useSocket } from '../socketContext';

type imageDependencies = {
    canvasRef: RefObject<HTMLCanvasElement>,
}

export default function canvasImageFeatures({ canvasRef }: imageDependencies) {
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
        }
    };

    const handleImageModification = () => {
        let updatedArr = images.map(image =>
            ({ ...image, brightness: image.id === imageId.current ? imgBrightness : image.brightness, contrast: image.id === imageId.current ? imgContrast : image.contrast, saturation: image.id === imageId.current ? imgSaturation : image.saturation })
        )

        dispatch(setImages(updatedArr));
    }

    useEffect(() => {
        if (functionality === "arrow" && isModifying.current) {
            handleImageModification();
        }
    }, [imgBrightness, imgContrast, imgSaturation])

    const handleImageModificationStop = () => {
        let updatedArray = images.map(image =>
            ({ ...image, modify: false })
        )
        dispatch(
            setImages(updatedArray)
        )
        isModifying.current = false
        isMoving.current = false;
        isResizing.current = false;
    }

    const handleImageClick = (e: MouseEvent | React.MouseEvent, id: number) => {
        if (functionality === "hand") {
            e.preventDefault();
            let image = images.find(image => image.id === id);
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
                let XPosition = e.clientX - XPos.current;
                let YPosition = e.clientY - YPos.current;

                let updatedArr = images.map(image => (
                    { ...image, x: image.id === imageId.current ? XPosition : image.x, y: image.id === imageId.current ? YPosition : image.y }
                ))
                dispatch(setImages(updatedArr))
            }
        }
    }

    const handleImageMoveStop = () => {
        isMoving.current = false
    }

    const handleErase = (id: number) => {
        if (isEraserOpen) {
            dispatch(deleteImage(id));
        }
    }

    const handleImgResizeStart = () => {
        isResizing.current = true;
    }

    const handleImgWidthResize = (e: MouseEvent | React.MouseEvent) => {
        if (isResizing.current) {
            let XPosition: number;
            if (imageRef.current) {
                XPosition = (e.clientX - imageRef.current.x);
            }
            let updatedImages = images.map(image => (
                { ...image, width: image.id === imageId.current ? XPosition : image.width }
            ))
            dispatch(setImages(updatedImages));
        }
    }

    const handleImgHeightResize = (e: MouseEvent | React.MouseEvent) => {
        if (isResizing.current) {
            let YPosition: number;
            if (imageRef.current) {
                YPosition = (e.clientY - imageRef.current.y);
            }
            let updatedImages = images.map(image => (
                { ...image, height: image.id === imageId.current ? YPosition : image.height }
            ))
            dispatch(setImages(updatedImages));
        }
    }

    const handleImgResizeStop = () => {
        isResizing.current = false;
    }

    useEffect(() => {

        if (socket) {

        }

        return () => {
            if (socket) {

            }
        }
    }, [])


    useEffect(() => {

        let canvasElement = canvasRef.current;
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
    }, [functionality, images])

    return { images, handleImageSelect, handleErase, handleImageClick, handleImageMove, handleImageMoveStop, handleImgResizeStart, handleImgResizeStop, handleImgHeightResize, handleImgWidthResize }
}
