import * as THREE from 'three'

/**
 * Перетворює позицію курсора на точку у 3D-просторі
 * (перетин променя камери з площиною z=0).
 */
export class PointerController {
  target: THREE.Vector3 | null = null
  private raycaster = new THREE.Raycaster()
  private plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  private ndc = new THREE.Vector2()

  constructor(dom: HTMLElement, private camera: THREE.Camera) {
    dom.addEventListener('pointermove', (e) => this.onMove(e, dom))
    dom.addEventListener('pointerleave', () => {
      this.target = null
    })
  }

  private onMove(e: PointerEvent, dom: HTMLElement): void {
    const rect = dom.getBoundingClientRect()
    this.ndc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    )
    this.raycaster.setFromCamera(this.ndc, this.camera)
    const point = new THREE.Vector3()
    this.target = this.raycaster.ray.intersectPlane(this.plane, point) ? point.clone() : null
  }
}
