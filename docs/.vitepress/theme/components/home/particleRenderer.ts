import { horizonRadius, type ParticleScene } from './particleSimulation'

const drawBlackHole = (context: CanvasRenderingContext2D, scene: ParticleScene, radius: number) => {
  const { x, y, progress, spinAngle } = scene.blackHole
  context.save()
  context.translate(x, y)
  context.globalCompositeOperation = 'source-over'
  const shadow = context.createRadialGradient(0, 0, radius * .25, 0, 0, radius * 2.1)
  shadow.addColorStop(0, `rgba(0, 0, 0, ${.98 * progress})`)
  shadow.addColorStop(.6, `rgba(1, 3, 6, ${.85 * progress})`)
  shadow.addColorStop(.88, `rgba(2, 6, 11, ${.35 * progress})`)
  shadow.addColorStop(1, 'rgba(2, 6, 11, 0)')
  context.beginPath()
  context.fillStyle = shadow
  context.arc(0, 0, radius * 2.1, 0, Math.PI * 2)
  context.fill()

  const core = context.createRadialGradient(-radius * .16, -radius * .16, radius * .05, 0, 0, radius)
  core.addColorStop(0, `rgba(0, 0, 0, ${progress})`)
  core.addColorStop(.88, `rgba(2, 4, 7, ${progress})`)
  core.addColorStop(1, `rgba(5, 12, 18, ${progress})`)
  context.beginPath()
  context.fillStyle = core
  context.arc(0, 0, radius, 0, Math.PI * 2)
  context.fill()

  context.beginPath()
  context.arc(0, 0, radius, 0, Math.PI * 2)
  context.strokeStyle = `rgba(255, 255, 255, ${.96 * progress})`
  context.lineWidth = 1.4
  context.stroke()
  context.beginPath()
  context.arc(0, 0, radius * 1.07, 0, Math.PI * 2)
  context.strokeStyle = `rgba(180, 245, 255, ${.45 * progress})`
  context.lineWidth = .8
  context.stroke()

  context.globalCompositeOperation = 'lighter'
  const halo = context.createRadialGradient(0, 0, radius * .95, 0, 0, radius * 1.65)
  halo.addColorStop(0, `rgba(255, 255, 255, ${.8 * progress})`)
  halo.addColorStop(.25, `rgba(180, 245, 255, ${.48 * progress})`)
  halo.addColorStop(.68, `rgba(88, 215, 195, ${.18 * progress})`)
  halo.addColorStop(1, 'rgba(88, 215, 195, 0)')
  context.beginPath()
  context.fillStyle = halo
  context.arc(0, 0, radius * 1.65, 0, Math.PI * 2)
  context.fill()

  context.rotate(-.32 + Math.sin(scene.elapsed * .5) * .05)
  context.beginPath()
  context.ellipse(0, -radius * .15, radius * 1.55, radius * .52, 0, Math.PI * .95, Math.PI * 2.05)
  context.strokeStyle = `rgba(255, 255, 255, ${.48 * progress})`
  context.lineWidth = 1.1
  context.stroke()
  context.beginPath()
  context.ellipse(0, radius * .18, radius * 1.42, radius * .42, 0, 0, Math.PI * 1.05)
  context.strokeStyle = `rgba(88, 215, 195, ${.32 * progress})`
  context.lineWidth = .85
  context.stroke()

  context.rotate(spinAngle)
  context.beginPath()
  context.arc(0, 0, radius * 1.5, 0, Math.PI * 2)
  context.strokeStyle = `rgba(220, 250, 255, ${.28 * progress})`
  context.lineWidth = .75
  context.setLineDash([7, 16, 2, 16])
  context.stroke()
  context.beginPath()
  context.arc(0, 0, radius * 2.05, 0, Math.PI * 2)
  context.strokeStyle = `rgba(130, 118, 247, ${.18 * progress})`
  context.lineWidth = .65
  context.setLineDash([3, 22])
  context.stroke()
  context.restore()
}

export const drawParticleScene = (context: CanvasRenderingContext2D, scene: ParticleScene) => {
  const { width, height, elapsed, blackHole } = scene
  const radius = horizonRadius(scene)
  context.clearRect(0, 0, width, height)
  context.globalCompositeOperation = 'lighter'
  for (const particle of scene.particles) {
    const edgeFade = particle.x < width * .15 ? Math.max(0, particle.x / (width * .15)) : 1
    const twinkle = .82 + Math.sin(elapsed * particle.twinkleFreq + particle.twinklePhase) * .18
    const alpha = particle.alpha * twinkle * edgeFade
    const speed = Math.hypot(particle.vx, particle.vy)
    const nearHole = blackHole.progress > .05 && Math.hypot(particle.x - blackHole.x, particle.y - blackHole.y) < radius * 2.8
    const size = nearHole ? Math.min(particle.size * .92, 1.25) : particle.size
    const color = nearHole ? '230, 250, 255' : particle.color
    const opacity = nearHole ? Math.min(alpha * 1.5, .95) : alpha
    if (particle.glow) {
      context.beginPath()
      context.fillStyle = `rgba(${color}, ${opacity * .22})`
      context.arc(particle.x, particle.y, size * 2.2, 0, Math.PI * 2)
      context.fill()
    }
    context.beginPath()
    context.fillStyle = `rgba(${color}, ${opacity})`
    context.arc(particle.x, particle.y, size, 0, Math.PI * 2)
    context.fill()
    if (nearHole && speed > 1.2) {
      const trail = Math.min(speed * 1.8, 9)
      context.beginPath()
      context.strokeStyle = `rgba(${color}, ${opacity * .45})`
      context.lineWidth = .75
      context.moveTo(particle.x, particle.y)
      context.lineTo(particle.x - particle.vx / speed * trail, particle.y - particle.vy / speed * trail)
      context.stroke()
    }
  }
  if (blackHole.progress > .005) drawBlackHole(context, scene, radius)
  context.globalCompositeOperation = 'source-over'
}