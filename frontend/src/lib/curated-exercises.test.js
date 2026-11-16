import { describe, it, expect } from 'vitest'
import { EXDB, EXIDX } from './exercises.js'
import { MUSCLES } from './muscles.js'
import {
  CURATED_BY_MUSCLE,
  CURATED_ID_SET,
  QUICK_SCENES,
  buildRoutineFromCombo,
  exerciseMetaOf,
  isEssentialForMuscle,
  muscleComboFor,
  muscleCountsOf,
} from './curated-exercises.js'

describe('curated-exercises', () => {
  it('defines essential exercises and a valid starter combo for every muscle in MUSCLES', () => {
    for (const m of MUSCLES) {
      const cfg = CURATED_BY_MUSCLE[m]
      expect(cfg, `missing config for ${m}`).toBeTruthy()
      expect(cfg.essentialIds.length).toBeGreaterThanOrEqual(5)
      for (const id of cfg.essentialIds) {
        expect(EXIDX[id], `missing EXIDX[${id}] for ${m}`).toBeTruthy()
      }
      const combo = muscleComboFor(m)
      expect(combo, `missing combo for ${m}`).toBeTruthy()
      expect(combo.items.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('classifies essential staples, beginner-friendly machines/bodyweight, and compound lifts accurately', () => {
    const chestMachine = EXIDX['0576'] // lever chest press
    const metaM = exerciseMetaOf(chestMachine)
    expect(metaM.isEssential).toBe(true)
    expect(metaM.difficulty).toBe('beginner')
    expect(metaM.mechanic).toBe('compound')

    const bbBench = EXIDX['0025'] // barbell bench press
    const metaB = exerciseMetaOf(bbBench)
    expect(metaB.isEssential).toBe(true)
    expect(metaB.difficulty).toBe('intermediate')
    expect(metaB.mechanic).toBe('compound')

    const cableFly = EXIDX['0596'] // lever seated fly (chest)
    const metaF = exerciseMetaOf(cableFly)
    expect(metaF.difficulty).toBe('beginner')
    expect(metaF.mechanic).toBe('isolation')

    expect(CURATED_ID_SET.has('0025')).toBe(true)
    expect(isEssentialForMuscle(chestMachine, 'chest')).toBe(true)
  })

  it('separates primary vs total vs essential counts per muscle and filters quick setups cleanly', () => {
    const chestCounts = muscleCountsOf(EXDB, 'chest')
    expect(chestCounts.essential).toBeGreaterThan(0)
    expect(chestCounts.essential).toBeLessThan(chestCounts.primary)
    expect(chestCounts.primary).toBeLessThan(chestCounts.total)

    const homeScene = QUICK_SCENES.find(s => s.id === 'home')
    const dbScene = QUICK_SCENES.find(s => s.id === 'dumbbell')
    expect(homeScene.match(EXIDX['0662'])).toBe(true) // push-up
    expect(homeScene.match(EXIDX['0025'])).toBe(false) // barbell bench press
    expect(dbScene.match(EXIDX['0289'])).toBe(true) // dumbbell bench press
  })

  it('builds a ready-to-save Routine from any muscle starter combo', () => {
    const r = buildRoutineFromCombo('chest', 'vi')
    expect(r).toBeTruthy()
    expect(r.name).toContain('Ngực')
    expect(r.ex.length).toBe(4)
    expect(r.ex[0]).toMatchObject({ id: '0576', sets: 3, reps: 10 })
  })
})
