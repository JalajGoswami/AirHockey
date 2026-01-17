export const ASPECT_RATIO = 7 / 4

export class Screen {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    width: number = 100
    height: number = 100 * ASPECT_RATIO
    onResize?: () => void

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        const ctx = canvas.getContext("2d")
        if (!ctx) throw Error("unable to setup drawing context")
        this.ctx = ctx

        this.scaleToFit()
        window.addEventListener("resize", this.scaleToFit.bind(this))
    }

    private scaleToFit() {
        const width = document.body.clientWidth
        const height = document.body.clientHeight

        const scale = Math.min(width, height / ASPECT_RATIO)
        this.width = scale
        this.height = scale * ASPECT_RATIO
        this.canvas.width = this.width
        this.canvas.height = this.height
        if (this.onResize) this.onResize()
    }
}
