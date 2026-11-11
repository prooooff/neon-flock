import * as THREE from 'three'
import { Boid } from './boid'
import type { SimulationParams } from './params'

/** Керує набором агентів: створення, перефарбування, оновлення. */
export class Flock {
  boids: Boid[] = []

  rebuild(count: number, palette: string[]): void {
    this.boids = []
    const spread = 18
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
      )
      const velocity = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      )
        .normalize()
        .multiplyScalar(2 + Math.random() * 5)
      const color = new THREE.Color(palette[i % palette.length])
      this.boids.push(new Boid(position, velocity, color))
    }
  }

  recolor(palette: string[]): void {
    this.boids.forEach((boid, i) => boid.color.set(palette[i % palette.length]))
  }

  update(dt: number, params: SimulationParams, mouse: THREE.Vector3 | null): void {
    for (const boid of this.boids) {
      boid.update(this.boids, dt, params, mouse)
    }
  }
}
