// Pure domain helpers for the Cross-Domain Adaptive Engine (Phase 3).
// Connects Workout Schedule, Muscle Recovery, Day Notes & Nutrition Adherence
// with a strict User Approval + Undo Snapshot workflow (never mutates plans silently).

import { calculateMacroTargets, computeDayTotals, DEFAULT_NUTRITION_PROFILE } from './nutrition.js'

const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0] // Mon..Sun

function asRoutineList(v) {
  if (!v) return []
  return Array.isArray(v) ? v.filter(Boolean) : [v]
}

/**
 * Evaluates cross-domain training readiness (0-100) by combining:
 *   1. Recent training frequency (last 3 days)
 *   2. Nutrition energy & protein intake (today & yesterday)
 *   3. Day notes (sick / tired / rest notes)
 */
export function crossDomainReadiness(S, todayIso) {
  const iso = todayIso || new Date().toISOString().slice(0, 10)
  const ms = Date.parse(iso + 'T12:00:00Z')
  const prevIso = new Date(ms - 86400000).toISOString().slice(0, 10)
  const from3Iso = new Date(ms - 3 * 86400000).toISOString().slice(0, 10)

  let score = 90
  const signals = []

  // 1. Recent workout density (last 72h)
  const recentWorkouts = (Array.isArray(S?.workouts) ? S.workouts : []).filter(
    w => w && typeof w.d === 'string' && w.d >= from3Iso && w.d <= iso
  )
  if (recentWorkouts.length >= 3) {
    score -= 20
    signals.push('High training density (3+ workouts in 72h)')
  } else if (recentWorkouts.length === 2) {
    score -= 8
  }

  // 2. Nutrition fuel check (yesterday or today)
  const nut = S?.nutrition
  if (nut?.logs) {
    const profile = { ...DEFAULT_NUTRITION_PROFILE, ...(nut.profile || {}) }
    const latestBw = Array.isArray(S?.bodyweight) && S.bodyweight.length ? S.bodyweight.at(-1).w : 70
    const targets = calculateMacroTargets({ ...profile, weightKg: latestBw })
    const yLog = nut.logs[prevIso]
    const tLog = nut.logs[iso]
    const activeLog = (yLog?.items?.length ? yLog : null) || (tLog?.items?.length ? tLog : null)

    if (activeLog) {
      const tot = computeDayTotals(activeLog, nut.customFoods || [])
      const kcalRatio = tot.kcal / Math.max(1, targets.kcal)
      const proRatio = tot.protein / Math.max(1, targets.protein)
      if (kcalRatio < 0.7) {
        score -= 18
        signals.push(`Low energy intake (${tot.kcal}/${targets.kcal} kcal)`)
      }
      if (proRatio < 0.7) {
        score -= 12
        signals.push(`Low protein recovery (${tot.protein}/${targets.protein}g Protein)`)
      }
    }
  }

  // 3. Day notes signal
  const note = S?.dayNotes?.[iso] || S?.dayNotes?.[prevIso]
  if (note && (note.tag === 'sick' || note.tag === 'injury')) {
    score -= 30
    signals.push(`Logged ${note.tag} note`)
  }

  score = Math.max(25, Math.min(100, score))
  const status = score >= 80 ? 'optimal' : score >= 60 ? 'moderate_fatigue' : 'low_recovery'
  const suggestedVolumeFactor = status === 'optimal' ? 1.0 : status === 'moderate_fatigue' ? 0.85 : 0.75

  const recommendation =
    status === 'optimal'
      ? 'Recovery and nutrition are on track. Proceed with full planned volume and progressive overload.'
      : status === 'moderate_fatigue'
        ? 'Moderate fatigue or mild calorie deficit detected. Consider keeping 1-2 reps in reserve (RIR 2) today.'
        : 'Low recovery / energy deficit detected. Consider reducing work sets by ~20% or swapping to a lighter session.'

  return {
    score,
    status,
    suggestedVolumeFactor,
    signals,
    recommendation
  }
}

/**
 * Generates an adaptive schedule proposal when the user marks specific weekdays (`busyDays`) as unavailable.
 * Never mutates `S`; returns a previewable proposal waiting for User Approval.
 */
export function proposeScheduleAdaptation(S, { busyDays = [], todayIso } = {}) {
  const busySet = new Set((busyDays || []).map(Number).filter(d => d >= 0 && d <= 6))
  const week = S?.week || {}
  const routinesById = new Map((Array.isArray(S?.routines) ? S.routines : []).map(r => [r.id, r]))
  const proposedWeek = {}

  for (const d of WEEKDAYS) {
    const ids = asRoutineList(week[d]).filter(id => routinesById.has(id))
    if (ids.length && !busySet.has(d)) proposedWeek[d] = [...ids]
  }

  const displaced = []
  for (const d of WEEKDAYS) {
    if (!busySet.has(d)) continue
    const ids = asRoutineList(week[d]).filter(id => routinesById.has(id))
    for (const id of ids) {
      displaced.push({ fromDay: d, routineId: id, routineName: routinesById.get(id)?.name || id })
    }
  }

  const changes = []
  const availableDays = WEEKDAYS.filter(d => !busySet.has(d))

  for (const item of displaced) {
    // Prefer an available day that currently has 0 routines, else the day with the fewest routines
    const emptyDay = availableDays.find(d => !(proposedWeek[d]?.length))
    if (emptyDay !== undefined) {
      proposedWeek[emptyDay] = [item.routineId]
      changes.push({
        type: 'shift_day',
        routineId: item.routineId,
        routineName: item.routineName,
        fromDay: item.fromDay,
        toDay: emptyDay,
        reason: 'Moved from busy day to an open recovery day to preserve weekly volume.'
      })
    } else if (availableDays.length > 0) {
      const lightestDay = [...availableDays].sort(
        (a, b) => (proposedWeek[a]?.length || 0) - (proposedWeek[b]?.length || 0)
      )[0]
      proposedWeek[lightestDay] = [...(proposedWeek[lightestDay] || []), item.routineId]
      changes.push({
        type: 'combine_day',
        routineId: item.routineId,
        routineName: item.routineName,
        fromDay: item.fromDay,
        toDay: lightestDay,
        reason: 'Combined onto your lightest available training day so no session is lost.'
      })
    }
  }

  const readiness = crossDomainReadiness(S, todayIso)
  return {
    id: 'adapt_' + Date.now(),
    busyDays: [...busySet],
    changes,
    proposedWeek,
    readiness,
    summary: changes.length
      ? `Adapted ${changes.length} session(s) around ${busySet.size} busy day(s).`
      : 'No planned sessions fell on the selected busy days.'
  }
}

/**
 * Applies a user-approved schedule proposal onto draft state `s` and records an Undo snapshot.
 */
export function applyApprovedSchedule(s, proposal) {
  if (!s || !proposal || !proposal.proposedWeek) return false
  if (!Array.isArray(s.adaptiveSnapshots)) s.adaptiveSnapshots = []
  s.adaptiveSnapshots.unshift({
    id: proposal.id || 'snap_' + Date.now(),
    at: Date.now(),
    previousWeek: JSON.parse(JSON.stringify(s.week || {})),
    summary: proposal.summary || ''
  })
  s.adaptiveSnapshots = s.adaptiveSnapshots.slice(0, 5)
  s.week = JSON.parse(JSON.stringify(proposal.proposedWeek))
  return true
}

/**
 * Reverts the most recent adaptive schedule change from `s.adaptiveSnapshots`.
 */
export function undoLastScheduleAdaptation(s) {
  if (!s || !Array.isArray(s.adaptiveSnapshots) || !s.adaptiveSnapshots.length) return false
  const last = s.adaptiveSnapshots.shift()
  if (last && last.previousWeek) {
    s.week = JSON.parse(JSON.stringify(last.previousWeek))
    return true
  }
  return false
}
