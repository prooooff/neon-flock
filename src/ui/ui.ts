import type { SimulationParams } from '../sim/params'

interface UICallbacks {
  onCount: (count: number) => void
  onPalette: () => void
  onReset: () => void
}

interface SliderDef {
  id: string
  key: keyof SimulationParams
  min: number
  max: number
  step: number
}

const SLIDERS: SliderDef[] = [
  { id: 'count', key: 'count', min: 100, max: 2000, step: 100 },
  { id: 'max-speed', key: 'maxSpeed', min: 1, max: 12, step: 0.1 },
  { id: 'max-force', key: 'maxForce', min: 0.5, max: 10, step: 0.1 },
  { id: 'perception', key: 'perception', min: 1, max: 8, step: 0.1 },
  { id: 'separation', key: 'separation', min: 0, max: 3, step: 0.1 },
  { id: 'alignment', key: 'alignment', min: 0, max: 2, step: 0.05 },
  { id: 'cohesion', key: 'cohesion', min: 0, max: 2, step: 0.05 },
  { id: 'mouse-force', key: 'mouseForce', min: 1, max: 6, step: 0.1 },
  { id: 'mouse-radius', key: 'mouseRadius', min: 1, max: 15, step: 0.5 },
]

/** Прив'язує HTML-слайдери та кнопки до параметрів симуляції. */
export class UIController {
  constructor(private params: SimulationParams, private cb: UICallbacks) {
    for (const slider of SLIDERS) {
      const input = document.getElementById(slider.id) as HTMLInputElement
      input.min = String(slider.min)
      input.max = String(slider.max)
      input.step = String(slider.step)
      input.value = String(this.params[slider.key])
      input.addEventListener('input', () => {
        this.params[slider.key] = Number(input.value)
        if (slider.key === 'count') this.cb.onCount(this.params.count)
      })
    }

    document.getElementById('palette-btn')?.addEventListener('click', () => this.cb.onPalette())
    document.getElementById('reset-btn')?.addEventListener('click', () => this.cb.onReset())
  }

  /** Оновлює положення слайдерів (після скидання параметрів). */
  refresh(): void {
    for (const slider of SLIDERS) {
      const input = document.getElementById(slider.id) as HTMLInputElement
      input.value = String(this.params[slider.key])
    }
  }
}
