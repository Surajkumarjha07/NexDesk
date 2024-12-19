import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    shapeType: 'rectangle',
    shapeColor: 'cyan-400',
    patternType: 'transparent',
    borderType: 'roundedBorder',
    opacity: 100,
    resize: false
}

export const ShapeFeatures = createSlice({
    initialState,
    name: 'ShapeFeatures',
    reducers: {
        setShapeType: (state, action) => {
            state.shapeType = action.payload;            
        },
        setShapeColor: (state, action) => {
            state.shapeColor = action.payload; 
        },
        setPatternType: (state, action) => {
            state.patternType = action.payload
        },
        setBorderType: (state,action) => {
            state.borderType = action.payload;
        },
        setShapeOpacity: (state, action) => {
            state.opacity = action.payload;
        },
        setResize: (state) => {
            state.resize = true;
        }
    }
})

export const { setShapeType, setShapeColor, setPatternType, setBorderType, setShapeOpacity, setResize } = ShapeFeatures.actions;
export default ShapeFeatures.reducer;