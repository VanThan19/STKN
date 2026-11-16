import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { lastBW } from '../lib/history.js'
import { todayISO, uid } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import Icon from '../components/Icon.jsx'
import CardHead from '../components/CardHead.jsx'
import { Button, SearchField, Stepper, Segmented, Switch, TextField } from '../components/ui.jsx'
import {
  FOOD_CATEGORIES,
  ALLERGEN_LIST,
  BEGINNER_MEAL_COMBOS,
  STARTER_MEAL_PLANS
} from '../lib/foods-data.js'
import {
  MEAL_SLOTS,
  DEFAULT_NUTRITION_PROFILE,
  DEFAULT_MEAL_SCHEDULE,
  emptyNutrition,
  calculateMacroTargets,
  allFoods,
  findFood,
  buildItemsFromTemplate,
  applyDayItemsToRange,
  computeDayTotals,
  evaluateNutritionBalance,
  recommendFoods,
  nextScheduledMeal,
  buildMealReminderMessage,
  weeklyNutritionSummary
} from '../lib/nutrition.js'

const SLOT_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snacks & Shakes'
}

const SLOT_ICONS = {
  breakfast: 'sun',
  lunch: 'flame',
  dinner: 'moon',
  snack: 'bolt'
}

function shiftIsoDate(iso, deltaDays) {
  const ms = Date.parse(iso + 'T12:00:00Z') + deltaDays * 86400000
  return new Date(ms).toISOString().slice(0, 10)
}

export function triggerMealNotification(title, body) {
  const full = `${title} — ${body}`
  useUI.getState().toast(full)
  try {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (window.Notification.permission === 'granted') {
        new window.Notification(title, { body })
      } else if (window.Notification.permission !== 'denied') {
        window.Notification.requestPermission().then(p => {
          if (p === 'granted') new window.Notification(title, { body })
        }).catch(() => {})
      }
    }
  } catch { /* ignore notification errors in headless/test */ }
}

export default function Nutrition() {
  const nav = useNavigate()
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)
  const toast = msg => useUI.getState().toast(msg)

  const [dayIso, setDayIso] = useState(() => todayISO())
  const [activeSlot, setActiveSlot] = useState(null)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const [servings, setServings] = useState(1)
  const [beginnerOnly, setBeginnerOnly] = useState(true)
  const [showProfile, setShowProfile] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customDraft, setCustomDraft] = useState({
    name: '',
    servingLabel: '100 g',
    kcal: 200,
    protein: 20,
    carbs: 15,
    fat: 6,
    fiber: 2
  })

  const nut = S.nutrition || emptyNutrition()
  const profile = { ...DEFAULT_NUTRITION_PROFILE, ...(nut.profile || {}) }
  const schedule = {
    ...DEFAULT_MEAL_SCHEDULE,
    ...(nut.schedule || {}),
    times: { ...DEFAULT_MEAL_SCHEDULE.times, ...(nut.schedule?.times || {}) }
  }
  const customFoods = Array.isArray(nut.customFoods) ? nut.customFoods : []
  const dayLog = nut.logs?.[dayIso] || { items: [], waterMl: 0 }

  const latestWeightKg = useMemo(() => {
    const bw = lastBW(S)
    if (!bw || !bw.w) return 70
    return S.unit === 'lb' ? Math.round((bw.w / 2.20462) * 10) / 10 : bw.w
  }, [S])

  const targets = useMemo(
    () => calculateMacroTargets({ ...profile, weightKg: latestWeightKg, sex: profile.sex || S.body || 'male' }),
    [profile, latestWeightKg, S.body]
  )

  const totals = useMemo(() => computeDayTotals(dayLog, customFoods), [dayLog, customFoods])
  const balance = useMemo(() => evaluateNutritionBalance(totals, targets), [totals, targets])
  const recommendations = useMemo(
    () => recommendFoods({ totals, targets, profile, customFoods, beginnerOnly, limit: 5 }),
    [totals, targets, profile, customFoods, beginnerOnly]
  )
  const weekly = useMemo(
    () => weeklyNutritionSummary(nut.logs || {}, customFoods, dayIso, 7),
    [nut.logs, customFoods, dayIso]
  )

  const nowHHMM = useMemo(() => {
    const d = new Date()
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }, [])

  const upcomingMeal = useMemo(
    () => nextScheduledMeal(dayLog, schedule, customFoods, nowHHMM),
    [dayLog, schedule, customFoods, nowHHMM]
  )

  const filteredFoods = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allFoods(customFoods).filter(f => {
      if (cat !== 'all' && f.category !== cat) return false
      if (!q) return true
      return f.name.toLowerCase().includes(q) || (f.category || '').toLowerCase().includes(q)
    })
  }, [customFoods, cat, search])

  const mutateDay = fn => {
    update(s => {
      if (!s.nutrition) s.nutrition = emptyNutrition()
      if (!s.nutrition.logs) s.nutrition.logs = {}
      const cur = s.nutrition.logs[dayIso] || { items: [], waterMl: 0, _ts: 0 }
      const next = {
        items: Array.isArray(cur.items) ? [...cur.items] : [],
        waterMl: Number(cur.waterMl) || 0,
        _ts: Date.now()
      }
      fn(next, s.nutrition)
      s.nutrition.logs[dayIso] = next
    })
  }

  const addFoodToSlot = (food, slot = activeSlot || 'lunch', mult = servings) => {
    const m = Math.max(0.25, Math.min(10, Number(mult) || 1))
    mutateDay(d => {
      d.items.push({
        id: uid(),
        slot,
        foodId: food.id,
        name: food.name,
        servingLabel: food.servingLabel,
        servings: m,
        kcal: Math.round(food.kcal * m),
        protein: Math.round(food.protein * m * 10) / 10,
        carbs: Math.round(food.carbs * m * 10) / 10,
        fat: Math.round(food.fat * m * 10) / 10,
        fiber: Math.round((food.fiber || 0) * m * 10) / 10,
        eaten: false
      })
    })
    setActiveSlot(null)
    setSearch('')
    setServings(1)
  }

  const addBeginnerCombo = combo => {
    mutateDay(d => {
      for (const entry of combo.items) {
        const food = findFood(entry.foodId, customFoods)
        if (!food) continue
        const m = Number(entry.servings) || 1
        d.items.push({
          id: uid(),
          slot: combo.slot,
          foodId: food.id,
          name: food.name,
          servingLabel: food.servingLabel,
          servings: m,
          kcal: Math.round(food.kcal * m),
          protein: Math.round(food.protein * m * 10) / 10,
          carbs: Math.round(food.carbs * m * 10) / 10,
          fat: Math.round(food.fat * m * 10) / 10,
          fiber: Math.round((food.fiber || 0) * m * 10) / 10,
          eaten: false
        })
      }
    })
    toast(t('Added combo: {0}', t(combo.title)))
  }

  const handleApplyTemplate = (templateId, forWholeWeek = false) => {
    const items = buildItemsFromTemplate(templateId, customFoods, uid)
    if (!items.length) return
    update(s => {
      if (!s.nutrition) s.nutrition = emptyNutrition()
      if (!s.nutrition.logs) s.nutrition.logs = {}
      if (forWholeWeek) {
        s.nutrition.logs = applyDayItemsToRange(s.nutrition.logs, items, dayIso, 7, Date.now(), uid)
      } else {
        const cur = s.nutrition.logs[dayIso] || { items: [], waterMl: 0 }
        s.nutrition.logs[dayIso] = { ...cur, items, _ts: Date.now() }
      }
    })
    toast(forWholeWeek ? t('Applied meal plan for the next 7 days!') : t('Applied full-day meal plan!'))
    setShowTemplates(false)
  }

  const handleApplyCurrentDayToWeek = () => {
    if (!dayLog.items?.length) {
      toast(t('Please add meals to today first before applying to the week.'))
      return
    }
    update(s => {
      if (!s.nutrition) s.nutrition = emptyNutrition()
      s.nutrition.logs = applyDayItemsToRange(s.nutrition.logs || {}, dayLog.items, dayIso, 7, Date.now(), uid)
    })
    toast(t('Copied this day’s meal schedule to the next 7 days!'))
  }

  const handleCopyYesterday = () => {
    const yIso = shiftIsoDate(dayIso, -1)
    const yItems = nut.logs?.[yIso]?.items || []
    if (!yItems.length) {
      toast(t('No meals logged yesterday to copy.'))
      return
    }
    mutateDay(d => {
      d.items = yItems.map(it => ({ ...it, id: uid(), eaten: false }))
    })
    toast(t('Copied meals from yesterday!'))
  }

  const toggleSlotEaten = slot => {
    mutateDay(d => {
      const slotItems = d.items.filter(x => x.slot === slot)
      const nextState = !slotItems.every(x => x.eaten)
      d.items = d.items.map(x => (x.slot === slot ? { ...x, eaten: nextState } : x))
    })
  }

  const removeFoodItem = itemId => {
    mutateDay(d => {
      d.items = d.items.filter(x => x.id !== itemId)
    })
  }

  const adjustWater = deltaMl => {
    mutateDay(d => {
      d.waterMl = Math.max(0, (Number(d.waterMl) || 0) + deltaMl)
    })
  }

  const saveProfilePatch = patch => {
    update(s => {
      if (!s.nutrition) s.nutrition = emptyNutrition()
      s.nutrition.profile = {
        ...DEFAULT_NUTRITION_PROFILE,
        ...(s.nutrition.profile || {}),
        ...patch,
        _ts: Date.now()
      }
    })
  }

  const saveSchedulePatch = patch => {
    update(s => {
      if (!s.nutrition) s.nutrition = emptyNutrition()
      const cur = s.nutrition.schedule || DEFAULT_MEAL_SCHEDULE
      s.nutrition.schedule = {
        ...DEFAULT_MEAL_SCHEDULE,
        ...cur,
        ...patch,
        times: { ...DEFAULT_MEAL_SCHEDULE.times, ...(cur.times || {}), ...(patch.times || {}) },
        _ts: Date.now()
      }
    })
  }

  const handleConfirmSchedule = () => {
    saveSchedulePatch({ confirmed: true, confirmedAt: Date.now(), remindersOn: true })
    const targetSlot = upcomingMeal?.slot || 'breakfast'
    const msg = buildMealReminderMessage(targetSlot, dayLog, schedule, customFoods, t(SLOT_LABELS[targetSlot]))
    triggerMealNotification(t('Meal Schedule Activated!'), `${msg.title}: ${msg.body}`)
    setShowSchedule(false)
  }

  const handleTestReminder = slot => {
    const msg = buildMealReminderMessage(slot, dayLog, schedule, customFoods, t(SLOT_LABELS[slot]))
    triggerMealNotification(`🍽️ ${msg.title}`, msg.body)
  }

  const toggleAllergen = allergenId => {
    const cur = new Set(Array.isArray(profile.allergies) ? profile.allergies : [])
    if (cur.has(allergenId)) cur.delete(allergenId)
    else cur.add(allergenId)
    saveProfilePatch({ allergies: [...cur] })
  }

  const handleCreateCustomFood = e => {
    e.preventDefault()
    const name = customDraft.name.trim()
    if (!name) return
    const newFood = {
      id: 'cf_' + uid(),
      name,
      category: 'meals',
      servingLabel: customDraft.servingLabel.trim() || '100 g',
      grams: 100,
      kcal: Math.max(0, Math.round(Number(customDraft.kcal) || 0)),
      protein: Math.max(0, Math.round((Number(customDraft.protein) || 0) * 10) / 10),
      carbs: Math.max(0, Math.round((Number(customDraft.carbs) || 0) * 10) / 10),
      fat: Math.max(0, Math.round((Number(customDraft.fat) || 0) * 10) / 10),
      fiber: Math.max(0, Math.round((Number(customDraft.fiber) || 0) * 10) / 10),
      allergens: [],
      tags: ['custom', 'beginner_friendly']
    }
    update(s => {
      if (!s.nutrition) s.nutrition = emptyNutrition()
      if (!Array.isArray(s.nutrition.customFoods)) s.nutrition.customFoods = []
      s.nutrition.customFoods.unshift(newFood)
    })
    setCustomDraft({ name: '', servingLabel: '100 g', kcal: 200, protein: 20, carbs: 15, fat: 6, fiber: 2 })
    setShowCustomForm(false)
    if (activeSlot) addFoodToSlot(newFood, activeSlot, 1)
  }

  return (
    <div className="narrow">
      <div className="hdr">
        <div className="row" style={{ gap: 8 }}>
          <button className="iconbtn" onClick={() => nav('/home')} aria-label={t('Back')}>
            <Icon name="chevronLeft" />
          </button>
          <div>
            <h1>{t('Nutrition & Macros')}</h1>
            <div className="sub">
              {t('TDEE')} {targets.tdee} kcal · {t('BMR')} {targets.bmr} kcal ({latestWeightKg} kg)
            </div>
          </div>
        </div>
        <div className="row" style={{ gap: 6 }}>
          <Button size="sm" variant="tinted" icon="bell" onClick={() => setShowSchedule(v => !v)}>
            {schedule.confirmed ? t('Reminders On') : t('Schedule')}
          </Button>
          <Button size="sm" variant="ghost" icon="sliders" onClick={() => setShowProfile(v => !v)}>
            {t('Targets')}
          </Button>
        </div>
      </div>

      {/* Confirmed Meal Schedule Active Reminder Banner */}
      {schedule.confirmed && upcomingMeal && (
        <div className="card" data-testid="active-meal-reminder-banner" style={{ border: '1px solid var(--acc-soft)' }}>
          <div className="row between" style={{ gap: 10 }}>
            <div className="row" style={{ gap: 10, minWidth: 0 }}>
              <span className="lrow-i" style={{ background: upcomingMeal.allDoneToday ? 'var(--green)' : 'var(--acc)', color: 'var(--on-acc)' }}>
                <Icon name={upcomingMeal.allDoneToday ? 'checkCircle' : 'bell'} />
              </span>
              <div style={{ minWidth: 0 }}>
                <div className="small" style={{ color: 'var(--acc-ink)', fontWeight: 600 }}>
                  {upcomingMeal.allDoneToday
                    ? t('All scheduled meals completed today!')
                    : `${t('Next Meal Reminder')}: ${t(SLOT_LABELS[upcomingMeal.slot])} (${upcomingMeal.time})`}
                </div>
                <div className="small muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {upcomingMeal.items.map(x => x.name).join(' + ')} ({upcomingMeal.kcal} kcal · {upcomingMeal.protein}g P)
                </div>
              </div>
            </div>
            {!upcomingMeal.allDoneToday && (
              <Button size="sm" variant="primary" onClick={() => toggleSlotEaten(upcomingMeal.slot)}>
                {t('Mark eaten')}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Date Bar + Multi-Day Quick Actions */}
      <div className="card" style={{ padding: '10px 14px' }}>
        <div className="row between">
          <button className="iconbtn" onClick={() => setDayIso(d => shiftIsoDate(d, -1))} aria-label={t('Previous day')}>
            <Icon name="chevronLeft" />
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600 }}>{dayIso === todayISO() ? t('Today') : dayIso}</div>
            <div className="small muted">{dayIso}</div>
          </div>
          <button className="iconbtn" onClick={() => setDayIso(d => shiftIsoDate(d, 1))} aria-label={t('Next day')}>
            <Icon name="chevronRight" />
          </button>
        </div>
        <div className="chips" style={{ marginTop: 8, paddingBottom: 0 }}>
          <button type="button" className={'chip ichip' + (showTemplates ? ' on' : '')} onClick={() => setShowTemplates(v => !v)}>
            <Icon name="sparkles" />
            <span>{t('1-Tap Meal Templates')}</span>
          </button>
          <button type="button" className="chip ichip" onClick={handleApplyCurrentDayToWeek} data-testid="apply-week-btn">
            <Icon name="calendar" />
            <span>{t('Apply Today to Whole Week (7 Days)')}</span>
          </button>
          <button type="button" className="chip ichip" onClick={handleCopyYesterday}>
            <Icon name="clipboard" />
            <span>{t('Copy Yesterday')}</span>
          </button>
        </div>
      </div>

      {/* 1-Tap Full-Day Meal Plan Templates & Beginner Guide */}
      {showTemplates && (
        <div className="card" data-testid="starter-templates-card">
          <CardHead
            icon="sparkles"
            tint="var(--acc)"
            title={t('Beginner & 1-Tap Full-Day Meal Plans')}
            sub={t('No need to set meals one by one every day. Pick a template and apply it for today or the whole week.')}
          />
          <div className="list" style={{ marginTop: 8 }}>
            {STARTER_MEAL_PLANS.map(tpl => (
              <div key={tpl.id} style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 12 }}>
                <div style={{ fontWeight: 600 }}>{t(tpl.name)}</div>
                <div className="small muted" style={{ marginTop: 2 }}>{t(tpl.desc)}</div>
                <div className="row" style={{ gap: 8, marginTop: 10 }}>
                  <Button size="sm" variant="tinted" onClick={() => handleApplyTemplate(tpl.id, false)}>
                    {t('Use for Today')}
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => handleApplyTemplate(tpl.id, true)} data-testid={`apply-week-${tpl.id}`}>
                    {t('Apply for 7 Days')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meal Schedule & Reminder Settings Card */}
      {showSchedule && (
        <div className="card" data-testid="meal-schedule-card">
          <CardHead
            icon="bell"
            tint="var(--orange)"
            title={t('Meal Schedule & Notifications')}
            sub={t('Set your meal times and confirm to receive reminders for what to eat at Breakfast, Lunch, Snack & Dinner.')}
          />
          <div style={{ marginTop: 6 }}>
            {['breakfast', 'lunch', 'snack', 'dinner'].map(slot => (
              <div key={slot} className="lrow">
                <span className="lrow-i" style={{ background: 'var(--surface-2)' }}>
                  <Icon name={SLOT_ICONS[slot]} />
                </span>
                <div className="lrow-m">
                  <div className="lrow-t">{t(SLOT_LABELS[slot])}</div>
                  <div className="lrow-s">
                    {(totals.bySlot[slot]?.items || []).length
                      ? totals.bySlot[slot].items.map(x => x.name).join(', ')
                      : t('No food set yet')}
                  </div>
                </div>
                <input
                  type="time"
                  className="timef"
                  value={schedule.times[slot] || DEFAULT_MEAL_SCHEDULE.times[slot]}
                  onChange={e => saveSchedulePatch({ times: { [slot]: e.target.value } })}
                />
                <Button size="xs" variant="ghost" onClick={() => handleTestReminder(slot)} data-testid={`test-reminder-${slot}`}>
                  {t('Test')}
                </Button>
              </div>
            ))}
            <div className="lrow">
              <div className="lrow-m">
                <div className="lrow-t">{t('Enable Meal Reminders')}</div>
                <div className="lrow-s">{t('Show banner & notification at each scheduled meal time')}</div>
              </div>
              <Switch
                checked={schedule.remindersOn !== false}
                onChange={v => saveSchedulePatch({ remindersOn: v })}
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" icon="checkCircle" onClick={handleConfirmSchedule} data-testid="confirm-schedule-btn">
              {t('Confirm & Activate Meal Schedule')}
            </Button>
          </div>
        </div>
      )}

      {/* TDEE & Macro Calculator Profile Setup (Refined with Native Stepper & Segmented) */}
      {showProfile && (
        <div className="card" data-testid="nutrition-profile-card">
          <CardHead
            icon="target"
            tint="var(--acc)"
            title={t('Macro & TDEE Calculator (Mifflin-St Jeor)')}
            sub={t('Beginners: simply choose your goal below and we calculate safe international targets automatically.')}
          />

          <div style={{ marginTop: 8 }}>
            <div className="small muted" style={{ marginBottom: 6 }}>{t('Biological Sex')}</div>
            <Segmented
              options={[
                { value: 'male', label: t('Male') },
                { value: 'female', label: t('Female') }
              ]}
              value={profile.sex || 'male'}
              onChange={sex => saveProfilePatch({ sex })}
            />
          </div>

          <div className="row" style={{ gap: 10, marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <Stepper
                label={t('Height (cm)')}
                value={profile.heightCm}
                min={120}
                max={230}
                step={1}
                decimal={false}
                unit="cm"
                onChange={heightCm => saveProfilePatch({ heightCm })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Stepper
                label={t('Age')}
                value={profile.age}
                min={14}
                max={100}
                step={1}
                decimal={false}
                onChange={age => saveProfilePatch({ age })}
              />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="small muted" style={{ marginBottom: 6 }}>{t('Nutrition Goal')}</div>
            <div className="chips" style={{ paddingInline: 0 }}>
              {[
                { id: 'cut', label: t('Fat Loss / Cut (-500 kcal)') },
                { id: 'gentle_cut', label: t('Gentle Cut (-300 kcal)') },
                { id: 'maintain', label: t('Maintenance (TDEE)') },
                { id: 'lean_bulk', label: t('Lean Bulk (+250 kcal)') },
                { id: 'bulk', label: t('Muscle Gain / Bulk (+450 kcal)') }
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  className={'chip' + (profile.goal === g.id ? ' on' : '')}
                  onClick={() => saveProfilePatch({ goal: g.id })}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <div className="small muted" style={{ marginBottom: 6 }}>{t('Activity level')}</div>
            <div className="chips" style={{ paddingInline: 0 }}>
              {[
                { id: 'sedentary', label: t('Sedentary (1.2x)') },
                { id: 'light', label: t('Lightly active (1.375x)') },
                { id: 'moderate', label: t('Moderately active (1.55x)') },
                { id: 'active', label: t('Very active (1.725x)') },
                { id: 'athlete', label: t('Athlete (1.9x)') }
              ].map(a => (
                <button
                  key={a.id}
                  type="button"
                  className={'chip' + (profile.activityLevel === a.id ? ' on' : '')}
                  onClick={() => saveProfilePatch({ activityLevel: a.id })}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <div className="small muted" style={{ marginBottom: 6 }}>{t('Allergies & Dietary Exclusions')}</div>
            <div className="chips" style={{ paddingInline: 0 }}>
              {ALLERGEN_LIST.map(a => {
                const active = (profile.allergies || []).includes(a.id)
                return (
                  <button
                    key={a.id}
                    type="button"
                    className={'chip' + (active ? ' on' : '')}
                    onClick={() => toggleAllergen(a.id)}
                  >
                    {t(a.label)}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Daily Calories & International Macro Targets Card */}
      <div className="card" data-testid="nutrition-summary-card">
        <div className="row between" style={{ alignItems: 'baseline', marginBottom: 10 }}>
          <div>
            <div className="small muted">{t('Calories')}</div>
            <div className="big">
              {totals.kcal} <span className="muted" style={{ fontSize: 'var(--fs-callout)' }}>/ {targets.kcal} kcal</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="tag" style={{ background: balance.remaining.kcal >= 0 ? 'var(--surface-3)' : 'color-mix(in srgb,var(--orange) 20%,transparent)' }}>
              {balance.remaining.kcal >= 0
                ? `${balance.remaining.kcal} kcal ${t('left')}`
                : `${Math.abs(balance.remaining.kcal)} kcal ${t('over')}`}
            </span>
          </div>
        </div>

        {/* Macro Progress Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 8 }}>
          <div style={{ background: 'var(--surface-2)', padding: 10, borderRadius: 10 }}>
            <div className="row between small">
              <span style={{ fontWeight: 600 }}>{t('Protein')}</span>
              <span className="muted">{totals.protein} / {targets.protein} g ({balance.split.proteinPct}%)</span>
            </div>
            <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}>
              <div style={{ width: `${balance.progressPct.protein}%`, height: '100%', background: 'var(--acc)' }} />
            </div>
          </div>

          <div style={{ background: 'var(--surface-2)', padding: 10, borderRadius: 10 }}>
            <div className="row between small">
              <span style={{ fontWeight: 600 }}>{t('Carbs')}</span>
              <span className="muted">{totals.carbs} / {targets.carbs} g ({balance.split.carbsPct}%)</span>
            </div>
            <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}>
              <div style={{ width: `${balance.progressPct.carbs}%`, height: '100%', background: 'var(--blue)' }} />
            </div>
          </div>

          <div style={{ background: 'var(--surface-2)', padding: 10, borderRadius: 10 }}>
            <div className="row between small">
              <span style={{ fontWeight: 600 }}>{t('Fat')}</span>
              <span className="muted">{totals.fat} / {targets.fat} g ({balance.split.fatPct}%)</span>
            </div>
            <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}>
              <div style={{ width: `${balance.progressPct.fat}%`, height: '100%', background: 'var(--orange)' }} />
            </div>
          </div>

          <div style={{ background: 'var(--surface-2)', padding: 10, borderRadius: 10 }}>
            <div className="row between small">
              <span style={{ fontWeight: 600 }}>{t('Fiber')}</span>
              <span className="muted">{totals.fiber} / {targets.fiber} g</span>
            </div>
            <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}>
              <div style={{ width: `${balance.progressPct.fiber}%`, height: '100%', background: 'var(--green)' }} />
            </div>
          </div>
        </div>

        {/* Water Hydration Row */}
        <div className="row between" style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--surface-3)' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{t('Hydration')}</div>
            <div className="small muted">{totals.waterMl} / {targets.waterMl} ml</div>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <Button size="sm" variant="ghost" onClick={() => adjustWater(-250)}>-250 ml</Button>
            <Button size="sm" variant="tinted" icon="plus" onClick={() => adjustWater(250)}>250 ml</Button>
          </div>
        </div>
      </div>

      {/* Professional Food Picker Panel (SearchField + Stepper + Chips + Beginner Combos) */}
      {activeSlot && (
        <div className="card" data-testid="food-picker-card">
          <div className="row between" style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 600 }}>
              {t('Add to')} {t(SLOT_LABELS[activeSlot])}
            </div>
            <div className="row" style={{ gap: 6 }}>
              <Button size="sm" variant="ghost" onClick={() => setShowCustomForm(v => !v)}>
                {t('Custom food')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setActiveSlot(null)}>
                {t('Cancel')}
              </Button>
            </div>
          </div>

          {showCustomForm ? (
            <form onSubmit={handleCreateCustomFood} style={{ display: 'grid', gap: 10, marginTop: 6 }}>
              <TextField
                placeholder={t('Food name (e.g. Homemade Protein Bowl)')}
                value={customDraft.name}
                onChange={e => setCustomDraft(d => ({ ...d, name: e.target.value }))}
                required
              />
              <div className="row" style={{ gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <TextField
                    placeholder={t('Serving size (e.g. 100 g)')}
                    value={customDraft.servingLabel}
                    onChange={e => setCustomDraft(d => ({ ...d, servingLabel: e.target.value }))}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Stepper
                    value={customDraft.kcal}
                    min={0}
                    max={3000}
                    step={10}
                    decimal={false}
                    unit="kcal"
                    onChange={kcal => setCustomDraft(d => ({ ...d, kcal }))}
                  />
                </div>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <Stepper
                    label="Protein"
                    value={customDraft.protein}
                    min={0}
                    max={200}
                    step={1}
                    unit="g"
                    onChange={protein => setCustomDraft(d => ({ ...d, protein }))}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Stepper
                    label="Carbs"
                    value={customDraft.carbs}
                    min={0}
                    max={300}
                    step={1}
                    unit="g"
                    onChange={carbs => setCustomDraft(d => ({ ...d, carbs }))}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Stepper
                    label="Fat"
                    value={customDraft.fat}
                    min={0}
                    max={150}
                    step={1}
                    unit="g"
                    onChange={fat => setCustomDraft(d => ({ ...d, fat }))}
                  />
                </div>
              </div>
              <Button type="submit" variant="primary">{t('Save & Add Food')}</Button>
            </form>
          ) : (
            <>
              <SearchField
                placeholder={t('Search USDA & fitness foods (e.g. Chicken, Oats, Whey, Salmon)...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClear={() => setSearch('')}
              />

              <div className="chips" style={{ marginTop: 8, paddingInline: 0 }}>
                {FOOD_CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    className={'chip' + (cat === c.id ? ' on' : '')}
                    onClick={() => setCat(c.id)}
                  >
                    {t(c.label)}
                  </button>
                ))}
              </div>

              <div className="row between" style={{ margin: '8px 0 10px' }}>
                <span className="small muted">{t('Servings multiplier')}</span>
                <div style={{ width: 150 }}>
                  <Stepper
                    value={servings}
                    min={0.25}
                    max={10}
                    step={0.25}
                    unit="×"
                    onChange={setServings}
                  />
                </div>
              </div>

              {/* Beginner Combos for this meal slot */}
              {BEGINNER_MEAL_COMBOS.filter(c => c.slot === activeSlot).length > 0 && !search && (
                <div style={{ marginBottom: 10 }}>
                  <div className="small muted" style={{ marginBottom: 6 }}>{t('Beginner Easy Combos (1-Tap)')}</div>
                  {BEGINNER_MEAL_COMBOS.filter(c => c.slot === activeSlot).map(combo => (
                    <div
                      key={combo.id}
                      className="lrow"
                      style={{ background: 'var(--surface-2)', borderRadius: 10, paddingInline: 10, marginBottom: 6 }}
                    >
                      <div className="lrow-m">
                        <div className="lrow-t" style={{ fontWeight: 600 }}>{t(combo.title)}</div>
                        <div className="lrow-s">{t(combo.desc)}</div>
                      </div>
                      <Button size="sm" variant="primary" onClick={() => { addBeginnerCombo(combo); setActiveSlot(null) }}>
                        {t('Use Combo')}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {filteredFoods.map(f => (
                  <div key={f.id} className="lrow">
                    <div className="lrow-m">
                      <div className="lrow-t">{f.name}</div>
                      <div className="lrow-s">
                        {f.servingLabel} · {Math.round(f.kcal * servings)} kcal · P {Math.round(f.protein * servings)}g · C {Math.round(f.carbs * servings)}g · F {Math.round(f.fat * servings)}g
                      </div>
                    </div>
                    <Button size="sm" variant="tinted" icon="plus" onClick={() => addFoodToSlot(f, activeSlot, servings)}>
                      {t('Add')}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 4 Meal Slots Diary */}
      {MEAL_SLOTS.map(slot => {
        const slotData = totals.bySlot[slot] || { kcal: 0, protein: 0, carbs: 0, fat: 0, items: [], allEaten: false }
        return (
          <div key={slot} className="card" data-testid={`meal-card-${slot}`}>
            <div className="row between" style={{ marginBottom: slotData.items.length ? 8 : 0 }}>
              <div className="row" style={{ gap: 10 }}>
                <span
                  className="lrow-i"
                  style={{
                    background: slotData.allEaten ? 'var(--green)' : 'var(--surface-2)',
                    color: slotData.allEaten ? '#000' : 'var(--label)'
                  }}
                >
                  <Icon name={slotData.allEaten ? 'checkCircle' : SLOT_ICONS[slot]} />
                </span>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {t(SLOT_LABELS[slot])} <span className="small muted">({schedule.times[slot]})</span>
                  </div>
                  <div className="small muted">
                    {slotData.kcal} kcal · P {slotData.protein}g · C {slotData.carbs}g · F {slotData.fat}g
                  </div>
                </div>
              </div>
              <div className="row" style={{ gap: 6 }}>
                {slotData.items.length > 0 && (
                  <Button
                    size="xs"
                    variant={slotData.allEaten ? 'tinted' : 'ghost'}
                    onClick={() => toggleSlotEaten(slot)}
                  >
                    {slotData.allEaten ? t('Eaten') : t('Mark eaten')}
                  </Button>
                )}
                <Button size="sm" variant="ghost" icon="plus" onClick={() => setActiveSlot(slot)}>
                  {t('Add food')}
                </Button>
              </div>
            </div>

            {slotData.items.length > 0 && (
              <div style={{ marginTop: 4 }}>
                {slotData.items.map(it => (
                  <div key={it.id} className="lrow" style={{ opacity: it.eaten ? 0.65 : 1 }}>
                    <div className="lrow-m">
                      <div className="lrow-t">
                        {it.name} {it.servings !== 1 ? `(${it.servings}×)` : ''}
                      </div>
                      <div className="lrow-s">
                        {it.servingLabel} · {it.kcal} kcal · P {it.protein}g · C {it.carbs}g · F {it.fat}g
                      </div>
                    </div>
                    <button
                      className="iconbtn"
                      onClick={() => removeFoodItem(it.id)}
                      aria-label={t('Delete')}
                      style={{ width: 28, height: 28 }}
                    >
                      <Icon name="trash" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Beginner & Macro-Aware Food Recommendations */}
      <div className="card" data-testid="nutrition-recommendations-card">
        <CardHead
          icon="sparkles"
          tint="var(--green)"
          title={t('Recommended Foods for Your Remaining Macros')}
          sub={t('Easy-to-eat international foods matched to your remaining Protein, Carbs & Fat.')}
          action={
            <button
              type="button"
              className={'chip' + (beginnerOnly ? ' on' : '')}
              onClick={() => setBeginnerOnly(v => !v)}
            >
              {t('Beginner Easy')}
            </button>
          }
        />
        <div style={{ marginTop: 4 }}>
          {recommendations.map(f => (
            <div key={f.id} className="lrow">
              <div className="lrow-m">
                <div className="lrow-t">{f.name}</div>
                <div className="lrow-s">
                  {f.servingLabel} · {f.kcal} kcal · P {f.protein}g · C {f.carbs}g · F {f.fat}g
                </div>
              </div>
              <Button size="sm" variant="tinted" icon="plus" onClick={() => addFoodToSlot(f, 'snack', 1)}>
                {t('Log')}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Nutrition Overview */}
      <div className="card">
        <CardHead
          icon="chart"
          tint="var(--teal)"
          title={t('7-Day Nutrition Average')}
          sub={`${weekly.loggedDays} / 7 ${t('days logged')} · ${t('Confirm your schedule above to get daily meal reminders.')}`}
        />
        <div className="row between small" style={{ marginTop: 8 }}>
          <div><strong>{weekly.avgKcal}</strong> kcal/d</div>
          <div><strong>P:</strong> {weekly.avgProtein} g</div>
          <div><strong>C:</strong> {weekly.avgCarbs} g</div>
          <div><strong>F:</strong> {weekly.avgFat} g</div>
          <div><strong>H2O:</strong> {weekly.avgWaterMl} ml</div>
        </div>
      </div>
    </div>
  )
}
