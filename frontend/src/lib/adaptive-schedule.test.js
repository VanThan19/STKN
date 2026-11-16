import { describe, it, expect } from 'vitest'
import {
  crossDomainReadiness,
  proposeScheduleAdaptation,
  applyApprovedSchedule,
  undoLastScheduleAdaptation
} from './adaptive-schedule.js'

describe('Cross-domain Adaptive Engine (Phase 3)', () => {
  it('computes readiness score from workout density, nutrition intake, and day notes', () => {
    const stateOptimal = {
      workouts: [{ id: 'w1', d: '2026-11-15', entries: [] }],
      bodyweight: [{ d: '2026-11-16', w: 70 }],
      nutrition: {
        profile: { heightCm: 175, age: 25, sex: 'male', activityLevel: 'moderate', goal: 'maintain' },
        logs: {
          '2026-11-15': {
            items: [{ id: '1', slot: 'lunch', foodId: 'f_chicken_rice_bowl', kcal: 2400, protein: 150, carbs: 250, fat: 70 }]
          }
        }
      }
    }
    const r1 = crossDomainReadiness(stateOptimal, '2026-11-16')
    expect(r1.status).toBe('optimal')
    expect(r1.score).toBeGreaterThanOrEqual(80)

    const stateLowFuel = {
      workouts: [
        { id: 'w1', d: '2026-11-14', entries: [] },
        { id: 'w2', d: '2026-11-15', entries: [] },
        { id: 'w3', d: '2026-11-16', entries: [] }
      ],
      bodyweight: [{ d: '2026-11-16', w: 70 }],
      nutrition: {
        profile: { heightCm: 175, age: 25, sex: 'male', activityLevel: 'moderate', goal: 'maintain' },
        logs: {
          '2026-11-15': {
            items: [{ id: '1', slot: 'lunch', foodId: 'f_apple', kcal: 800, protein: 40, carbs: 100, fat: 20 }]
          }
        }
      }
    }
    const r2 = crossDomainReadiness(stateLowFuel, '2026-11-16')
    expect(r2.score).toBeLessThan(70)
    expect(r2.signals.length).toBeGreaterThanOrEqual(2)
  })

  it('proposes shifting or combining sessions around busy days and supports 1-tap apply + undo', () => {
    const S = {
      routines: [
        { id: 'r_push', name: 'Push Day', ex: [] },
        { id: 'r_pull', name: 'Pull Day', ex: [] },
        { id: 'r_legs', name: 'Leg Day', ex: [] }
      ],
      week: { 1: ['r_push'], 3: ['r_pull'], 5: ['r_legs'] }
    }

    // Mark Monday (1) as busy -> should shift r_push to an open day (Tuesday=2)
    const proposal = proposeScheduleAdaptation(S, { busyDays: [1], todayIso: '2026-11-16' })
    expect(proposal.changes.length).toBe(1)
    expect(proposal.changes[0].routineId).toBe('r_push')
    expect(proposal.changes[0].fromDay).toBe(1)
    expect(proposal.proposedWeek[1]).toBeUndefined()
    expect(proposal.proposedWeek[proposal.changes[0].toDay]).toContain('r_push')

    // Apply only after approval, keeping a snapshot
    const draft = JSON.parse(JSON.stringify(S))
    expect(applyApprovedSchedule(draft, proposal)).toBe(true)
    expect(draft.week[1]).toBeUndefined()
    expect(draft.adaptiveSnapshots.length).toBe(1)

    // Undo restores exact original week
    expect(undoLastScheduleAdaptation(draft)).toBe(true)
    expect(draft.week[1]).toEqual(['r_push'])
  })
})
