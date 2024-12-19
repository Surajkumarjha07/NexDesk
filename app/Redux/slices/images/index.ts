import React from "react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import image from "@/app/Interfaces/image";

const initialState = {
    images: <image[]>[],
    imageBrightness: 1,
    imageContrast: 1,
    imageSaturation: 100
}

export const ImageSlice = createSlice({
    initialState,
    name: 'ImageFeatures',
    reducers: {
        setImages: (state, action: PayloadAction<image | image[]>) => {
            const newImages = Array.isArray(action.payload) ? action.payload : [action.payload];

            newImages.forEach(newImage => {
                const index = state.images.findIndex(image => image.id === newImage.id);
                if (index !== -1) {
                    state.images[index] = newImage;
                } else {
                    state.images.push(newImage);
                }
            });
        },
        deleteImage: (state, action: PayloadAction<number>) => {
            let updatedArr = state.images.filter(image => image.id !== action.payload)
            state.images = updatedArr;
        },
        setImageBrightness: (state, action) => {
            state.imageBrightness = action.payload;
        },
        setImageContrast: (state, action) => {
            state.imageContrast = action.payload;
        },
        setImageSaturation: (state, action) => {
            state.imageSaturation = action.payload;
        }
    }
});


export const { setImages, deleteImage, setImageBrightness, setImageContrast, setImageSaturation } = ImageSlice.actions;
export default ImageSlice.reducer;