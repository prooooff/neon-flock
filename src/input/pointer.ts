import * as THREE from 'three'

/**
 * Відстежує курсор і стан ПКМ:
 *  - затиснута ПКМ → attracting = true (зграя збирається в target),
 *  - відпущена → генерує одноразову точку розльоту.
 */
export class PointerController {
  target: THREE.Vector3 | null = null
  attracting = false

  private scatterPoint: THREE.Vector3 | null = null
  private raycaster = new THREE.Raycaster()
  private plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  private ndc = new THREE.Vector2()

  constructor(private dom: HTMLElement, private camera: THREE.Camera) {
    dom.addEventListener('pointerdown', this.onDown)
    dom.addEventListener('contextmenu', (e) => e.preventDefault())
    window.addEventListener('pointermove', this.onMove)
    window.addEventListener('pointerup', this.onUp)
  }

  /** Повертає точку розльоту один раз після відпускання ПКМ (або null). */
  consumeScatterPoint(): THREE.Vector3 | null {
    const p = this.scatterPoint
    this.scatterPoint = null
    return p
  }

  private onDown = (e: PointerEvent): void => {
    if (e.button === 2) this.attracting = true
  }

  private onUp = (e: PointerEvent): void => {
    if (e.button !== 2) return
    this.attracting = false
    if (this.target) this.scatterPoint = this.target.clone()
  }

  private onMove = (e: PointerEvent): void => {
    const rect = this.dom.getBoundingClientRect()
    this.ndc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    )
    this.raycaster.setFromCamera(this.ndc, this.camera)
    const point = new THREE.Vector3()
    this.target = this.raycaster.ray.intersectPlane(this.plane, point) ? point.clone() : null
  }
}
