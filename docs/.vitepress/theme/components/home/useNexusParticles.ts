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
  // 生命微颤与呼吸量子涨落
  twinklePhase: number
  twinkleFreq: number
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
    const pointer = { x: 0, y: 0, active: false, proximity: 0 }
    // 黑洞状态：通过缓动与平滑进度控制黑洞的生成、消隐与天体运动
    const blackHole = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      progress: 0,
      spinAngle: 0,
      initialized: false
    }
    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)')
    const compactQuery = matchMedia('(max-width: 760px), (pointer: coarse)')
    const interactionTarget = element.closest<HTMLElement>('.portal-scene') ?? element
    // 监听范围提升至整体门户容器，实现页面左侧文案到右侧粒子场的无缝平滑过渡
    const hostTarget = element.closest<HTMLElement>('.gateway') ?? interactionTarget
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
        size: 0.42 + random() * (random() > 0.88 ? 1.85 : 0.95),
        alpha: 0.18 + random() * 0.68,
        color: COLORS[Math.floor(random() * COLORS.length)]!,
        glow: index % 17 === 0,
        trail: index % 6 === 0,
        twinklePhase: random() * Math.PI * 2,
        twinkleFreq: 1.4 + random() * 2.4
      }
      const target = resolveTarget(particle, elapsed)
      particle.x = target.x + (random() - 0.5) * 10
      particle.y = target.y + (random() - 0.5) * 10
      return particle
    }

    const populate = (elapsed = 0) => {
      const compact = compactQuery.matches
      // 提升粒子生成密度，呈现浩瀚、充满生机的星海
      const density = compact ? 420 : 175
      const count = clamp(Math.round((width * height) / density), compact ? 520 : 1200, compact ? 920 : 2400)
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

      // 动态更新黑洞激活度：基于平滑接近度插值，杜绝越界突变
      const targetProgress = pointer.active ? pointer.proximity : 0
      blackHole.progress += (targetProgress - blackHole.progress) * 0.08 * timeScale
      if (blackHole.progress < 0.0006) {
        blackHole.progress = 0
      }

      if (blackHole.progress > 0) {
        blackHole.targetX = pointer.x
        blackHole.targetY = pointer.y
        // 惯性阻尼跟随鼠标，赋予大质量天体沉稳的大气质感
        blackHole.x += (blackHole.targetX - blackHole.x) * 0.15 * timeScale
        blackHole.y += (blackHole.targetY - blackHole.y) * 0.15 * timeScale
        blackHole.spinAngle += 0.012 * timeScale
      }

      const isCompact = compactQuery.matches
      // 精致协调的黄金比例黑洞（桌面端基准视界半径 38px，直径 76px）
      const baseHorizon = isCompact ? 25 : 38
      const horizonRadius = baseHorizon * (0.35 + 0.65 * blackHole.progress) * (1 + Math.sin(elapsed * 2.2) * 0.012)
      // 适度扩大引力影响半径，让中远距离星辰也能清晰感知引力牵引
      const influenceRadius = Math.min(width, height) * (isCompact ? 0.42 : 0.52)

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

          if (blackHole.progress > 0.001) {
            const dx = particle.x - blackHole.x
            const dy = particle.y - blackHole.y
            const distance = Math.hypot(dx, dy)

            if (distance > 0 && distance < influenceRadius) {
              const norm = distance / influenceRadius
              // 随距离平滑衰减的引力势能因子
              const influence = (1 - norm) ** 1.15 * blackHole.progress

              const nx = dx / distance
              const ny = dy / distance
              // 统一顺时针切向旋转向量
              const tx = -ny
              const ty = nx

              // 在引力场内适度降低原路径回归权重，让黑洞引力主导粒子轨迹
              const returnWeight = (1 - influence * 0.72) * 0.012
              particle.vx += deltaX * returnWeight * timeScale
              particle.vy += deltaY * returnWeight * timeScale

              // 光环吸积平衡轨道：精准定位在圆圈周围的黑色光环内（视界外缘 1.35 倍半径处）
              const haloOrbitRadius = horizonRadius * 1.35
              const innerBarrier = horizonRadius * 1.12

              if (distance > haloOrbitRadius) {
                // 外部周围：平滑向心牵引向黑色光环，同时赋予顺畅的切向绕流
                const pullToHalo = Math.min((distance - haloOrbitRadius) / (influenceRadius - haloOrbitRadius), 1) * 2.3 * influence
                const orbitBoost = (1.5 + (1 - norm) * 2.2) * influence
                particle.vx += (-nx * pullToHalo + tx * orbitBoost) * timeScale
                particle.vy += (-ny * pullToHalo + ty * orbitBoost) * timeScale
              } else if (distance >= innerBarrier) {
                // 黑色光环内：径向力平衡，纯切向高速平稳旋转，粒子如璀璨星河布满光环
                const orbitSpeed = 3.6 * blackHole.progress
                // 轻微的径向稳定阻尼，将粒子牢牢稳定在黑色光环带内盘旋
                const radialDrift = (distance - haloOrbitRadius) * 0.08 * timeScale
                particle.vx += (tx * orbitSpeed - nx * radialDrift) * timeScale
                particle.vy += (ty * orbitSpeed - ny * radialDrift) * timeScale
              } else {
                // 绝对禁入黑洞中间：内视界强力屏障向外排斥至光环层，内部保持绝对真空与纯黑
                const pushOut = (1 - distance / innerBarrier) * 4.2 * blackHole.progress
                particle.vx += (nx * pushOut + tx * 3.2 * blackHole.progress) * timeScale
                particle.vy += (ny * pushOut + ty * 3.2 * blackHole.progress) * timeScale

                // 强制将粒子约束在视界外沿光环内，黑洞中间绝无任何粒子侵入
                if (distance < horizonRadius * 1.05) {
                  particle.x = blackHole.x + nx * (horizonRadius * 1.06)
                  particle.y = blackHole.y + ny * (horizonRadius * 1.06)
                }
              }

              // 速度上限平滑钳制，保证光环内高速旋转时依然轻盈丝滑
              const curSpeed = Math.hypot(particle.vx, particle.vy)
              const maxSpeed = 4.8
              if (curSpeed > maxSpeed) {
                particle.vx = (particle.vx / curSpeed) * maxSpeed
                particle.vy = (particle.vy / curSpeed) * maxSpeed
              }
            } else {
              particle.vx += deltaX * 0.012 * timeScale
              particle.vy += deltaY * 0.012 * timeScale
            }
          } else {
            // 流线首尾循环时直接换位，避免粒子跨越整个画面形成突兀直线
            if (particle.kind === 'stream' && Math.abs(deltaX) > width * 0.72) {
              particle.x = targetX
              particle.y = targetY
              particle.vx = 0
              particle.vy = 0
            } else {
              particle.vx += deltaX * 0.012 * timeScale
              particle.vy += deltaY * 0.012 * timeScale
            }
          }

          const damping = blackHole.progress > 0.05 ? 0.938 : 0.915
          particle.vx *= damping
          particle.vy *= damping
          particle.x += particle.vx * timeScale
          particle.y += particle.vy * timeScale
        }

        // 画布边缘平滑淡隐，彻底消除左侧交界处的硬切线
        const edgeFade = particle.x < width * 0.15 ? Math.max(0, particle.x / (width * 0.15)) : 1
        // 赋予粒子独立星辰呼吸律动 (Twinkle)
        const twinkle = 0.82 + Math.sin(elapsed * particle.twinkleFreq + particle.twinklePhase) * 0.18
        const currentAlpha = particle.alpha * twinkle * edgeFade

        const speed = Math.hypot(particle.vx, particle.vy)
        const isNearHole = blackHole.progress > 0.05 && Math.hypot(particle.x - blackHole.x, particle.y - blackHole.y) < horizonRadius * 2.8

        // 晶莹纯净的星尘微粒：半径 0.45px ~ 1.25px，微亮通透
        const renderSize = isNearHole ? Math.min(particle.size * 0.92, 1.25) : particle.size
        const renderColor = isNearHole ? '230, 250, 255' : particle.color
        const renderAlpha = isNearHole ? Math.min(currentAlpha * 1.5, 0.95) : currentAlpha

        if (particle.glow) {
          context.beginPath()
          context.fillStyle = `rgba(${renderColor}, ${renderAlpha * 0.22})`
          context.arc(particle.x, particle.y, renderSize * 2.2, 0, Math.PI * 2)
          context.fill()
        }

        context.beginPath()
        context.fillStyle = `rgba(${renderColor}, ${renderAlpha})`
        context.arc(particle.x, particle.y, renderSize, 0, Math.PI * 2)
        context.fill()

        // 仅对受强引力加速掠过的星辰，绘制极短、柔和、流光微痕（长度仅 4~9px，两端柔和，绝非蝌蚪与硬刺）
        if (!staticFrame && isNearHole && speed > 1.2) {
          const microTrail = Math.min(speed * 1.8, 9)
          context.beginPath()
          context.strokeStyle = `rgba(${renderColor}, ${renderAlpha * 0.45})`
          context.lineWidth = 0.75
          context.moveTo(particle.x, particle.y)
          context.lineTo(particle.x - (particle.vx / speed) * microTrail, particle.y - (particle.vy / speed) * microTrail)
          context.stroke()
        }
      }

      // 黄金比例天体黑洞主体与精致爱因斯坦光子环渲染
      if (blackHole.progress > 0.005) {
        const bhX = blackHole.x
        const bhY = blackHole.y
        const p = blackHole.progress
        const hr = horizonRadius

        // 1. source-over 绘制绝对吸收深渊与纯色/亮黑奇点核心
        context.globalCompositeOperation = 'source-over'

        // 重力吸收暗影：吞噬杂光，形成深邃时空凹陷
        const shadowGrad = context.createRadialGradient(bhX, bhY, hr * 0.25, bhX, bhY, hr * 2.1)
        shadowGrad.addColorStop(0, `rgba(0, 0, 0, ${0.98 * p})`)
        shadowGrad.addColorStop(0.6, `rgba(1, 3, 6, ${0.85 * p})`)
        shadowGrad.addColorStop(0.88, `rgba(2, 6, 11, ${0.35 * p})`)
        shadowGrad.addColorStop(1, 'rgba(2, 6, 11, 0)')
        context.beginPath()
        context.fillStyle = shadowGrad
        context.arc(bhX, bhY, hr * 2.1, 0, Math.PI * 2)
        context.fill()

        // 纯色/亮黑核心圆（事件视界）：深邃黑曜石质感，纯净克制
        const coreGrad = context.createRadialGradient(bhX - hr * 0.16, bhY - hr * 0.16, hr * 0.05, bhX, bhY, hr)
        coreGrad.addColorStop(0, `rgba(0, 0, 0, ${p})`)
        coreGrad.addColorStop(0.88, `rgba(2, 4, 7, ${p})`)
        coreGrad.addColorStop(1, `rgba(5, 12, 18, ${p})`)
        context.beginPath()
        context.fillStyle = coreGrad
        context.arc(bhX, bhY, hr, 0, Math.PI * 2)
        context.fill()

        // 双层光子环：内层纯白极致高亮光子球
        context.beginPath()
        context.arc(bhX, bhY, hr, 0, Math.PI * 2)
        context.strokeStyle = `rgba(255, 255, 255, ${0.96 * p})`
        context.lineWidth = 1.4
        context.stroke()

        // 双层光子环：外层微晕冰青白细环
        context.beginPath()
        context.arc(bhX, bhY, hr * 1.07, 0, Math.PI * 2)
        context.strokeStyle = `rgba(180, 245, 255, ${0.45 * p})`
        context.lineWidth = 0.8
        context.stroke()

        // 2. lighter 叠加吸积盘辉光与引力透镜弯曲光弧
        context.globalCompositeOperation = 'lighter'

        // 紧贴光子球的纯白/青蓝微光晕
        const haloGrad = context.createRadialGradient(bhX, bhY, hr * 0.95, bhX, bhY, hr * 1.65)
        haloGrad.addColorStop(0, `rgba(255, 255, 255, ${0.8 * p})`)
        haloGrad.addColorStop(0.25, `rgba(180, 245, 255, ${0.48 * p})`)
        haloGrad.addColorStop(0.68, `rgba(88, 215, 195, ${0.18 * p})`)
        haloGrad.addColorStop(1, 'rgba(88, 215, 195, 0)')
        context.beginPath()
        context.fillStyle = haloGrad
        context.arc(bhX, bhY, hr * 1.65, 0, Math.PI * 2)
        context.fill()

        // 引力透镜弯曲吸积光弧（精致天体特征）
        context.save()
        context.translate(bhX, bhY)
        const tiltAngle = -0.32 + Math.sin(elapsed * 0.5) * 0.05
        context.rotate(tiltAngle)

        // 上透镜弯曲流光弧
        context.beginPath()
        context.ellipse(0, -hr * 0.15, hr * 1.55, hr * 0.52, 0, Math.PI * 0.95, Math.PI * 2.05)
        context.strokeStyle = `rgba(255, 255, 255, ${0.48 * p})`
        context.lineWidth = 1.1
        context.stroke()

        // 下透镜吸积盘底弧
        context.beginPath()
        context.ellipse(0, hr * 0.18, hr * 1.42, hr * 0.42, 0, 0, Math.PI * 1.05)
        context.strokeStyle = `rgba(88, 215, 195, ${0.32 * p})`
        context.lineWidth = 0.85
        context.stroke()

        // 量子吸积刻度环（精密科技网关质感）
        context.rotate(blackHole.spinAngle)
        context.beginPath()
        context.arc(0, 0, hr * 1.5, 0, Math.PI * 2)
        context.strokeStyle = `rgba(220, 250, 255, ${0.28 * p})`
        context.lineWidth = 0.75
        context.setLineDash([7, 16, 2, 16])
        context.stroke()

        context.beginPath()
        context.arc(0, 0, hr * 2.05, 0, Math.PI * 2)
        context.strokeStyle = `rgba(130, 118, 247, ${0.18 * p})`
        context.lineWidth = 0.65
        context.setLineDash([3, 22])
        context.stroke()
        context.restore()
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

      // 宽容边缘缓冲带：向左延展至文案区域，平滑消除左进入右时的突兀生硬感
      const marginX = Math.max(rect.width * 0.45, 320)
      const marginY = Math.max(rect.height * 0.35, 200)

      const isInsideX = pointer.x >= -marginX && pointer.x <= rect.width + marginX
      const isInsideY = pointer.y >= -marginY && pointer.y <= rect.height + marginY

      if (isInsideX && isInsideY) {
        pointer.active = true
        // 计算平滑接近权重 proximity [0, 1]
        let factorX = 1
        if (pointer.x < 0) {
          factorX = Math.max(0, 1 + pointer.x / marginX)
        } else if (pointer.x > rect.width) {
          factorX = Math.max(0, 1 - (pointer.x - rect.width) / marginX)
        }

        let factorY = 1
        if (pointer.y < 0) {
          factorY = Math.max(0, 1 + pointer.y / marginY)
        } else if (pointer.y > rect.height) {
          factorY = Math.max(0, 1 - (pointer.y - rect.height) / marginY)
        }

        const rawProximity = factorX * factorY
        pointer.proximity = rawProximity * rawProximity * (3 - 2 * rawProximity)

        // 首次激活时对齐坐标，防止从 (0,0) 出现瞬移飞线
        if (!blackHole.initialized) {
          blackHole.x = pointer.x
          blackHole.y = pointer.y
          blackHole.targetX = pointer.x
          blackHole.targetY = pointer.y
          blackHole.initialized = true
        }
      } else {
        pointer.active = false
        pointer.proximity = 0
      }
    }
    const onPointerLeave = () => {
      pointer.active = false
      pointer.proximity = 0
    }
    const onDensityChange = () => { resize(); sync() }
    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })

    resizeObserver.observe(element)
    intersectionObserver.observe(element)
    hostTarget.addEventListener('pointermove', onPointerMove, { passive: true })
    hostTarget.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', sync)
    motionQuery.addEventListener('change', sync)
    compactQuery.addEventListener('change', onDensityChange)
    resize()
    sync()

    cleanup = () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      hostTarget.removeEventListener('pointermove', onPointerMove)
      hostTarget.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', sync)
      motionQuery.removeEventListener('change', sync)
      compactQuery.removeEventListener('change', onDensityChange)
    }
  })

  onBeforeUnmount(() => cleanup?.())
}
