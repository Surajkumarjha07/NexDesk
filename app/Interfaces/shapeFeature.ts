import { RefObject } from "react";

type shapeFeature = {
    canvasRef: RefObject<HTMLCanvasElement>,
    shapeType: string,
    shapeColor: string,
    patternType: string,
    borderType: string,
    opacity: number
}

export default shapeFeature;