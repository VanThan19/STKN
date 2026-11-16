// Pure domain helpers for the international-standard Nutrition Management module.
// Paired with frontend/src/lib/nutrition.test.js (see CLAUDE.md).

import { FOODS_DB, STARTER_MEAL_PLANS } from './foods-data.js'

export const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snack']

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9
}

export const GOAL_ADJUSTMENTS = {
  cut: -500,
  gentle_cut: -300,
  maintain: 0,
  lean_bulk: 250,
  bulk: 450
}

export const DEFAULT_NUTRITION_PROFILE = {
  heightCm: 170,
  age: 26,
  sex: 'male',
  activityLevel: 'moderate',
  goal: 'maintain',
  mealsPerDay: 4,
  customTargets: false,
  targetCalories: null,
  targetProtein: null,
  targetCarbs: null,
  targetFat: null,
  targetWaterMl: 2500,
  allergies: [],
  dietTags: [],
  dislikedFoods: [],
  favFoods: [],
  _ts: 0
}

export const DEFAULT_MEAL_SCHEDULE = {
  confirmed: false,
  confirmedAt: null,
  remindersOn: true,
  times: {
    breakfast: '07:30',
    lunch: '12:00',
    snack: '16:00',
    dinner: '19:00'
  },
  lastNotified: {},
  _ts: 0
}

export const emptyNutrition = () => ({
  profile: { ...DEFAULT_NUTRITION_PROFILE },
  schedule: { ...DEFAULT_MEAL_SCHEDULE, times: { ...DEFAULT_MEAL_SCHEDULE.times }, lastNotified: {} },
  customFoods: [],
  logs: {}
})

/**
 * Mifflin-St Jeor BMR equation (international standard):
 *   Male:   10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
 *   Female: 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
 */
export function calculateBMR({ weightKg = 70, heightCm = 170, age = 26, sex = 'male' } = {}) {
  const w = Math.max(30, Math.min(250, Number(weightKg) || 70))
  const h = Math.max(120, Math.min(230, Number(heightCm) || 170))
  const a = Math.max(14, Math.min(100, Number(age) || 26))
  const offset = sex === 'female' ? -161 : 5
  return Math.round(10 * w + 6.25 * h - 5 * a + offset)
}

export function calculateTDEE({ weightKg = 70, heightCm = 170, age = 26, sex = 'male', activityLevel = 'moderate' } = {}) {
  const bmr = calculateBMR({ weightKg, heightCm, age, sex })
  const mult = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderate
  return Math.round(bmr * mult)
}

/**
 * Computes international evidence-based macro targets (ISSN / ACSM guidelines) with safety floors:
 *   - Calories never drop below 1200 kcal (female) or 1500 kcal (male).
 *   - Protein: 2.0 g/kg during deficit ('cut'/'gentle_cut') to preserve lean mass, 1.8 g/kg otherwise.
 *   - Fat: 0.9 g/kg (minimum 20% of total kcal).
 *   - Carbs: remaining calories / 4 (minimum 50g).
 *   - Fiber: 14g per 1000 kcal (clamped 25–38g).
 */
export function calculateMacroTargets(params = {}) {
  const weightKg = Math.max(35, Math.min(250, Number(params.weightKg) || 70))
  const sex = params.sex === 'female' ? 'female' : 'male'
  const goal = GOAL_ADJUSTMENTS[params.goal] !== undefined ? params.goal : 'maintain'
  const bmr = calculateBMR({ ...params, weightKg, sex })
  const tdee = calculateTDEE({ ...params, weightKg, sex })
  const floor = sex === 'female' ? 1200 : 1500

  if (params.customTargets && Number(params.targetCalories) >= floor) {
    const kcal = Math.round(Number(params.targetCalories))
    const protein = Math.max(40, Math.round(Number(params.targetProtein) || weightKg * 1.8))
    const fat = Math.max(30, Math.round(Number(params.targetFat) || weightKg * 0.9))
    const carbs = Math.max(50, Math.round(Number(params.targetCarbs) || (kcal - protein * 4 - fat * 9) / 4))
    return {
      bmr,
      tdee,
      kcal,
      protein,
      carbs,
      fat,
      fiber: Math.min(38, Math.max(25, Math.round((kcal / 1000) * 14))),
      waterMl: Math.max(1500, Math.round(Number(params.targetWaterMl) || weightKg * 35))
    }
  }

  const rawKcal = tdee + (GOAL_ADJUSTMENTS[goal] || 0)
  const kcal = Math.max(floor, Math.round(rawKcal))
  const proteinPerKg = goal === 'cut' || goal === 'gentle_cut' ? 2.0 : 1.8
  const protein = Math.round(weightKg * proteinPerKg)
  const fatFromWeight = Math.round(weightKg * 0.9)
  const fatMinFromKcal = Math.round((kcal * 0.2) / 9)
  const fat = Math.max(fatFromWeight, fatMinFromKcal)
  const remainingKcal = Math.max(200, kcal - protein * 4 - fat * 9)
  const carbs = Math.round(remainingKcal / 4)
  const fiber = Math.min(38, Math.max(25, Math.round((kcal / 1000) * 14)))
  const waterMl = Math.max(1500, Math.round(Number(params.targetWaterMl) || weightKg * 35))

  return { bmr, tdee, kcal, protein, carbs, fat, fiber, waterMl }
}

export function allFoods(customFoods = []) {
  const custom = Array.isArray(customFoods)
    ? customFoods.filter(f => f && typeof f.id === 'string' && typeof f.name === 'string')
    : []
  return [...custom, ...FOODS_DB]
}

export function findFood(foodId, customFoods = []) {
  if (!foodId) return null
  return allFoods(customFoods).find(f => f.id === foodId) || null
}

export function round1(n) {
  return Math.round((Number(n) || 0) * 10) / 10
}

/**
 * Builds resolved log items from a starter meal plan template ID (`STARTER_MEAL_PLANS`).
 */
export function buildItemsFromTemplate(templateId, customFoods = [], idGen = () => Math.random().toString(36).slice(2, 10)) {
  const tpl = STARTER_MEAL_PLANS.find(p => p.id === templateId)
  if (!tpl) return []
  const items = []
  for (const slot of MEAL_SLOTS) {
    const entries = Array.isArray(tpl.meals?.[slot]) ? tpl.meals[slot] : []
    for (const entry of entries) {
      const food = findFood(entry.foodId, customFoods)
      if (!food) continue
      const m = Math.max(0.1, Number(entry.servings) || 1)
      items.push({
        id: idGen(),
        slot,
        foodId: food.id,
        name: food.name,
        servingLabel: food.servingLabel,
        servings: m,
        kcal: Math.round(food.kcal * m),
        protein: round1(food.protein * m),
        carbs: round1(food.carbs * m),
        fat: round1(food.fat * m),
        fiber: round1((food.fiber || 0) * m),
        eaten: false
      })
    }
  }
  return items
}

/**
 * Copies a source day's meal items across `daysCount` consecutive days starting at `startIso`.
 * Solves repetitive daily setup: configure 1 day, apply to the whole week in 1 tap.
 */
export function applyDayItemsToRange(logs = {}, sourceItems = [], startIso, daysCount = 7, now = Date.now(), idGen = () => Math.random().toString(36).slice(2, 10)) {
  const nextLogs = { ...logs }
  const startMs = Date.parse(startIso + 'T12:00:00Z')
  const DAY = 86400000
  for (let i = 0; i < daysCount; i++) {
    const iso = new Date(startMs + i * DAY).toISOString().slice(0, 10)
    const existing = nextLogs[iso] || { items: [], waterMl: 0, _ts: 0 }
    nextLogs[iso] = {
      ...existing,
      items: sourceItems.map(it => ({
        ...it,
        id: i === 0 && it.id ? it.id : `${idGen()}_${i}`,
        eaten: i === 0 ? !!it.eaten : false
      })),
      _ts: now + i
    }
  }
  return nextLogs
}

/**
 * Applies an AI-generated `nutritionPlan` proposal (macros + meal items) onto draft state `s`
 * after the user approves it in CoachChat.
 */
export function applyAiNutritionPlan(s, nutritionPlan, { forWholeWeek = false, startIso, idGen = () => Math.random().toString(36).slice(2, 10) } = {}) {
  if (!s || !nutritionPlan || typeof nutritionPlan !== 'object') return false
  if (!s.nutrition) s.nutrition = emptyNutrition()
  const now = Date.now()
  const iso = startIso || new Date(now).toISOString().slice(0, 10)

  // 1. Update nutrition profile & macro targets if proposed by AI
  const curProf = { ...DEFAULT_NUTRITION_PROFILE, ...(s.nutrition.profile || {}) }
  if (nutritionPlan.goal && GOAL_ADJUSTMENTS[nutritionPlan.goal] !== undefined) {
    curProf.goal = nutritionPlan.goal
  }
  if (Number(nutritionPlan.targetCalories) >= 1200) {
    curProf.customTargets = true
    curProf.targetCalories = Math.round(Number(nutritionPlan.targetCalories))
    if (Number(nutritionPlan.targetProtein) > 0) curProf.targetProtein = Math.round(Number(nutritionPlan.targetProtein))
    if (Number(nutritionPlan.targetCarbs) > 0) curProf.targetCarbs = Math.round(Number(nutritionPlan.targetCarbs))
    if (Number(nutritionPlan.targetFat) > 0) curProf.targetFat = Math.round(Number(nutritionPlan.targetFat))
  }
  curProf._ts = now
  s.nutrition.profile = curProf

  // 2. Build meal items from AI proposal
  const rawMeals = Array.isArray(nutritionPlan.meals) ? nutritionPlan.meals : []
  if (rawMeals.length > 0) {
    const items = rawMeals.map(m => ({
      id: idGen(),
      slot: MEAL_SLOTS.includes(m.slot) ? m.slot : 'snack',
      foodId: m.foodId || 'ai_' + idGen(),
      name: String(m.name || 'AI Meal'),
      servingLabel: String(m.servingLabel || '1 serving'),
      servings: Number(m.servings) || 1,
      kcal: Math.round(Number(m.kcal) || 0),
      protein: round1(m.protein),
      carbs: round1(m.carbs),
      fat: round1(m.fat),
      fiber: round1(m.fiber),
      eaten: false
    }))

    if (!s.nutrition.logs) s.nutrition.logs = {}
    if (forWholeWeek) {
      s.nutrition.logs = applyDayItemsToRange(s.nutrition.logs, items, iso, 7, now, idGen)
      s.nutrition.schedule = {
        ...DEFAULT_MEAL_SCHEDULE,
        ...(s.nutrition.schedule || {}),
        confirmed: true,
        confirmedAt: now,
        remindersOn: true,
        _ts: now
      }
    } else {
      const curDay = s.nutrition.logs[iso] || { items: [], waterMl: 0 }
      s.nutrition.logs[iso] = { ...curDay, items, _ts: now }
    }
  }
  return true
}

/**
 * Computes daily and per-meal macro totals from a day's log entry (`S.nutrition.logs[iso]`).
 */
export function computeDayTotals(dayLog, customFoods = []) {
  const bySlot = {}
  for (const s of MEAL_SLOTS) {
    bySlot[s] = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, items: [], allEaten: false }
  }
  const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, waterMl: Number(dayLog?.waterMl) || 0, bySlot }
  const items = Array.isArray(dayLog?.items) ? dayLog.items : []

  for (const item of items) {
    if (!item || typeof item !== 'object') continue
    const slot = MEAL_SLOTS.includes(item.slot) ? item.slot : 'snack'
    const mult = Math.max(0.1, Math.min(20, Number(item.servings) || 1))
    const ref = findFood(item.foodId, customFoods)

    const kcal = Math.round((item.kcal != null ? Number(item.kcal) : (ref?.kcal || 0) * mult))
    const protein = round1(item.protein != null ? Number(item.protein) : (ref?.protein || 0) * mult)
    const carbs = round1(item.carbs != null ? Number(item.carbs) : (ref?.carbs || 0) * mult)
    const fat = round1(item.fat != null ? Number(item.fat) : (ref?.fat || 0) * mult)
    const fiber = round1(item.fiber != null ? Number(item.fiber) : (ref?.fiber || 0) * mult)

    const resolved = {
      id: item.id,
      slot,
      foodId: item.foodId,
      name: item.name || ref?.name || 'Food item',
      servingLabel: item.servingLabel || ref?.servingLabel || '1 serving',
      servings: mult,
      kcal,
      protein,
      carbs,
      fat,
      fiber,
      eaten: !!item.eaten
    }

    bySlot[slot].items.push(resolved)
    bySlot[slot].kcal += kcal
    bySlot[slot].protein = round1(bySlot[slot].protein + protein)
    bySlot[slot].carbs = round1(bySlot[slot].carbs + carbs)
    bySlot[slot].fat = round1(bySlot[slot].fat + fat)
    bySlot[slot].fiber = round1(bySlot[slot].fiber + fiber)

    totals.kcal += kcal
    totals.protein = round1(totals.protein + protein)
    totals.carbs = round1(totals.carbs + carbs)
    totals.fat = round1(totals.fat + fat)
    totals.fiber = round1(totals.fiber + fiber)
  }

  for (const s of MEAL_SLOTS) {
    bySlot[s].allEaten = bySlot[s].items.length > 0 && bySlot[s].items.every(x => x.eaten)
  }

  return totals
}

/**
 * Evaluates macro adherence, remaining budget, and macro energy distribution (%).
 */
export function evaluateNutritionBalance(totals, targets) {
  const tKcal = Math.max(1, Number(targets?.kcal) || 2000)
  const tPro = Math.max(1, Number(targets?.protein) || 140)
  const tCarb = Math.max(1, Number(targets?.carbs) || 200)
  const tFat = Math.max(1, Number(targets?.fat) || 65)
  const tFib = Math.max(1, Number(targets?.fiber) || 28)

  const remKcal = Math.round(tKcal - (totals?.kcal || 0))
  const remProtein = round1(tPro - (totals?.protein || 0))
  const remCarbs = round1(tCarb - (totals?.carbs || 0))
  const remFat = round1(tFat - (totals?.fat || 0))

  const proKcal = (totals?.protein || 0) * 4
  const carbKcal = (totals?.carbs || 0) * 4
  const fatKcal = (totals?.fat || 0) * 9
  const macroEnergy = Math.max(1, proKcal + carbKcal + fatKcal)

  const split = {
    proteinPct: Math.round((proKcal / macroEnergy) * 100),
    carbsPct: Math.round((carbKcal / macroEnergy) * 100),
    fatPct: Math.round((fatKcal / macroEnergy) * 100)
  }

  const kcalRatio = (totals?.kcal || 0) / tKcal
  const status = kcalRatio < 0.85 ? 'under' : kcalRatio <= 1.1 ? 'on_track' : 'over'

  return {
    remaining: { kcal: remKcal, protein: remProtein, carbs: remCarbs, fat: remFat },
    progressPct: {
      kcal: Math.min(100, Math.round(kcalRatio * 100)),
      protein: Math.min(100, Math.round(((totals?.protein || 0) / tPro) * 100)),
      carbs: Math.min(100, Math.round(((totals?.carbs || 0) / tCarb) * 100)),
      fat: Math.min(100, Math.round(((totals?.fat || 0) / tFat) * 100)),
      fiber: Math.min(100, Math.round(((totals?.fiber || 0) / tFib) * 100))
    },
    split,
    status
  }
}

/**
 * Recommends foods from the catalogue that best fill the user's remaining macro gaps
 * while strictly respecting allergens and disliked foods.
 * When `beginnerOnly` is true, prioritizes easy-to-prepare `beginner_friendly` items.
 */
export function recommendFoods({ totals, targets, profile, customFoods = [], beginnerOnly = false, limit = 6 } = {}) {
  const evalRes = evaluateNutritionBalance(totals || {}, targets || {})
  const remP = Math.max(0, evalRes.remaining.protein)
  const remC = Math.max(0, evalRes.remaining.carbs)
  const remF = Math.max(0, evalRes.remaining.fat)
  const remKcal = Math.max(100, evalRes.remaining.kcal)

  const allergies = new Set(Array.isArray(profile?.allergies) ? profile.allergies : [])
  const disliked = new Set(Array.isArray(profile?.dislikedFoods) ? profile.dislikedFoods : [])
  const favs = new Set(Array.isArray(profile?.favFoods) ? profile.favFoods : [])

  const candidates = allFoods(customFoods).filter(f => {
    if (disliked.has(f.id)) return false
    if (Array.isArray(f.allergens) && f.allergens.some(a => allergies.has(a))) return false
    if (beginnerOnly && Array.isArray(f.tags) && !f.tags.includes('beginner_friendly')) return false
    if (f.kcal > remKcal + 150) return false
    return true
  })

  const scored = candidates.map(f => {
    let score = 0
    if (remP > 15) score += (f.protein / Math.max(1, f.kcal)) * 400
    if (remC > 25) score += (f.carbs / Math.max(1, f.kcal)) * 200
    if (remF > 10 && remP <= 15 && remC <= 25) score += (f.fat / Math.max(1, f.kcal)) * 180
    score += (f.fiber || 0) * 1.5
    if (Array.isArray(f.tags) && f.tags.includes('beginner_friendly')) score += 10
    if (favs.has(f.id)) score += 15
    return { food: f, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.food)
}

/**
 * Finds the next or currently due meal from the user's confirmed meal schedule (`schedule.times`).
 */
export function nextScheduledMeal(dayLog, schedule = DEFAULT_MEAL_SCHEDULE, customFoods = [], nowHHMM = '08:00') {
  const times = { ...DEFAULT_MEAL_SCHEDULE.times, ...(schedule?.times || {}) }
  const totals = computeDayTotals(dayLog, customFoods)
  const ordered = ['breakfast', 'lunch', 'snack', 'dinner']
    .map(slot => ({
      slot,
      time: times[slot] || DEFAULT_MEAL_SCHEDULE.times[slot],
      ...totals.bySlot[slot]
    }))
    .filter(m => m.items.length > 0)
    .sort((a, b) => a.time.localeCompare(b.time))

  if (!ordered.length) return null
  const pending = ordered.filter(m => !m.allEaten)
  if (!pending.length) return { ...ordered[ordered.length - 1], allDoneToday: true }

  const upcoming = pending.find(m => m.time >= nowHHMM) || pending[0]
  return { ...upcoming, allDoneToday: false }
}

/**
 * Formats a concise notification message for a scheduled meal slot (Breakfast, Lunch, Snack, Dinner).
 */
export function buildMealReminderMessage(slot, dayLog, schedule = DEFAULT_MEAL_SCHEDULE, customFoods = [], slotTitle = slot) {
  const times = { ...DEFAULT_MEAL_SCHEDULE.times, ...(schedule?.times || {}) }
  const time = times[slot] || '08:00'
  const totals = computeDayTotals(dayLog, customFoods)
  const meal = totals.bySlot[slot]
  if (!meal || !meal.items.length) {
    return {
      title: `${slotTitle} (${time})`,
      body: `Time for ${slotTitle}! Open VietFit to log or pick a beginner combo.`
    }
  }
  const names = meal.items.map(x => (x.servings !== 1 ? `${x.name} (${x.servings}×)` : x.name)).join(' + ')
  return {
    title: `${slotTitle} (${time}) · ${meal.kcal} kcal · ${meal.protein}g Protein`,
    body: names
  }
}

/**
 * Summarizes the last `days` of nutrition logs for dashboard analytics and AI Coach context.
 */
export function weeklyNutritionSummary(logs = {}, customFoods = [], endDateIso, days = 7) {
  const endMs = endDateIso ? Date.parse(endDateIso + 'T12:00:00Z') : Date.now()
  const DAY = 86400000
  let loggedDays = 0
  let sumKcal = 0, sumP = 0, sumC = 0, sumF = 0, sumFib = 0, sumWater = 0
  const series = []

  for (let i = days - 1; i >= 0; i--) {
    const iso = new Date(endMs - i * DAY).toISOString().slice(0, 10)
    const dayLog = logs?.[iso]
    const tot = computeDayTotals(dayLog, customFoods)
    const hasEntries = (dayLog?.items && dayLog.items.length > 0) || tot.kcal > 0
    if (hasEntries) {
      loggedDays++
      sumKcal += tot.kcal
      sumP += tot.protein
      sumC += tot.carbs
      sumF += tot.fat
      sumFib += tot.fiber
      sumWater += tot.waterMl
    }
    series.push({ d: iso, kcal: tot.kcal, protein: tot.protein, carbs: tot.carbs, fat: tot.fat, waterMl: tot.waterMl })
  }

  const div = Math.max(1, loggedDays)
  return {
    days,
    loggedDays,
    avgKcal: loggedDays ? Math.round(sumKcal / div) : 0,
    avgProtein: loggedDays ? round1(sumP / div) : 0,
    avgCarbs: loggedDays ? round1(sumC / div) : 0,
    avgFat: loggedDays ? round1(sumF / div) : 0,
    avgFiber: loggedDays ? round1(sumFib / div) : 0,
    avgWaterMl: loggedDays ? Math.round(sumWater / div) : 0,
    series
  }
}
