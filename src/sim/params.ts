export interface SimulationParams {
  count: number
  maxSpeed: number
  maxForce: number
  perception: number
  separation: number
  alignment: number
  cohesion: number
  mouseForce: number
  mouseRadius: number
}

export const DEFAULT_PARAMS: SimulationParams = {
  count: 800,
  maxSpeed: 6,
  maxForce: 4,
  perception: 2.5,
  separation: 1.4,
  alignment: 0.8,
  cohesion: 0.6,
  mouseForce: 0.8,
  mouseRadius: 6,
}

export const PALETTES: string[][] = [
  ['#7fe3e8', '#8fd8ff', '#b7a6ff', '#ffd27a', '#ff9de2'],
  ['#ff6b6b', '#ffd93d', '#6bffb8', '#6bc5ff', '#ff9de2'],
  ['#e8e8e8', '#9be7ff', '#a8ffd0', '#ffd9a0', '#c0b8ff'],
]
