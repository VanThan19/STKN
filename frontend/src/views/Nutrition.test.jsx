// @vitest-environment happy-dom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/api.js', async importOriginal => ({
  ...(await importOriginal()),
  api: vi.fn(() => Promise.reject(new Error('offline'))),
  beacon: vi.fn()
}))

import { DEF, useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import Nutrition from './Nutrition.jsx'

const clone = v => JSON.parse(JSON.stringify(v))
const mounted = []

function render(el) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  mounted.push(root)
  act(() => root.render(<MemoryRouter initialEntries={['/nutrition']}>{el}</MemoryRouter>))
  return host
}

describe('Nutrition view (beginner templates, 7-day apply, and meal reminders)', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    useStore.setState({ S: clone(DEF), user: { id: 'u1', name: 'vietfit' }, ready: true })
  })

  afterEach(() => {
    while (mounted.length) {
      const r = mounted.pop()
      act(() => r.unmount())
    }
    document.body.innerHTML = ''
  })

  it('logs a food item, applies a 1-tap full-day template to 7 days, and confirms meal schedule reminders', () => {
    const host = render(<Nutrition />)

    expect(host.querySelector('[data-testid="nutrition-summary-card"]')).toBeTruthy()

    // 1. Open 1-Tap Meal Templates and apply Beginner Balanced plan for 7 days
    const chips = [...host.querySelectorAll('.chip')]
    const tplChip = chips.find(b => /1-Tap|Thực đơn mẫu/i.test(b.textContent))
    act(() => tplChip.click())

    const tplCard = host.querySelector('[data-testid="starter-templates-card"]')
    expect(tplCard).toBeTruthy()

    const apply7DaysBtn = host.querySelector('[data-testid="apply-week-plan_beginner_balanced"]')
    act(() => apply7DaysBtn.click())

    const SAfterPlan = useStore.getState().S
    expect(Object.keys(SAfterPlan.nutrition?.logs || {}).length).toBe(7)

    // 2. Open Schedule settings and confirm meal schedule reminders
    const hdrBtns = [...host.querySelectorAll('.hdr button')]
    const scheduleBtn = hdrBtns.find(b => /Schedule|Lịch nhắc/i.test(b.textContent))
    act(() => scheduleBtn.click())

    const scheduleCard = host.querySelector('[data-testid="meal-schedule-card"]')
    expect(scheduleCard).toBeTruthy()

    const confirmBtn = host.querySelector('[data-testid="confirm-schedule-btn"]')
    act(() => confirmBtn.click())

    const SAfterConfirm = useStore.getState().S
    expect(SAfterConfirm.nutrition?.schedule?.confirmed).toBe(true)
    expect(host.querySelector('[data-testid="active-meal-reminder-banner"]')).toBeTruthy()
    expect(useUI.getState().toastMsg).toBeTruthy()
  })
})
