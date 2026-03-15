import type { Entity, System } from "../core/entity"
import type { Screen } from "../core/screen"

export class Position {
    x = 0
    y = 0
    constructor(x: number, y: number) { this.x = x; this.y = y }
}

export class Movement {
    dx = 0
    dy = 0
}

// assumed: all objects are disck in shape
export class Size {
    size = 0
    constructor(size: number) { this.size = size }
}

export class PositionConstraints implements System {
    update(entities: Entity[], _: number, __: number, screen: Screen): void {
        for (const entity of entities) {
            const position = entity.getComponent(Position)
            if (!position) continue
            const size = entity.getComponent(Size)?.size || 0
            window.dispatchEvent(new CustomEvent("debug_message", { detail: [position.x, position.y] }))

            position.x = Math.max(size / 2, position.x)
            position.x = Math.min(screen.width - size / 2, position.x)
            position.y = Math.max(size / 2, position.y)
            position.y = Math.min(screen.height - size / 2, position.y)
        }
    }
}

export class MovementSystem implements System {
    update(entities: Entity[], dt: number, _: number, __: Screen): void {
        for (const entity of entities) {
            const position = entity.getComponent(Position)
            const movement = entity.getComponent(Movement)
            if (!position || !movement) continue

            position.x += movement.dx * dt
            position.y += movement.dy * dt
        }
    }
}

export class MovementControlsSystem implements System {
    private screen: Screen
    private keyboard_input = {
        up: false,
        down: false,
        left: false,
        right: false
    }
    private mouseX = 0
    private mouseY = 0
    private mouseInside = false

    constructor(screen: Screen) {
        this.screen = screen
        screen.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e, screen.ppu))
        screen.canvas.addEventListener("mouseenter", (e) => {
            this.mouseInside = true
            this.onMouseMove(e, screen.ppu)
        })
        screen.canvas.addEventListener("mouseleave", () => (this.mouseInside = false))

        window.addEventListener("keydown", (e) => this.onKeyChange(e, true))
        window.addEventListener("keyup", (e) => this.onKeyChange(e, false))
    }

    update(entities: Entity[], dt: number, _: number, __: Screen): void {
        for (const entity of entities) {
            const position = entity.getComponent(Position)
            const movement = entity.getComponent(Movement)
            if (!position || !movement) continue

            let dx = 0, dy = 0
            // let { dx, dy } = movement
            const ACC_MOUSE = 30_000
            const ACC_KEYBOARD = 20_000
            const STOP_RADIUS = 2

            if (this.mouseInside) {
                // distance vector
                const rx = this.mouseX - position.x
                const ry = this.mouseY - position.y
                const dist = Math.abs(Math.hypot(rx, ry))
                if (dist > STOP_RADIUS) {
                    dx = ACC_MOUSE * rx * dt / dist
                    dy = ACC_MOUSE * ry * dt / dist
                    if (Math.abs(dx * dt) > (dist - STOP_RADIUS)) {
                        dx = Math.sign(dx) * (dist - STOP_RADIUS) / dt
                    }
                    if (Math.abs(dy * dt) > (dist - STOP_RADIUS)) {
                        dy = Math.sign(dy) * (dist - STOP_RADIUS) / dt
                    }
                } else {
                    position.x = this.mouseX
                    position.y = this.mouseY
                }

            } else {
                // keybaord controls
                if (this.keyboard_input.up) dy -= ACC_KEYBOARD * dt
                if (this.keyboard_input.down) dy += ACC_KEYBOARD * dt
                if (this.keyboard_input.left) dx -= ACC_KEYBOARD * dt
                if (this.keyboard_input.right) dx += ACC_KEYBOARD * dt

                // to avoid faster diagonal movement
                const len = Math.hypot(dx, dy)
                if (len > ACC_KEYBOARD * dt) {
                    const factor = len / (ACC_KEYBOARD * dt)
                    dx /= factor
                    dy /= factor
                }
            }

            movement.dx = dx
            movement.dy = dy
        }
    }

    private onKeyChange(e: KeyboardEvent, isDown: boolean) {
        if (e.code === "KeyW" || e.code === "ArrowUp") this.keyboard_input.up = isDown
        if (e.code === "KeyS" || e.code === "ArrowDown") this.keyboard_input.down = isDown
        if (e.code === "KeyA" || e.code === "ArrowLeft") this.keyboard_input.left = isDown
        if (e.code === "KeyD" || e.code === "ArrowRight") this.keyboard_input.right = isDown
    }

    private onMouseMove(e: MouseEvent, ppu: number) {
        const rect = this.screen.canvas.getBoundingClientRect()
        this.mouseX = (e.clientX - rect.left) / ppu
        this.mouseY = (e.clientY - rect.top) / ppu
    }
}
