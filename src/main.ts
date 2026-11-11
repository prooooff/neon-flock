import { Engine } from './core/engine'
import { Flock } from './sim/flock'
import { DEFAULT_PARAMS, PALETTES, type SimulationParams } from './sim/params'
import { BoidRenderer } from './render/boidRenderer'
import { PointerController } from './input/pointer'
import { UIController } from './ui/ui'
import './style.css'

// Композиційний корінь: збираємо всі модулі разом.
const container = document.getElementById('app')!
const params: SimulationParams = { ...DEFAULT_PARAMS }
let paletteIndex = 0

const engine = new Engine(container)
const flock = new Flock()
flock.rebuild(params.count, PALETTES[paletteIndex])

const renderer = new BoidRenderer(engine.scene, 2000)
const pointer = new PointerController(engine.renderer.domElement, engine.camera)

const ui = new UIController(params, {
  onCount: (count) => flock.rebuild(count, PALETTES[paletteIndex]),
  onPalette: () => {
    paletteIndex = (paletteIndex + 1) % PALETTES.length
    flock.recolor(PALETTES[paletteIndex])
  },
  onReset: () => {
    Object.assign(params, DEFAULT_PARAMS)
    paletteIndex = 0
    ui.refresh()
    flock.rebuild(params.count, PALETTES[paletteIndex])
  },
})

engine.start((dt, time) => {
  // легке "дихання" камери для динаміки
  engine.camera.position.x = Math.sin(time * 0.18) * 5
  engine.camera.position.y = 4 + Math.sin(time * 0.22) * 1.6
  engine.camera.lookAt(0, 0, 0)

  flock.update(dt, params, pointer.target)
  renderer.sync(flock)
})
