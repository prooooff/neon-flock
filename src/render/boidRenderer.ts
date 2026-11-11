import * as THREE from 'three'
import type { Flock } from '../sim/flock'

/**
 * Рендерить зграю через InstancedMesh (один draw call).
 * Синхронізує позиції/орієнтації/кольори зі стану симуляції.
 */
export class BoidRenderer {
  private mesh: THREE.InstancedMesh
  private dummy = new THREE.Object3D()
  private direction = new THREE.Vector3()
  private readonly up = new THREE.Vector3(0, 1, 0)

  constructor(scene: THREE.Scene, maxCount: number) {
    const geometry = new THREE.ConeGeometry(0.12, 0.4, 4)
    const material = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.15 })
    this.mesh = new THREE.InstancedMesh(geometry, material, maxCount)
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    scene.add(this.mesh)
  }

  sync(flock: Flock): void {
    const n = flock.boids.length
    this.mesh.count = n

    for (let i = 0; i < n; i++) {
      const boid = flock.boids[i]
      this.dummy.position.copy(boid.position)
      this.direction.copy(boid.velocity)
      if (this.direction.lengthSq() > 1e-6) this.direction.normalize()
      this.dummy.quaternion.setFromUnitVectors(this.up, this.direction)
      this.dummy.updateMatrix()

      this.mesh.setMatrixAt(i, this.dummy.matrix)
      this.mesh.setColorAt(i, boid.color)
    }

    this.mesh.instanceMatrix.needsUpdate = true
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true
  }
}
