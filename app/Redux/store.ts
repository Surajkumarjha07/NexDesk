import { configureStore } from '@reduxjs/toolkit';
import FunctionalityReducer from './slices/functionality'
import TextFeaturesReducer from './slices/textFeatures';
import NoteFeaturesReducer from './slices/noteFeatures';
import ShapeFeaturesReducer from './slices/shapes';
import ImageFeaturesReducer from './slices/images';
import PencilFeaturesReducer from './slices/pencil';
import EraserReducer from './slices/Eraser';
import MeetingCodeReducer from './slices/meetingCode';
import SelectedItemReducer from "./slices/selectedItem";
import ToggleMessageReducer from "./slices/ToggleMessage";
import UserCredentialReducer from "./slices/user";

export const store = configureStore({
    reducer: {
        Functionality: FunctionalityReducer,
        TextFeatures: TextFeaturesReducer,
        NoteFeatures: NoteFeaturesReducer,
        ShapeFeatures: ShapeFeaturesReducer,
        ImageFeatures: ImageFeaturesReducer,
        PencilFeatures: PencilFeaturesReducer,
        Eraser: EraserReducer,
        MeetingCode: MeetingCodeReducer,
        SelectedItem: SelectedItemReducer,
        ToggleMessage: ToggleMessageReducer,
        UserCredential: UserCredentialReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
