import * as THREE from 'three'
import { Boid, type Attractor } from './boid'
import type { SimulationParams } from './params'

/** Керує набором агентів: створення, перефарбування, оновлення, розліт. */
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

  update(dt: number, params: SimulationParams, attractor: Attractor | null): void {
    for (const boid of this.boids) {
      boid.update(this.boids, dt, params, attractor)
    }
  }

  /** Імпульс розльоту від точки (після відпускання ПКМ). */
  scatter(from: THREE.Vector3, strength: number): void {
    for (const boid of this.boids) {
      const dir = boid.position.clone().sub(from)
      if (dir.lengthSq() < 1e-4) {
        dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      }
      dir.normalize()

      // випадкова складова, щоб розліт виглядав живо, а не ідеальною сферою
      dir.x += (Math.random() - 0.5) * 0.7
      dir.y += (Math.random() - 0.5) * 0.7
      dir.z += (Math.random() - 0.5) * 0.7
      dir.normalize()

      boid.velocity.addScaledVector(dir, strength * (0.7 + Math.random() * 0.6))
    }
  }
}
