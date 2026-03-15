import { COLORS } from "../core/constants"
import { Entity } from "../core/entity"
import type { Screen } from "../core/screen"
import { Position, Size } from "../systems/movement"

export class Striker extends Entity {
    draw(screen: Screen): void {
        const pos = this.getComponent(Position)
        const size = this.getComponent(Size)
        if (!pos || !size) return
        const rad = size.size / 2

        screen.drawDisc(pos.x, pos.y, rad, COLORS.RED)
    }
}
