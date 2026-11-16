import { describe, it, expect, vi } from 'vitest'
import {
  computeOnboardingPreview,
  recommendPlanForProfile,
  needsGoalOnboarding,
  applyGoalOnboarding
} from './starter-onboarding.js'

describe('starter-onboarding', () => {
  it('recommends Full Body + Fat Loss meal plan for beginner fat loss 3 days/wk', () => {
    const rec = recommendPlanForProfile({ goal: 'cut', experience: 'beginner', daysPerWeek: 3 })
    expect(rec).toEqual({
      workoutPlanId: 'full-body',
      mealTemplateId: 'plan_fat_loss_cut'
    })
  })

  it('recommends Upper/Lower + Muscle Bulk meal plan for 4+ days lean bulk', () => {
    const rec = recommendPlanForProfile({ goal: 'lean_bulk', experience: 'returning', daysPerWeek: 4 })
    expect(rec).toEqual({
      workoutPlanId: 'upper-lower',
      mealTemplateId: 'plan_muscle_bulk'
    })
  })

  it('recommends PPL for intermediate lean bulk 3 days/wk', () => {
    const rec = recommendPlanForProfile({ goal: 'lean_bulk', experience: 'intermediate', daysPerWeek: 3 })
    expect(rec).toEqual({
      workoutPlanId: 'ppl',
      mealTemplateId: 'plan_muscle_bulk'
    })
  })

  it('computes BMI, BMR, TDEE and macro targets accurately', () => {
    const preview = computeOnboardingPreview({
      goal: 'cut',
      experience: 'beginner',
      daysPerWeek: 3,
      sex: 'male',
      age: 25,
      heightCm: 175,
      weightKg: 80,
      targetWeightKg: 72,
      activityLevel: 'moderate'
    })
    expect(preview.bmi).toBe(26.1)
    expect(preview.bmiCategory).toBe('obese')
    expect(preview.targets.bmr).toBeGreaterThan(1600)
    expect(preview.targets.tdee).toBeGreaterThan(preview.targets.bmr)
    expect(preview.targets.kcal).toBeLessThan(preview.targets.tdee)
    expect(preview.targets.protein).toBeGreaterThan(100)
  })

  it('detects when a fresh user needs goal onboarding', () => {
    expect(needsGoalOnboarding({ routines: [], workouts: [] })).toBe(true)
    expect(needsGoalOnboarding({ routines: [{ id: 'r1' }], workouts: [] })).toBe(false)
    expect(needsGoalOnboarding({ routines: [], workouts: [{ id: 'w1' }] })).toBe(false)
    expect(needsGoalOnboarding({ routines: [], workouts: [], starterSetupDone: { at: 1 } })).toBe(false)
  })

  it('applies goal, body metrics, 7-day nutrition plan, and calls loadStarterPlanFn', () => {
    const state = {
      S: {
        sex: null,
        birthYear: null,
        targetW: null,
        bodyweight: [],
        routines: [],
        week: {},
        profiles: [{ id: 'p1', name: 'Gym', equipment: null }],
        activeProfile: 'p1',
        nutrition: { logs: {}, customFoods: [] }
      }
    }
    const store = {
      getState: () => ({
        ...state,
        update: fn => fn(state.S)
      })
    }
    const loadStarterPlanFn = vi.fn(() => true)

    const res = applyGoalOnboarding(store, {
      goal: 'lean_bulk',
      experience: 'beginner',
      daysPerWeek: 4,
      sex: 'male',
      age: 24,
      heightCm: 172,
      weightKg: 62,
      targetWeightKg: 68,
      activityLevel: 'light'
    }, { loadStarterPlanFn, now: Date.UTC(2026, 4, 10), today: '2026-05-10' })

    expect(res.workoutPlanId).toBe('upper-lower')
    expect(res.mealTemplateId).toBe('plan_muscle_bulk')
    expect(state.S.sex).toBe('male')
    expect(state.S.birthYear).toBe(2026 - 24)
    expect(state.S.targetW).toBe(68)
    expect(state.S.bodyweight).toHaveLength(1)
    expect(state.S.bodyweight[0].w).toBe(62)
    expect(state.S.nutrition.profile.setupDone).toBe(true)
    expect(state.S.nutrition.profile.goal).toBe('lean_bulk')
    expect(state.S.nutrition.activePlanId).toBe('plan_muscle_bulk')
    expect(Object.keys(state.S.nutrition.logs)).toHaveLength(7)
    expect(state.S.starterSetupDone.workoutPlanId).toBe('upper-lower')
    expect(loadStarterPlanFn).toHaveBeenCalledWith('upper-lower', state.S.profiles[0])
  })
})
