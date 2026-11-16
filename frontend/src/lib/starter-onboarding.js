import { uid, todayISO } from './format.js'
import {
  DEFAULT_NUTRITION_PROFILE,
  calculateMacroTargets,
  buildItemsFromTemplate,
  applyDayItemsToRange
} from './nutrition.js'

export const ONBOARDING_GOALS = [
  { id: 'cut', emoji: '🔥', labelKey: 'Fat Loss', descKey: 'Burn fat fast with high protein and a calorie deficit.' },
  { id: 'gentle_cut', emoji: '🌿', labelKey: 'Gentle Cut', descKey: 'Slim down steadily while keeping strength and energy.' },
  { id: 'maintain', emoji: '⚖️', labelKey: 'Maintain & Health', descKey: 'Build fitness habits, energy, and balanced nutrition.' },
  { id: 'lean_bulk', emoji: '💪', labelKey: 'Lean Muscle', descKey: 'Gain lean muscle with minimal fat gain.' },
  { id: 'bulk', emoji: '🏋️', labelKey: 'Bulk & Strength', descKey: 'Maximize weight gain, strength, and training volume.' }
]

export const ONBOARDING_EXPERIENCE = [
  { id: 'beginner', labelKey: 'New to gym', descKey: '0–6 months' },
  { id: 'returning', labelKey: 'Returning', descKey: 'Trained before' },
  { id: 'intermediate', labelKey: 'Regular', descKey: '6+ months' }
]

export const ONBOARDING_ACTIVITY = [
  { id: 'sedentary', labelKey: 'Sedentary (desk job)' },
  { id: 'light', labelKey: 'Light (1–3 days/wk)' },
  { id: 'moderate', labelKey: 'Moderate (3–5 days/wk)' },
  { id: 'active', labelKey: 'Active (6–7 days/wk)' }
]

export const DEFAULT_ONBOARDING_FORM = {
  goal: 'maintain',
  experience: 'beginner',
  daysPerWeek: 3,
  sex: 'male',
  age: 24,
  heightCm: 170,
  weightKg: 65,
  targetWeightKg: 65,
  activityLevel: 'light'
}

const clamp = (val, min, max, fallback) => {
  const n = Number(val)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

export function normalizeOnboardingForm(raw = {}) {
  const goal = ONBOARDING_GOALS.some(g => g.id === raw.goal) ? raw.goal : DEFAULT_ONBOARDING_FORM.goal
  const experience = ONBOARDING_EXPERIENCE.some(e => e.id === raw.experience) ? raw.experience : DEFAULT_ONBOARDING_FORM.experience
  const activityLevel = ONBOARDING_ACTIVITY.some(a => a.id === raw.activityLevel) ? raw.activityLevel : DEFAULT_ONBOARDING_FORM.activityLevel
  const sex = raw.sex === 'female' ? 'female' : 'male'
  const age = Math.round(clamp(raw.age, 13, 85, DEFAULT_ONBOARDING_FORM.age))
  const heightCm = Math.round(clamp(raw.heightCm, 120, 230, DEFAULT_ONBOARDING_FORM.heightCm))
  const weightKg = Number(clamp(raw.weightKg, 30, 250, DEFAULT_ONBOARDING_FORM.weightKg).toFixed(1))
  const targetWeightKg = raw.targetWeightKg === '' || raw.targetWeightKg == null
    ? weightKg
    : Number(clamp(raw.targetWeightKg, 30, 250, weightKg).toFixed(1))
  const daysPerWeek = Math.round(clamp(raw.daysPerWeek, 2, 6, DEFAULT_ONBOARDING_FORM.daysPerWeek))
  return { goal, experience, daysPerWeek, sex, age, heightCm, weightKg, targetWeightKg, activityLevel }
}

export function recommendPlanForProfile({ goal, experience, daysPerWeek }) {
  let workoutPlanId = 'full-body'
  if (daysPerWeek >= 4 && experience !== 'beginner') {
    workoutPlanId = 'upper-lower'
  } else if (daysPerWeek >= 4) {
    workoutPlanId = 'upper-lower'
  } else if (goal === 'bulk' && experience === 'intermediate') {
    workoutPlanId = '5x5'
  } else if ((goal === 'lean_bulk' || goal === 'bulk') && experience === 'intermediate') {
    workoutPlanId = 'ppl'
  }

  let mealTemplateId = 'plan_beginner_balanced'
  if (goal === 'cut' || goal === 'gentle_cut') {
    mealTemplateId = 'plan_fat_loss_cut'
  } else if (goal === 'lean_bulk' || goal === 'bulk') {
    mealTemplateId = 'plan_muscle_bulk'
  }

  return { workoutPlanId, mealTemplateId }
}

export function computeOnboardingPreview(rawForm) {
  const form = normalizeOnboardingForm(rawForm)
  const heightM = form.heightCm / 100
  const bmi = Number((form.weightKg / (heightM * heightM)).toFixed(1))
  const bmiCategory = bmi < 18.5 ? 'underweight' : bmi < 23 ? 'normal' : bmi < 25 ? 'overweight' : 'obese'

  const targets = calculateMacroTargets({
    ...DEFAULT_NUTRITION_PROFILE,
    weightKg: form.weightKg,
    heightCm: form.heightCm,
    age: form.age,
    sex: form.sex,
    activityLevel: form.activityLevel,
    goal: form.goal
  })

  const { workoutPlanId, mealTemplateId } = recommendPlanForProfile(form)
  return { form, bmi, bmiCategory, targets, workoutPlanId, mealTemplateId }
}

export function needsGoalOnboarding(S) {
  if (!S || S.starterSetupDone) return false
  const hasRoutines = Array.isArray(S.routines) && S.routines.length > 0
  const hasWorkouts = Array.isArray(S.workouts) && S.workouts.length > 0
  return !hasRoutines && !hasWorkouts
}

export function applyGoalOnboarding(store, rawForm, { loadStarterPlanFn, now = Date.now(), today = todayISO() } = {}) {
  const preview = computeOnboardingPreview(rawForm)
  const { form, workoutPlanId, mealTemplateId } = preview
  const birthYear = new Date(now).getFullYear() - form.age

  store.getState().update(st => {
    st.sex = form.sex
    st.birthYear = birthYear
    st.targetW = form.targetWeightKg

    const bwList = Array.isArray(st.bodyweight) ? [...st.bodyweight] : []
    const existingIdx = bwList.findIndex(x => x.date === today)
    if (existingIdx >= 0) {
      bwList[existingIdx] = { ...bwList[existingIdx], w: form.weightKg }
    } else {
      bwList.push({ id: uid(), date: today, w: form.weightKg })
    }
    st.bodyweight = bwList

    const prevNut = st.nutrition || {}
    const customFoods = Array.isArray(prevNut.customFoods) ? prevNut.customFoods : []
    const templateItems = buildItemsFromTemplate(mealTemplateId, customFoods, uid)
    const nextLogs = applyDayItemsToRange(prevNut.logs || {}, templateItems, today, 7, now, uid)

    st.nutrition = {
      ...prevNut,
      profile: {
        ...DEFAULT_NUTRITION_PROFILE,
        ...(prevNut.profile || {}),
        weightKg: form.weightKg,
        heightCm: form.heightCm,
        age: form.age,
        sex: form.sex,
        activityLevel: form.activityLevel,
        goal: form.goal,
        setupDone: true
      },
      reminders: prevNut.reminders || {},
      logs: nextLogs,
      activePlanId: mealTemplateId
    }

    st.starterSetupDone = {
      at: now,
      goal: form.goal,
      experience: form.experience,
      daysPerWeek: form.daysPerWeek,
      weightKg: form.weightKg,
      heightCm: form.heightCm,
      age: form.age,
      sex: form.sex,
      workoutPlanId,
      mealTemplateId
    }
  })

  if (typeof loadStarterPlanFn === 'function') {
    const profile = store.getState().S.profiles?.find(p => p.id === store.getState().S.activeProfile)
    loadStarterPlanFn(workoutPlanId, profile)
  }

  return preview
}
