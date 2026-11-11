import * as THREE from 'three'
import type { SimulationParams } from './params'

/**
 * Окремий агент зграї. Містить лише логіку поведінки (boids-правила)
 * і нічого не знає про рендер — це чистий розрахунок.
 */
export class Boid {
  readonly position = new THREE.Vector3()
  readonly velocity = new THREE.Vector3()
  readonly color = new THREE.Color()

  constructor(position: THREE.Vector3, velocity: THREE.Vector3, color: THREE.Color) {
    this.position.copy(position)
    this.velocity.copy(velocity)
    this.color.copy(color)
  }

  update(
    others: readonly Boid[],
    dt: number,
    params: SimulationParams,
    mouse: THREE.Vector3 | null,
  ): void {
    const perceptionSq = params.perception * params.perception
    const separationSq = params.separation * params.separation

    const separation = new THREE.Vector3()
    const alignment = new THREE.Vector3()
    const cohesion = new THREE.Vector3()
    let groupCount = 0
    let sepCount = 0

    for (const other of others) {
      if (other === this) continue
      const dx = other.position.x - this.position.x
      const dy = other.position.y - this.position.y
      const dz = other.position.z - this.position.z
      const dSq = dx * dx + dy * dy + dz * dz
      if (dSq > perceptionSq || dSq < 1e-6) continue

      alignment.add(other.velocity)
      cohesion.add(other.position)
      groupCount++

      if (dSq < separationSq) {
        // чим ближче сусід — тим сильніше відштовхування
        separation.x += -dx / dSq
        separation.y += -dy / dSq
        separation.z += -dz / dSq
        sepCount++
      }
    }

    const steer = new THREE.Vector3()

    if (groupCount > 0) {
      cohesion
        .divideScalar(groupCount)
        .sub(this.position)
        .normalize()
        .multiplyScalar(params.cohesion)
      alignment.divideScalar(groupCount).normalize().multiplyScalar(params.alignment)
      steer.add(cohesion).add(alignment)
    }
    if (sepCount > 0) {
      separation.divideScalar(sepCount).normalize().multiplyScalar(params.separation)
      steer.add(separation)
    }

    // м'яка межа: повертаємо агента до центру сцени
    const bound = 28
    const r = this.position.length()
    if (r > bound) {
      steer.addScaledVector(this.position, (-(r - bound) * 0.4) / r)
    }

    // взаємодія з курсором (притягування або відштовхування)
    if (mouse && params.mouseForce !== 0) {
      const dx = mouse.x - this.position.x
      const dy = mouse.y - this.position.y
      const dz = mouse.z - this.position.z
      const dSq = dx * dx + dy * dy + dz * dz
      const radiusSq = params.mouseRadius * params.mouseRadius
      if (dSq < radiusSq && dSq > 1e-6) {
        const inv = 1 / Math.sqrt(dSq)
        steer.x += dx * inv * params.mouseForce
        steer.y += dy * inv * params.mouseForce
        steer.z += dz * inv * params.mouseForce
      }
    }

    steer.clampLength(0, params.maxForce)
    this.velocity.addScaledVector(steer, dt)
    this.velocity.clampLength(params.maxSpeed * 0.3, params.maxSpeed)
    this.position.addScaledVector(this.velocity, dt)
  }
}
