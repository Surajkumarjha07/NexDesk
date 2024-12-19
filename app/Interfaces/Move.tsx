import { RefObject } from "react"

type Move = {
    canvasRef: RefObject<HTMLCanvasElement>
    shapes: shape[]
}

export default Move;