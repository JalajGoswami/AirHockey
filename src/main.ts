import { Game } from "./core/entity"
import { Screen } from "./core/screen"
import { DebugOverlay, OverlayComponent, OverlaySystem } from "./debug_overlay"
import { Puck } from "./entities/puck"
import { Striker } from "./entities/striker"
import { Movement, MovementControlsSystem, MovementSystem, Position, PositionConstraints, Size } from "./systems/movement"

const canvas = document.getElementById('canvas') as HTMLCanvasElement
if (!canvas) throw Error('no canvas found for drawing')

const screen = new Screen(canvas)

const game = new Game(screen)

// game.setTargetFPS(30)

// all entitites
game.addEntity(new DebugOverlay().addComponent(new OverlayComponent()))
game.addEntity(
    new Striker()
        .addComponent(new Position(50, 100))
        .addComponent(new Size(24))
        .addComponent(new Movement())
)
game.addEntity(
    new Puck()
        .addComponent(new Position(50, 60))
        .addComponent(new Size(20))
)

// all systems & constraints
game.addSystem(new OverlaySystem())
game.addSystem(new MovementControlsSystem(screen))
game.addSystem(new MovementSystem())
game.addSystem(new PositionConstraints())

game.runLoop()
