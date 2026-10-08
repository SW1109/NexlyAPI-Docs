export type Particle = {
  kind: 'stream' | 'halo' | 'ambient'
  x: number; y: number; vx: number; vy: number
  progress: number; band: number; radius: number; angle: number
  speed: number; offset: number; size: number; alpha: number
  color: string; glow: boolean; twinklePhase: number; twinkleFreq: number
}

export type ParticleScene = ReturnType<typeof createParticleScene>
const colors = ['88, 215, 195', '45, 165, 232', '130, 118, 247', '190, 241, 235']
export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

// 暂保留原密度边界；质量参数集中管理，避免未经浏览器测量就削减视觉细节。
export const particleQuality = (compact: boolean) => compact
  ? { density: 420, min: 520, max: 920, dpr: 1.35 }
  : { density: 175, min: 1200, max: 2400, dpr: 1.8 }

const createRandom = (seed: number) => {
  let state = seed >>> 0
  return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296 }
}

const resolveTarget = (particle: Particle, width: number, height: number, elapsed: number) => {
  const centerX = width * .5
  const centerY = height * .5
  if (particle.kind === 'stream') {
    const progress = ((particle.progress + elapsed * particle.speed + 1) % 2) - 1
    const lane = particle.offset * Math.min(width, height)
    if (particle.band % 3 === 0) return {
      x: centerX + progress * width * .49,
      y: centerY + Math.sin(progress * 3.35 + particle.band * .29) * height * .17 + lane
    }
    if (particle.band % 3 === 1) return {
      x: centerX + progress * width * .46,
      y: centerY - Math.sin(progress * 3.05 - particle.band * .22) * height * .23 + lane
    }
    return {
      x: centerX + Math.sin(progress * 2.7 + particle.band * .18) * width * .2 + lane,
      y: centerY + progress * height * .46
    }
  }
  if (particle.kind === 'halo') {
    const angle = particle.angle + elapsed * particle.speed
    const pulse = 1 + Math.sin(elapsed * .55 + particle.offset * 18) * .06
    return {
      x: centerX + Math.cos(angle) * particle.radius * width * pulse,
      y: centerY + Math.sin(angle) * particle.radius * height * .7 * pulse
    }
  }
  return {
    x: particle.progress * width + Math.sin(elapsed * particle.speed + particle.angle) * 7,
    y: particle.radius * height + Math.cos(elapsed * particle.speed * .72 + particle.angle) * 5
  }
}

export const createParticleScene = (width: number, height: number, compact: boolean) => {
  const quality = particleQuality(compact)
  const count = clamp(Math.round(width * height / quality.density), quality.min, quality.max)
  const random = createRandom(31092026)
  const particles = Array.from({ length: count }, (_, index): Particle => {
    const kind = index < count * .7 ? 'stream' : index < count * .9 ? 'halo' : 'ambient'
    const particle: Particle = {
      kind, x: 0, y: 0, vx: 0, vy: 0,
      progress: random() * 2 - 1,
      band: Math.floor(random() * 9),
      radius: kind === 'halo' ? .13 + random() * .31 : random(),
      angle: random() * Math.PI * 2,
      speed: kind === 'stream' ? .065 + random() * .09 : .04 + random() * .085,
      offset: (random() - .5) * (kind === 'stream' ? .055 : 1),
      size: .42 + random() * (random() > .88 ? 1.85 : .95),
      alpha: .18 + random() * .68,
      color: colors[Math.floor(random() * colors.length)]!,
      glow: index % 17 === 0,
      twinklePhase: random() * Math.PI * 2,
      twinkleFreq: 1.4 + random() * 2.4
    }
    Object.assign(particle, resolveTarget(particle, width, height, 0))
    return particle
  })
  return {
    width, height, compact, particles, elapsed: 0, pendingTime: 0,
    pointer: { x: 0, y: 0, proximity: 0 },
    blackHole: { x: 0, y: 0, progress: 0, spinAngle: 0, initialized: false }
  }
}

export const setParticlePointer = (scene: ParticleScene, point: { x: number; y: number; active: boolean }) => {
  const { width, height, pointer, blackHole } = scene
  pointer.x = point.x
  pointer.y = point.y
  const marginX = Math.max(width * .45, 320)
  const marginY = Math.max(height * .35, 200)
  const factorX = clamp(1 - Math.max(-point.x, point.x - width, 0) / marginX, 0, 1)
  const factorY = clamp(1 - Math.max(-point.y, point.y - height, 0) / marginY, 0, 1)
  const proximity = point.active ? factorX * factorY : 0
  pointer.proximity = proximity * proximity * (3 - 2 * proximity)
  if (pointer.proximity > 0 && !blackHole.initialized) {
    blackHole.x = point.x
    blackHole.y = point.y
    blackHole.initialized = true
  }
}

export const horizonRadius = (scene: ParticleScene) => (scene.compact ? 25 : 38)
  * (.35 + .65 * scene.blackHole.progress) * (1 + Math.sin(scene.elapsed * 2.2) * .012)

const stepParticleScene = (scene: ParticleScene) => {
  const { width, height, blackHole, pointer } = scene
  scene.elapsed += 1 / 60
  blackHole.progress += (pointer.proximity - blackHole.progress) * .08
  if (blackHole.progress < .0006) blackHole.progress = 0
  if (blackHole.progress > 0) {
    blackHole.x += (pointer.x - blackHole.x) * .15
    blackHole.y += (pointer.y - blackHole.y) * .15
    blackHole.spinAngle += .012
  }
  const horizon = horizonRadius(scene)
  const influenceRadius = Math.min(width, height) * (scene.compact ? .42 : .52)
  const damping = blackHole.progress > .05 ? .938 : .915
  for (const particle of scene.particles) {
    const target = resolveTarget(particle, width, height, scene.elapsed)
    const deltaX = target.x - particle.x
    const deltaY = target.y - particle.y
    const dx = particle.x - blackHole.x
    const dy = particle.y - blackHole.y
    const distance = Math.hypot(dx, dy)
    if (blackHole.progress > .001 && distance > 0 && distance < influenceRadius) {
      const norm = distance / influenceRadius
      const influence = (1 - norm) ** 1.15 * blackHole.progress
      const nx = dx / distance
      const ny = dy / distance
      const tx = -ny
      const ty = nx
      const returnWeight = (1 - influence * .72) * .012
      particle.vx += deltaX * returnWeight
      particle.vy += deltaY * returnWeight
      const orbit = horizon * 1.35
      const barrier = horizon * 1.12
      if (distance > orbit) {
        const pull = Math.min((distance - orbit) / Math.max(influenceRadius - orbit, 1), 1) * 2.3 * influence
        const spin = (1.5 + (1 - norm) * 2.2) * influence
        particle.vx += -nx * pull + tx * spin
        particle.vy += -ny * pull + ty * spin
      } else if (distance >= barrier) {
        const spin = 3.6 * blackHole.progress
        const drift = (distance - orbit) * .08
        particle.vx += tx * spin - nx * drift
        particle.vy += ty * spin - ny * drift
      } else {
        const push = (1 - distance / barrier) * 4.2 * blackHole.progress
        particle.vx += nx * push + tx * 3.2 * blackHole.progress
        particle.vy += ny * push + ty * 3.2 * blackHole.progress
        if (distance < horizon * 1.05) {
          particle.x = blackHole.x + nx * horizon * 1.06
          particle.y = blackHole.y + ny * horizon * 1.06
        }
      }
      const speed = Math.hypot(particle.vx, particle.vy)
      if (speed > 4.8) {
        particle.vx = particle.vx / speed * 4.8
        particle.vy = particle.vy / speed * 4.8
      }
    } else if (blackHole.progress <= .001 && particle.kind === 'stream' && Math.abs(deltaX) > width * .72) {
      // 流线循环时直接换位，避免跨越画面的长直线。
      particle.x = target.x
      particle.y = target.y
      particle.vx = 0
      particle.vy = 0
    } else {
      particle.vx += deltaX * .012
      particle.vy += deltaY * .012
    }
    particle.vx *= damping
    particle.vy *= damping
    particle.x += particle.vx
    particle.y += particle.vy
  }
}

// 固定 60Hz 物理步长，60/120/144Hz 屏幕使用同一阻尼；暂停期间不累计墙上时间。
export const advanceParticleScene = (scene: ParticleScene, deltaSeconds: number) => {
  scene.pendingTime += clamp(deltaSeconds, 0, .1)
  const step = 1 / 60
  let steps = 0
  while (scene.pendingTime + 1e-10 >= step) {
    stepParticleScene(scene)
    scene.pendingTime = Math.max(0, scene.pendingTime - step)
    steps++
  }
  return steps
}