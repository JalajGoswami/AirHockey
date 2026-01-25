import { Game } from "./core/entity"
import { Screen } from "./core/screen"
import { DebugOverlay, OverlayComponent, OverlaySystem } from "./debug_overlay"
import { Striker } from "./entities/striker"
import { Movement, MovementControlsSystem, MovementSystem, Position } from "./systems/movement"

const canvas = document.getElementById('canvas') as HTMLCanvasElement
if (!canvas) throw Error('no canvas found for drawing')

const screen = new Screen(canvas)

const game = new Game(screen)

// game.setTargetFPS(30)

game.addEntity(new DebugOverlay().addComponent(new OverlayComponent()))
game.addSystem(new OverlaySystem())

game.addEntity(new Striker().addComponent(new Position(50, 100)).addComponent(new Movement()))
game.addSystem(new MovementControlsSystem(screen))
game.addSystem(new MovementSystem())

game.runLoop()
