import { Screen } from "./core/screen"

const canvas = document.getElementById('canvas') as HTMLCanvasElement
if (!canvas) throw Error('no canvas found for drawing')

const screen = new Screen(canvas)

draw(screen.ctx)

screen.onResize = () => draw(screen.ctx)

function draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgb(200 0 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}
