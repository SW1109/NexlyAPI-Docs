import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { transformWithEsbuild } from 'vite'

const source = new URL('../docs/.vitepress/theme/components/home/particleSimulation.ts', import.meta.url)
const { code } = await transformWithEsbuild(await readFile(source, 'utf8'), source.pathname, { loader: 'ts' })
const { createParticleScene, advanceParticleScene, setParticlePointer, particleQuality } =
  await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)

const simulate = (hz, active = false) => {
  const scene = createParticleScene(800, 720, false)
  setParticlePointer(scene, { x: 400, y: 320, active })
  for (let i = 0; i < hz * 2; i++) advanceParticleScene(scene, 1 / hz)
  return scene
}

test('固定种子生成可复现粒子，质量档位遵守数量与 DPR 上限', () => {
  assert.deepEqual(createParticleScene(800, 720, false), createParticleScene(800, 720, false))
  for (const compact of [true, false]) {
    const quality = particleQuality(compact)
    assert.equal(createParticleScene(1, 1, compact).particles.length, quality.min)
    assert.equal(createParticleScene(4000, 4000, compact).particles.length, quality.max)
    assert(quality.dpr <= 1.8)
  }
})

for (const active of [false, true]) {
  test(`60/120/144Hz 下物理结果一致（指针${active ? '激活' : '关闭'}）`, () => {
    const baseline = simulate(60, active)
    for (const hz of [120, 144]) {
      const scene = simulate(hz, active)
      assert.deepEqual(scene.particles, baseline.particles)
      assert.deepEqual(scene.blackHole, baseline.blackHole)
      assert.equal(scene.elapsed, baseline.elapsed)
    }
  })
}

test('零时间步不推进状态，长时间卡顿最多推进 100ms', () => {
  const scene = createParticleScene(800, 720, false)
  const before = structuredClone(scene)
  advanceParticleScene(scene, 0)
  assert.deepEqual(scene, before)
  advanceParticleScene(scene, 120)
  assert(scene.elapsed <= .100000001)
  assert(scene.pendingTime < 1 / 60)
})

test('高刷新率不重复绘制相同状态，2 秒最多产生 120 个新画面', () => {
  for (const hz of [60, 120, 144]) {
    const scene = createParticleScene(400, 360, true)
    let frames = 0
    for (let i = 0; i < hz * 2; i++) {
      if (advanceParticleScene(scene, 1 / hz) > 0) frames++
    }
    assert.equal(frames, 120)
  }
})

test('指针离开后引力收敛，不产生无效坐标', () => {
  const scene = simulate(60, true)
  assert(scene.blackHole.progress > .99)
  setParticlePointer(scene, { x: 400, y: 320, active: false })
  for (let i = 0; i < 120; i++) advanceParticleScene(scene, 1 / 60)
  assert.equal(scene.blackHole.progress, 0)
  for (const particle of scene.particles) {
    for (const key of ['x', 'y', 'vx', 'vy']) assert(Number.isFinite(particle[key]))
  }
})