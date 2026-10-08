import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue'
import type { HomeMotion } from './useHomeMotion'

export const useGatewayMotion = (root: Readonly<Ref<HTMLElement | null>>, motion: HomeMotion) => {
  let boost: ((value: boolean) => void) | undefined
  let stop: (() => void) | undefined

  onMounted(() => {
    const element = root.value
    if (!element) return
    stop = watch(motion.reduced, async (reduced, _, onCleanup) => {
      if (reduced) return
      let cancelled = false
      let context: import('gsap').gsap.Context | undefined
      const stops: (() => void)[] = []
      onCleanup(() => {
        cancelled = true
        boost = undefined
        stops.forEach(dispose => dispose())
        context?.revert()
      })

      try {
        const { gsap } = await import('gsap')
        if (cancelled) return
        context = gsap.context(() => {
          const select = gsap.utils.selector(element)
          // SSR 内容始终可见；静态模式或暂停时不留下半透明的入场元素。
          const entrance = motion.running.value
            ? gsap.from(select('.entrance'), { y: 20, opacity: 0, duration: .85, stagger: .085, ease: 'power3.out', clearProps: 'transform,opacity' })
            : undefined
          const flow = gsap.timeline({ repeat: -1, yoyo: true })
            .to(select('.particle-layer--far'), { x: 8, y: -5, duration: 15, ease: 'sine.inOut' }, 0)
            .to(select('.particle-layer--mid'), { x: -13, y: 9, duration: 12, ease: 'sine.inOut' }, 0)
            .to(select('.particle-layer--near'), { x: 18, y: -12, duration: 9, ease: 'sine.inOut' }, 0)
          const loops = [
            flow,
            gsap.to(select('.nexus-signal'), { opacity: .2, scale: .5, duration: 1.7, stagger: .35, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
            gsap.to(select('.nexus-bracket'), { opacity: .14, duration: 3.4, stagger: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
            gsap.to(select('.particle-dot--pulse'), { opacity: .12, duration: 1.5, stagger: .08, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
            gsap.to(select('.particle-links'), { strokeDashoffset: -90, duration: 16, repeat: -1, ease: 'none' })
          ]
          const smooth = (selector: string, property: string, duration: number) =>
            gsap.quickTo(select(selector), property, { duration, ease: 'power3.out' })
          const moveX = smooth('.portal-parallax', 'x', 1.1)
          const moveY = smooth('.portal-parallax', 'y', 1.1)
          const farX = smooth('.particle-layer--far', 'xPercent', 1.8)
          const farY = smooth('.particle-layer--far', 'yPercent', 1.8)
          const midX = smooth('.particle-layer--mid', 'xPercent', 1.35)
          const midY = smooth('.particle-layer--mid', 'yPercent', 1.35)
          const nearX = smooth('.particle-layer--near', 'xPercent', .9)
          const nearY = smooth('.particle-layer--near', 'yPercent', .9)
          const cursorX = smooth('.particle-cursor', 'x', .45)
          const cursorY = smooth('.particle-cursor', 'y', .45)
          const cursorOpacity = smooth('.particle-cursor', 'opacity', .35)
          const scaleX = smooth('.portal-core', 'scaleX', .6)
          const scaleY = smooth('.portal-core', 'scaleY', .6)
          const speed = gsap.quickTo(flow, 'timeScale', { duration: .8 })
          const responses = [moveX, moveY, farX, farY, midX, midY, nearX, nearY, cursorX, cursorY, cursorOpacity, scaleX, scaleY, speed]
          gsap.set(select('.portal-core'), { transformOrigin: '50% 50%' })
          boost = value => {
            speed(value ? 1.9 : 1)
            scaleX(value ? 1.08 : 1)
            scaleY(value ? 1.08 : 1)
          }
          const reset = () => {
            moveX(0); moveY(0)
            farX(0); farY(0); midX(0); midY(0); nearX(0); nearY(0)
            cursorOpacity(0)
            boost?.(false)
          }
          stops.push(watch(motion.pointer, point => {
            if (!motion.running.value) return
            if (!point.active) return reset()
            moveX(point.normalizedX * 22)
            moveY(point.normalizedY * 18)
            farX(point.normalizedX * -1.4); farY(point.normalizedY * -1)
            midX(point.normalizedX * 2.4); midY(point.normalizedY * 1.8)
            nearX(point.normalizedX * -4.2); nearY(point.normalizedY * -3.2)
            cursorX(point.x); cursorY(point.y); cursorOpacity(1)
          }))
          stops.push(watch(motion.running, running => {
            if (!running) entrance?.progress(1).kill()
            loops.forEach(animation => animation.paused(!running))
            responses.forEach(response => response.tween.paused(!running))
            if (running && !motion.pointer.value.active) reset()
          }, { immediate: true }))
        }, element)
      } catch {
        // 装饰脚本加载失败时保留静态首页，不阻断导航和搜索。
        boost = undefined
        stops.forEach(dispose => dispose())
        context?.revert()
      }
    }, { immediate: true })
  })

  onBeforeUnmount(() => stop?.())
  return {
    energize: () => { if (motion.running.value) boost?.(true) },
    settle: () => { if (motion.running.value) boost?.(false) }
  }
}