const canvas = document.getElementById('canvas') as HTMLCanvasElement
if (!canvas) throw Error('no canvas found for drawing')


const ctx = canvas.getContext("2d")
if (!ctx) throw Error("unable to setup drawing context")

function resize() {
    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight
    if (ctx) draw(ctx)
}

resize()
window.addEventListener('resize', resize)

draw(ctx)

function draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgb(200 0 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}
