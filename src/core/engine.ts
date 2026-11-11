import * as THREE from 'three'

/**
 * Мінімальний "движок": рендерер, сцена, камера, освітлення та цикл.
 * Нічого не знає про конкретний контент сцени — лише інфраструктура.
 */
export class Engine {
  readonly scene = new THREE.Scene()
  readonly camera: THREE.PerspectiveCamera
  readonly renderer: THREE.WebGLRenderer
  private clock = new THREE.Clock()

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200,
    )
    this.camera.position.set(0, 4, 26)
    this.camera.lookAt(0, 0, 0)

    this.scene.background = new THREE.Color('#06080f')
    this.scene.fog = new THREE.FogExp2('#06080f', 0.012)

    this.scene.add(new THREE.AmbientLight('#20304f', 1.5))

    const key = new THREE.DirectionalLight('#ffffff', 2.2)
    key.position.set(10, 20, 10)
    this.scene.add(key)

    const rim = new THREE.PointLight('#7fd8ff', 30, 120)
    rim.position.set(0, -6, 12)
    this.scene.add(rim)

    window.addEventListener('resize', () => this.resize())
  }

  resize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  start(onFrame: (dt: number, time: number) => void): void {
    this.renderer.setAnimationLoop(() => {
      const dt = Math.min(this.clock.getDelta(), 0.05)
      onFrame(dt, this.clock.elapsedTime)
      this.renderer.render(this.scene, this.camera)
    })
  }
}
