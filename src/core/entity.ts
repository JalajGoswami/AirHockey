import { Screen } from "./screen"

export type Constructor = abstract new (...args: any) => any

export interface Entity extends InstanceType<Constructor> {
    draw(screen: Screen): void
    getComponent<T extends Constructor>(component_type: T): InstanceType<T> | null
    hasComponent(component_type: Constructor): boolean
    addComponent(component: object): Entity
}

export interface System {
    update(entities: Entity[], dt: number, tick: number): void
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
            system.update(this.entities, dt, this.tick)
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
        this.update(dt)
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

