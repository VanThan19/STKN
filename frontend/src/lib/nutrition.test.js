import { describe, it, expect } from 'vitest'
import {
  calculateBMR,
  calculateTDEE,
  calculateMacroTargets,
  buildItemsFromTemplate,
  applyDayItemsToRange,
  applyAiNutritionPlan,
  computeDayTotals,
  evaluateNutritionBalance,
  recommendFoods,
  nextScheduledMeal,
  buildMealReminderMessage,
  weeklyNutritionSummary
} from './nutrition.js'

describe('nutrition domain logic (international standard)', () => {
  it('calculates Mifflin-St Jeor BMR and TDEE accurately for male and female profiles', () => {
    const maleBmr = calculateBMR({ weightKg: 70, heightCm: 175, age: 25, sex: 'male' })
    expect(maleBmr).toBe(1674)

    const femaleBmr = calculateBMR({ weightKg: 70, heightCm: 175, age: 25, sex: 'female' })
    expect(femaleBmr).toBe(1508)

    const tdee = calculateTDEE({ weightKg: 70, heightCm: 175, age: 25, sex: 'male', activityLevel: 'moderate' })
    expect(tdee).toBe(Math.round(1674 * 1.55))
  })

  it('enforces safe calorie floors and high-protein targets during a cut', () => {
    const cutTargets = calculateMacroTargets({
      weightKg: 50,
      heightCm: 155,
      age: 30,
      sex: 'female',
      activityLevel: 'sedentary',
      goal: 'cut'
    })
    expect(cutTargets.kcal).toBeGreaterThanOrEqual(1200)
    expect(cutTargets.protein).toBe(100)
  })

  it('builds full-day items from a starter template and applies them across 7 days', () => {
    const items = buildItemsFromTemplate('plan_beginner_balanced')
    expect(items.length).toBeGreaterThanOrEqual(8)
    const tot = computeDayTotals({ items })
    expect(tot.bySlot.breakfast.items.length).toBeGreaterThan(0)
    expect(tot.bySlot.lunch.items.length).toBeGreaterThan(0)
    expect(tot.bySlot.dinner.items.length).toBeGreaterThan(0)
    expect(tot.bySlot.snack.items.length).toBeGreaterThan(0)

    const weekLogs = applyDayItemsToRange({}, items, '2026-11-16', 7)
    expect(Object.keys(weekLogs).length).toBe(7)
    expect(weekLogs['2026-11-16'].items.length).toBe(items.length)
    expect(weekLogs['2026-11-22'].items.length).toBe(items.length)
  })

  it('computes upcoming scheduled meal and formats reminder notification message', () => {
    const items = buildItemsFromTemplate('plan_beginner_balanced')
    const dayLog = { items, waterMl: 1000 }
    const schedule = {
      confirmed: true,
      remindersOn: true,
      times: { breakfast: '07:30', lunch: '12:00', snack: '16:00', dinner: '19:00' }
    }
    const nextAt10am = nextScheduledMeal(dayLog, schedule, [], '10:00')
    expect(nextAt10am.slot).toBe('lunch')
    expect(nextAt10am.time).toBe('12:00')

    const msg = buildMealReminderMessage('breakfast', dayLog, schedule, [], 'Breakfast')
    expect(msg.title).toContain('07:30')
    expect(msg.body).toContain('Rolled Oats')
  })

  it('evaluates macro balance, filters beginner foods, and aggregates 7-day summary', () => {
    const targets = { kcal: 2200, protein: 160, carbs: 220, fat: 70, fiber: 30 }
    const totals = { kcal: 1200, protein: 70, carbs: 160, fat: 45, fiber: 15 }
    const balance = evaluateNutritionBalance(totals, targets)
    expect(balance.remaining.protein).toBe(90)

    const recs = recommendFoods({
      totals,
      targets,
      profile: { allergies: ['fish', 'dairy'], dislikedFoods: ['f_shrimp'] },
      beginnerOnly: true,
      limit: 5
    })
    expect(recs.length).toBeGreaterThan(0)
    expect(recs.every(f => f.tags.includes('beginner_friendly'))).toBe(true)

    const logs = {
      '2026-11-15': { waterMl: 2000, items: [{ id: 'a', slot: 'lunch', foodId: 'f_chicken_rice_bowl', servings: 1 }] },
      '2026-11-16': { waterMl: 2500, items: [{ id: 'b', slot: 'dinner', foodId: 'f_salmon_quinoa_bowl', servings: 1 }] }
    }
    const summary = weeklyNutritionSummary(logs, [], '2026-11-16', 7)
    expect(summary.loggedDays).toBe(2)
    expect(summary.avgKcal).toBe(Math.round((465 + 540) / 2))
  })

  it('applies AI-generated nutritionPlan to profile, 7-day logs, and activates reminders', () => {
    const s = {}
    const aiPlan = {
      goal: 'cut',
      targetCalories: 1850,
      targetProtein: 160,
      targetCarbs: 175,
      targetFat: 55,
      meals: [
        { slot: 'breakfast', name: 'Oats & Whey', servingLabel: '1 bowl', servings: 1, kcal: 420, protein: 35, carbs: 50, fat: 8, fiber: 5 },
        { slot: 'lunch', name: 'Chicken Breast & Rice', servingLabel: '1 plate', servings: 1, kcal: 550, protein: 50, carbs: 65, fat: 9, fiber: 4 }
      ]
    }
    expect(applyAiNutritionPlan(s, aiPlan, { forWholeWeek: true, startIso: '2026-11-16' })).toBe(true)
    expect(s.nutrition.profile.goal).toBe('cut')
    expect(s.nutrition.profile.targetCalories).toBe(1850)
    expect(s.nutrition.schedule.confirmed).toBe(true)
    expect(Object.keys(s.nutrition.logs).length).toBe(7)
    expect(s.nutrition.logs['2026-11-16'].items.length).toBe(2)
  })
})
