import { onBeforeUnmount, onMounted, type ShallowRef } from 'vue'
import { gsap } from 'gsap'

export function useGatewayMotion(root: Readonly<ShallowRef<HTMLElement | null>>) {
  let media: ReturnType<typeof gsap.matchMedia> | undefined
  let active = false
  let boost: ((value: boolean) => void) | undefined

  onMounted(() => {
    const element = root.value
    if (!element) return
    media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const select = gsap.utils.selector(element)
      active = true
      // SSR 保留完整可见内容，按钮不等待入场动画完成。
      const entrance = gsap.from(select('.entrance'), { y: 20, opacity: 0, duration: .85, stagger: .085, ease: 'power3.out', clearProps: 'transform,opacity' })
      const signals = gsap.to(select('.nexus-signal'), { opacity: .2, scale: .5, duration: 1.7, stagger: .35, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      const brackets = gsap.to(select('.nexus-bracket'), { opacity: .14, duration: 3.4, stagger: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      const particleFlow = gsap.timeline({ repeat: -1, yoyo: true })
      particleFlow.to(select('.particle-layer--far'), { x: 8, y: -5, duration: 15, ease: 'sine.inOut' }, 0)
      particleFlow.to(select('.particle-layer--mid'), { x: -13, y: 9, duration: 12, ease: 'sine.inOut' }, 0)
      particleFlow.to(select('.particle-layer--near'), { x: 18, y: -12, duration: 9, ease: 'sine.inOut' }, 0)
      const particleTwinkle = gsap.to(select('.particle-dot--pulse'), { opacity: .12, duration: 1.5, stagger: { each: .08, from: 'random' }, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      const particleLinks = gsap.to(select('.particle-links'), { strokeDashoffset: -90, duration: 16, repeat: -1, ease: 'none' })
      // GSAP 只驱动前景视差；粒子流场与 Canvas UI 涟漪各自维护内部渲染，避免争用 transform。
      const art = select('.portal-parallax')
      const moveX = gsap.quickTo(art, 'x', { duration: 1.1, ease: 'power3.out' })
      const moveY = gsap.quickTo(art, 'y', { duration: 1.1, ease: 'power3.out' })
      const farX = gsap.quickTo(select('.particle-layer--far'), 'xPercent', { duration: 1.8, ease: 'power3.out' })
      const farY = gsap.quickTo(select('.particle-layer--far'), 'yPercent', { duration: 1.8, ease: 'power3.out' })
      const midX = gsap.quickTo(select('.particle-layer--mid'), 'xPercent', { duration: 1.35, ease: 'power3.out' })
      const midY = gsap.quickTo(select('.particle-layer--mid'), 'yPercent', { duration: 1.35, ease: 'power3.out' })
      const nearX = gsap.quickTo(select('.particle-layer--near'), 'xPercent', { duration: .9, ease: 'power3.out' })
      const nearY = gsap.quickTo(select('.particle-layer--near'), 'yPercent', { duration: .9, ease: 'power3.out' })
      const cursorX = gsap.quickTo(select('.particle-cursor'), 'x', { duration: .45, ease: 'power2.out' })
      const cursorY = gsap.quickTo(select('.particle-cursor'), 'y', { duration: .45, ease: 'power2.out' })
      const cursorOpacity = gsap.quickTo(select('.particle-cursor'), 'opacity', { duration: .35, ease: 'power2.out' })
      const coreScaleX = gsap.quickTo(select('.portal-core'), 'scaleX', { duration: .6, ease: 'power2.out' })
      const coreScaleY = gsap.quickTo(select('.portal-core'), 'scaleY', { duration: .6, ease: 'power2.out' })
      const particleSpeed = gsap.quickTo(particleFlow, 'timeScale', { duration: .8 })
      gsap.set(select('.portal-core'), { transformOrigin: '50% 50%' })
      boost = (value) => {
        particleSpeed(value ? 1.9 : 1)
        coreScaleX(value ? 1.08 : 1)
        coreScaleY(value ? 1.08 : 1)
      }
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        const rect = element.getBoundingClientRect()
        const normalizedX = (event.clientX - rect.left) / rect.width - .5
        const normalizedY = (event.clientY - rect.top) / rect.height - .5
        moveX(normalizedX * 22)
        moveY(normalizedY * 18)
        farX(normalizedX * -1.4)
        farY(normalizedY * -1)
        midX(normalizedX * 2.4)
        midY(normalizedY * 1.8)
        nearX(normalizedX * -4.2)
        nearY(normalizedY * -3.2)
        cursorX(event.clientX - rect.left)
        cursorY(event.clientY - rect.top)
        cursorOpacity(1)
      }
      const leave = () => {
        moveX(0); moveY(0)
        farX(0); farY(0); midX(0); midY(0); nearX(0); nearY(0)
        cursorOpacity(0)
        boost?.(false)
      }
      element.addEventListener('pointermove', move, { passive: true })
      element.addEventListener('pointerleave', leave)
      let visible = true
      const sync = () => {
        const pause = document.hidden || !visible
        ;[entrance, signals, brackets, particleFlow, particleTwinkle, particleLinks].forEach(animation => animation.paused(pause))
      }
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
      observer.observe(element)
      document.addEventListener('visibilitychange', sync)
      sync()
      return () => {
        active = false
        boost = undefined
        observer.disconnect()
        element.removeEventListener('pointermove', move)
        element.removeEventListener('pointerleave', leave)
        document.removeEventListener('visibilitychange', sync)
      }
    }, element)
  })

  onBeforeUnmount(() => media?.revert())
  return {
    energize: () => { if (active) boost?.(true) },
    settle: () => { if (active) boost?.(false) }
  }
}
