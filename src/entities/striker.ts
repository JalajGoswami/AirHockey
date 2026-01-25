import type { Constructor, Entity } from "../core/entity"
import type { Screen } from "../core/screen"
import { Position } from "../systems/movement"

export class Striker implements Entity {
    private components: Record<string, object> = {}

    draw(screen: Screen): void {
        const position = this.getComponent(Position)
        if (!position) return

        const size = 20
        screen.drawRect(position.x - size / 2, position.y - size / 2, 20, 20, '#D02752')
    }

    addComponent(component: object): Striker {
        this.components[component.constructor.name] = component
        return this
    }

    getComponent<T extends Constructor>(component_type: T): InstanceType<T> | null {
        const component = this.components[component_type.name] as InstanceType<T> | undefined
        return component || null
    }
}
