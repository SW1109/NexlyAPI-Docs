import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue'
import { advanceParticleScene, createParticleScene, particleQuality, setParticlePointer } from './particleSimulation'
import { drawParticleScene } from './particleRenderer'
import type { HomeMotion } from './useHomeMotion'

export const useNexusParticles = (
  canvas: Readonly<Ref<HTMLCanvasElement | null>>,
  motion: HomeMotion,
  active: Readonly<Ref<boolean>>
) => {
  let cleanup: (() => void) | undefined
  onMounted(() => {
    const element = canvas.value
    const context = element?.getContext('2d', { alpha: true })
    if (!element || !context) return

    let scene: ReturnType<typeof createParticleScene> | undefined
    let rect: DOMRect | undefined
    let frameId = 0
    let lastTime = 0
    const invalidateBounds = () => { rect = undefined }
    const syncPointer = () => {
      if (!scene) return
      const point = motion.pointer.value
      if (!point.active || motion.compact.value || !active.value) {
        setParticlePointer(scene, { x: scene.pointer.x, y: scene.pointer.y, active: false })
        return
      }
      rect ??= element.getBoundingClientRect()
      setParticlePointer(scene, { x: point.clientX - rect.left, y: point.clientY - rect.top, active: true })
    }
    const resize = () => {
      rect = element.getBoundingClientRect()
      const width = Math.max(rect.width, 1)
      const height = Math.max(rect.height, 1)
      const compact = motion.compact.value
      const dpr = Math.min(devicePixelRatio || 1, particleQuality(compact).dpr)
      const pixelWidth = Math.round(width * dpr)
      const pixelHeight = Math.round(height * dpr)
      if (scene?.width === width && scene.height === height && scene.compact === compact
        && element.width === pixelWidth && element.height === pixelHeight) return
      element.width = pixelWidth
      element.height = pixelHeight
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      scene = createParticleScene(width, height, compact)
      syncPointer()
      drawParticleScene(context, scene)
    }
    const frame = (now: number) => {
      frameId = 0
      if (!active.value || !scene) return
      const steps = advanceParticleScene(scene, (now - lastTime) / 1000)
      lastTime = now
      // 高刷新率下物理状态没变化时不重复提交相同画面。
      if (steps > 0) drawParticleScene(context, scene)
      frameId = requestAnimationFrame(frame)
    }
    const sync = () => {
      syncPointer()
      if (!active.value) {
        cancelAnimationFrame(frameId)
        frameId = 0
      } else if (!frameId) {
        // 恢复时从当前帧继续，不追赶后台或手动暂停期间的时间。
        lastTime = performance.now()
        frameId = requestAnimationFrame(frame)
      }
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(element)
    window.addEventListener('scroll', invalidateBounds, { passive: true, capture: true })
    window.addEventListener('resize', resize, { passive: true })
    const stops = [
      watch(motion.pointer, syncPointer),
      watch(motion.compact, resize),
      watch(active, sync)
    ]
    resize()
    sync()
    cleanup = () => {
      stops.forEach(stop => stop())
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', invalidateBounds, true)
      window.removeEventListener('resize', resize)
    }
  })
  onBeforeUnmount(() => cleanup?.())
}