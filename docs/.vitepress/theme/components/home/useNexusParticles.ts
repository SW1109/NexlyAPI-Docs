import { onBeforeUnmount, onMounted, type ShallowRef } from 'vue'

type ParticleKind = 'stream' | 'halo' | 'ambient'

type Particle = {
  kind: ParticleKind
  x: number
  y: number
  vx: number
  vy: number
  progress: number
  band: number
  radius: number
  angle: number
  speed: number
  offset: number
  size: number
  alpha: number
  color: string
  glow: boolean
  trail: boolean
}

const COLORS = ['88, 215, 195', '45, 165, 232', '130, 118, 247', '190, 241, 235']

const createRandom = (seed: number) => {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export function useNexusParticles(canvas: Readonly<ShallowRef<HTMLCanvasElement | null>>) {
  let cleanup: (() => void) | undefined

  onMounted(() => {
    const element = canvas.value
    const context = element?.getContext('2d', { alpha: true })
    if (!element || !context) return

    const random = createRandom(31092026)
    const pointer = { x: 0, y: 0, active: false }
    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)')
    const compactQuery = matchMedia('(max-width: 760px), (pointer: coarse)')
    const interactionTarget = element.closest<HTMLElement>('.portal-scene') ?? element
    let particles: Particle[] = []
    let width = 0
    let height = 0
    let frameId = 0
    let visible = true
    let lastTime = 0

    const resolveTarget = (particle: Particle, elapsed: number) => {
      const centerX = width * 0.5
      const centerY = height * 0.5

      if (particle.kind === 'stream') {
        const progress = ((particle.progress + elapsed * particle.speed + 1) % 2) - 1
        const lane = particle.offset * Math.min(width, height)

        if (particle.band % 3 === 0) {
          return {
            x: centerX + progress * width * 0.49,
            y: centerY + Math.sin(progress * 3.35 + particle.band * 0.29) * height * 0.17 + lane
          }
        }
        if (particle.band % 3 === 1) {
          return {
            x: centerX + progress * width * 0.46,
            y: centerY - Math.sin(progress * 3.05 - particle.band * 0.22) * height * 0.23 + lane
          }
        }
        return {
          x: centerX + Math.sin(progress * 2.7 + particle.band * 0.18) * width * 0.2 + lane,
          y: centerY + progress * height * 0.46
        }
      }

      if (particle.kind === 'halo') {
        const angle = particle.angle + elapsed * particle.speed
        const pulse = 1 + Math.sin(elapsed * 0.55 + particle.offset * 18) * 0.06
        return {
          x: centerX + Math.cos(angle) * particle.radius * width * pulse,
          y: centerY + Math.sin(angle) * particle.radius * height * 0.7 * pulse
        }
      }

      return {
        x: particle.progress * width + Math.sin(elapsed * particle.speed + particle.angle) * 7,
        y: particle.radius * height + Math.cos(elapsed * particle.speed * 0.72 + particle.angle) * 5
      }
    }

    const createParticle = (index: number, count: number, elapsed: number): Particle => {
      const streamEnd = count * 0.7
      const haloEnd = count * 0.9
      const kind: ParticleKind = index < streamEnd ? 'stream' : index < haloEnd ? 'halo' : 'ambient'
      const particle: Particle = {
        kind,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        progress: random() * 2 - 1,
        band: Math.floor(random() * 9),
        radius: kind === 'halo' ? 0.13 + random() * 0.31 : random(),
        angle: random() * Math.PI * 2,
        speed: kind === 'stream' ? 0.065 + random() * 0.09 : 0.04 + random() * 0.085,
        offset: (random() - 0.5) * (kind === 'stream' ? 0.055 : 1),
        size: 0.45 + random() * (random() > 0.88 ? 2.15 : 1.15),
        alpha: 0.18 + random() * 0.68,
        color: COLORS[Math.floor(random() * COLORS.length)]!,
        glow: index % 19 === 0,
        trail: index % 7 === 0
      }
      const target = resolveTarget(particle, elapsed)
      particle.x = target.x + (random() - 0.5) * 10
      particle.y = target.y + (random() - 0.5) * 10
      return particle
    }

    const populate = (elapsed = 0) => {
      const compact = compactQuery.matches
      const density = compact ? 720 : 330
      const count = clamp(Math.round((width * height) / density), compact ? 380 : 760, compact ? 720 : 1600)
      particles = Array.from({ length: count }, (_, index) => createParticle(index, count, elapsed))
    }

    const resize = () => {
      const rect = element.getBoundingClientRect()
      width = Math.max(rect.width, 1)
      height = Math.max(rect.height, 1)
      const dpr = Math.min(devicePixelRatio || 1, compactQuery.matches ? 1.35 : 1.8)
      element.width = Math.round(width * dpr)
      element.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      populate(performance.now() / 1000)
      render(performance.now(), true)
    }

    const render = (now: number, staticFrame = false) => {
      const elapsed = now / 1000
      const timeScale = staticFrame ? 0 : Math.min(Math.max((now - lastTime) / 16.67, 0.3), 2)
      lastTime = now
      context.clearRect(0, 0, width, height)
      context.globalCompositeOperation = 'lighter'

      for (const particle of particles) {
        const target = resolveTarget(particle, elapsed)
        const targetX = target.x
        const targetY = target.y

        if (staticFrame) {
          particle.x = targetX
          particle.y = targetY
        } else {
          const deltaX = targetX - particle.x
          const deltaY = targetY - particle.y
          // 流线首尾循环时直接换位，避免粒子跨越整个画面形成突兀直线。
          if (particle.kind === 'stream' && Math.abs(deltaX) > width * 0.72) {
            particle.x = targetX
            particle.y = targetY
            particle.vx = 0
            particle.vy = 0
          } else {
            particle.vx += deltaX * 0.012 * timeScale
            particle.vy += deltaY * 0.012 * timeScale
          }

          if (pointer.active) {
            const pointerX = particle.x - pointer.x
            const pointerY = particle.y - pointer.y
            const distance = Math.hypot(pointerX, pointerY)
            const radius = Math.min(width, height) * 0.38
            if (distance > 0 && distance < radius) {
              const strength = (1 - distance / radius) ** 1.45
              const radialX = pointerX / distance
              const radialY = pointerY / distance
              const swirl = 4.6 * strength
              const pull = 0.72 * strength
              // 切向力制造持续涡旋，较弱的向心力把粒子留在鼠标周围而不是一次性推散。
              particle.vx += (-radialY * swirl - radialX * pull) * timeScale
              particle.vy += (radialX * swirl - radialY * pull) * timeScale
            }
          }

          const damping = pointer.active ? 0.925 : 0.91
          particle.vx *= damping
          particle.vy *= damping
          particle.x += particle.vx * timeScale
          particle.y += particle.vy * timeScale
        }

        if (particle.glow) {
          context.beginPath()
          context.fillStyle = `rgba(${particle.color}, ${particle.alpha * 0.11})`
          context.arc(particle.x, particle.y, particle.size * 5.5, 0, Math.PI * 2)
          context.fill()
        }

        context.beginPath()
        context.fillStyle = `rgba(${particle.color}, ${particle.alpha})`
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()

        if (!staticFrame && particle.trail && Math.hypot(particle.vx, particle.vy) > 0.35) {
          context.beginPath()
          context.strokeStyle = `rgba(${particle.color}, ${particle.alpha * 0.28})`
          context.lineWidth = Math.max(particle.size * 0.38, 0.45)
          context.moveTo(particle.x, particle.y)
          context.lineTo(particle.x - particle.vx * 4.8, particle.y - particle.vy * 4.8)
          context.stroke()
        }
      }

      context.globalCompositeOperation = 'source-over'
    }

    const start = () => {
      if (frameId || motionQuery.matches || !visible || document.hidden) return
      lastTime = performance.now()
      frameId = requestAnimationFrame(frame)
    }

    const frame = (now: number) => {
      frameId = 0
      if (!visible || document.hidden || motionQuery.matches) return
      render(now)
      frameId = requestAnimationFrame(frame)
    }

    const sync = () => {
      if (motionQuery.matches || !visible || document.hidden) {
        cancelAnimationFrame(frameId)
        frameId = 0
        render(performance.now(), true)
        return
      }
      start()
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      const rect = element.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = pointer.x >= 0 && pointer.x <= rect.width && pointer.y >= 0 && pointer.y <= rect.height
    }
    const onPointerLeave = () => { pointer.active = false }
    const onDensityChange = () => { resize(); sync() }
    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })

    resizeObserver.observe(element)
    intersectionObserver.observe(element)
    interactionTarget.addEventListener('pointermove', onPointerMove, { passive: true })
    interactionTarget.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', sync)
    motionQuery.addEventListener('change', sync)
    compactQuery.addEventListener('change', onDensityChange)
    resize()
    sync()

    cleanup = () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      interactionTarget.removeEventListener('pointermove', onPointerMove)
      interactionTarget.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', sync)
      motionQuery.removeEventListener('change', sync)
      compactQuery.removeEventListener('change', onDensityChange)
    }
  })

  onBeforeUnmount(() => cleanup?.())
}
