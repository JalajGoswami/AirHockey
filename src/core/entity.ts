import { Screen } from "./screen"

export type Constructor = abstract new (...args: any) => any

export abstract class Entity {
    private components: Record<string, object> = {}

    abstract draw(screen: Screen): void

    getComponent<T extends Constructor>(component_type: T): InstanceType<T> | null {
        const component = this.components[component_type.name] as InstanceType<T> | undefined
        return component || null
    }
    addComponent(component: object): this {
        this.components[component.constructor.name] = component
        return this
    }
}

export interface System {
    update(entities: Entity[], dt: number, tick: number, screen: Screen): void
}

export class Game {
    screen: Screen
    private entities: Entity[] = []
    private systems: System[] = []
    private targetFPS = 60
    private targetFrameTime = 1000 / this.targetFPS
    private timeStamp = Date.now()
    private tick = 0

    constructor(screen: Screen) {
        this.screen = screen
    }

    private draw() {
        this.screen.clear()
        for (const entity of this.entities) {
            entity.draw(this.screen)
        }
    }

    private update(dt: number) {
        for (const system of this.systems) {
            system.update(this.entities, dt, this.tick, this.screen)
        }
    }

    runLoop() {
        this.tick = (this.tick + 1) % 1000
        const dt = Date.now() - this.timeStamp
        if (dt <= this.targetFrameTime / 2) {
            // just for saving compute
            requestAnimationFrame(this.runLoop.bind(this))
            return
        }

        this.timeStamp = Date.now()
        this.update(dt / 1000)
        this.draw()

        requestAnimationFrame(this.runLoop.bind(this))
    }


    addEntity(entity: Entity) {
        this.entities.push(entity)
    }

    addSystem(system: System) {
        this.systems.push(system)
    }

    /**
     * Does not ensure desired fps, only for debug purpose only
     */
    setTargetFPS(fps: 30 | 60 | 75 | 90) {
        this.targetFPS = fps
        this.targetFrameTime = 1000 / fps
    }
}

