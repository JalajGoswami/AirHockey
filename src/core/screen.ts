export const ASPECT_RATIO = 7 / 4

export class Screen {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    width = 200
    height = 200 * ASPECT_RATIO
    ppu = 1
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

        const scale = Math.min(width / this.width, height / this.height)
        this.canvas.width = scale * this.width
        this.canvas.height = scale * this.height
        this.ppu = scale
        if (this.onResize) this.onResize()
    }

    drawText(text: string, x: number, y: number, color: string, fontSize: number, maxWidth?: number) {
        x *= this.ppu
        y *= this.ppu
        fontSize *= this.ppu
        if (maxWidth) maxWidth *= this.ppu
        this.ctx.fillStyle = color
        this.ctx.font = `${fontSize}px serif`
        this.ctx.textBaseline = "top"
        this.ctx.fillText(text, x, y, maxWidth)
    }

    drawRect(x: number, y: number, w: number, h: number, color: string) {
        x *= this.ppu
        y *= this.ppu
        w *= this.ppu
        h *= this.ppu
        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, w, h)
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width * this.ppu, this.height * this.ppu)
        this.drawRect(0, 0, this.width * this.ppu, this.height * this.ppu, '#30364F')
    }
}
