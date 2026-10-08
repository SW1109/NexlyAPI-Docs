import { computed, onBeforeUnmount, onMounted, shallowRef, type Ref } from 'vue'

export type HomePointer = {
  clientX: number
  clientY: number
  x: number
  y: number
  normalizedX: number
  normalizedY: number
  active: boolean
}

const idlePointer = (): HomePointer => ({
  clientX: 0, clientY: 0, x: 0, y: 0, normalizedX: 0, normalizedY: 0, active: false
})

export const useHomeMotion = (root: Readonly<Ref<HTMLElement | null>>) => {
  const paused = shallowRef(false)
  const reduced = shallowRef(true)
  const compact = shallowRef(false)
  const visible = shallowRef(false)
  const foreground = shallowRef(false)
  const pointer = shallowRef<HomePointer>(idlePointer())
  const running = computed(() => !paused.value && !reduced.value && visible.value && foreground.value)
  let cleanup: (() => void) | undefined

  onMounted(() => {
    const element = root.value
    if (!element) return
    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)')
    const compactQuery = matchMedia('(max-width: 760px), (pointer: coarse)')
    let frame = 0
    let rect: DOMRect | undefined
    let lastEvent: PointerEvent | undefined

    const clearPointer = () => {
      cancelAnimationFrame(frame)
      frame = 0
      lastEvent = undefined
      pointer.value = idlePointer()
    }
    const sync = () => {
      reduced.value = motionQuery.matches
      compact.value = compactQuery.matches
      foreground.value = !document.hidden
      if (!running.value || compact.value) clearPointer()
    }
    const measure = () => { rect = undefined }
    const sample = () => {
      frame = 0
      if (!lastEvent || !running.value || compact.value) return
      // 多个动效共享每帧一次的输入；布局只在滚动或尺寸变化后重新测量。
      rect ??= element.getBoundingClientRect()
      const x = lastEvent.clientX - rect.left
      const y = lastEvent.clientY - rect.top
      pointer.value = {
        clientX: lastEvent.clientX,
        clientY: lastEvent.clientY,
        x, y,
        normalizedX: x / Math.max(rect.width, 1) - 0.5,
        normalizedY: y / Math.max(rect.height, 1) - 0.5,
        active: true
      }
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !running.value || compact.value) return
      lastEvent = event
      if (!frame) frame = requestAnimationFrame(sample)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible.value = entry.isIntersecting
      sync()
    })
    const resize = new ResizeObserver(measure)
    observer.observe(element)
    resize.observe(element)
    element.addEventListener('pointermove', move, { passive: true })
    element.addEventListener('pointerleave', clearPointer)
    window.addEventListener('scroll', measure, { passive: true, capture: true })
    window.addEventListener('resize', measure, { passive: true })
    document.addEventListener('visibilitychange', sync)
    motionQuery.addEventListener('change', sync)
    compactQuery.addEventListener('change', sync)
    sync()

    cleanup = () => {
      clearPointer()
      observer.disconnect()
      resize.disconnect()
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', clearPointer)
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
      document.removeEventListener('visibilitychange', sync)
      motionQuery.removeEventListener('change', sync)
      compactQuery.removeEventListener('change', sync)
    }
  })

  onBeforeUnmount(() => cleanup?.())

  return {
    paused, reduced, compact, running, pointer,
    toggle: () => {
      paused.value = !paused.value
      pointer.value = idlePointer()
    }
  }
}

export type HomeMotion = ReturnType<typeof useHomeMotion>