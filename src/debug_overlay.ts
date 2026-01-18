import type { Constructor, Entity, System } from "./core/entity";
import type { Screen } from "./core/screen";

export class OverlayComponent {
    frameTime: number = 16
    fps: number = 60
}

export class DebugOverlay implements Entity {
    private component: OverlayComponent | null = null

    draw(screen: Screen): void {
        if (!this.component) return
        screen.drawRect(0, 0, 40, 20, "#ddddeeaa")
        const fps = this.component.fps.toFixed(2) + "fps"
        screen.drawText(fps, 5, 5, "#ee1100", 8)
    }

    addComponent(component: OverlayComponent): DebugOverlay {
        this.component = component
        return this
    }

    hasComponent(component_type: Constructor): boolean {
        return component_type.name === OverlayComponent.name && Boolean(this.component)
    }

    getComponent<T extends Constructor>(component_type: T): InstanceType<T> | null {
        if (component_type.name === OverlayComponent.name && this.component)
            return this.component as InstanceType<T>
        return null
    }
}

export class OverlaySystem implements System {
    update(entities: Entity[], dt: number, tick: number): void {
        for (const entity of entities) {
            const overlayData = entity.getComponent(OverlayComponent)
            if (!overlayData) continue
            if (tick % 9 !== 0) continue

            overlayData.fps = 1000 / dt
            overlayData.frameTime = dt
        }
    }
}
