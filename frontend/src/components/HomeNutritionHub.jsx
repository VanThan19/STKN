import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { todayISO, uid } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import CardHead from './CardHead.jsx'
import { Button } from './ui.jsx'
import {
  DEFAULT_MEAL_SCHEDULE,
  emptyNutrition,
  buildItemsFromTemplate,
  applyDayItemsToRange,
  computeDayTotals,
  nextScheduledMeal
} from '../lib/nutrition.js'

const SLOT_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snacks & Shakes',
  dinner: 'Dinner'
}

const SLOT_ICONS = {
  breakfast: 'sun',
  lunch: 'flame',
  snack: 'bolt',
  dinner: 'moon'
}

const PROMO_BANNERS = [
  {
    id: 'promo_nutrition_plan',
    badge: 'VIETFIT NUTRITION PRO',
    title: '1-Tap 7-Day International Meal Plan',
    sub: 'Auto-calculate BMR, TDEE & Macros (USDA). Set your whole week and get Breakfast, Lunch & Dinner reminders!',
    cta: 'Set Up Meal Schedule',
    path: '/nutrition',
    gradient: 'linear-gradient(135deg, rgba(163,230,53,0.22) 0%, rgba(16,185,129,0.14) 100%)',
    accentColor: 'var(--acc-ink)',
    icon: 'sparkles'
  },
  {
    id: 'promo_whey_combo',
    badge: 'FITNESS PARTNER SPOTLIGHT',
    title: 'Whey Isolate & High-Protein Combos',
    sub: 'Hit 2.0g Protein/kg effortlessly with beginner-friendly post-workout shakes, oats & lean meat combos.',
    cta: 'Explore Protein Combos',
    path: '/nutrition',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.24) 0%, rgba(99,102,241,0.14) 100%)',
    accentColor: 'var(--blue)',
    icon: 'bolt'
  },
  {
    id: 'promo_anatomy_library',
    badge: 'SMART TRAINING SYSTEM',
    title: '5,600+ Exercises & 3D Muscle Recovery',
    sub: 'Interactive anatomical muscle map, automatic plate calculator & deterministic progression engine.',
    cta: 'Browse Exercises',
    path: '/library',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.24) 0%, rgba(234,179,8,0.14) 100%)',
    accentColor: 'var(--orange)',
    icon: 'dumbbell'
  }
]

export default function HomeNutritionHub() {
  const nav = useNavigate()
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)
  const toast = msg => useUI.getState().toast(msg)

  const [bannerIdx, setBannerIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setBannerIdx(i => (i + 1) % PROMO_BANNERS.length)
    }, 6000)
    return () => clearInterval(id)
  }, [])

  const today = todayISO()
  const nut = S.nutrition || emptyNutrition()
  const schedule = {
    ...DEFAULT_MEAL_SCHEDULE,
    ...(nut.schedule || {}),
    times: { ...DEFAULT_MEAL_SCHEDULE.times, ...(nut.schedule?.times || {}) }
  }
  const customFoods = Array.isArray(nut.customFoods) ? nut.customFoods : []
  const dayLog = nut.logs?.[today] || { items: [], waterMl: 0 }
  const totals = useMemo(() => computeDayTotals(dayLog, customFoods), [dayLog, customFoods])

  const nowHHMM = useMemo(() => {
    const d = new Date()
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }, [])

  const upcoming = useMemo(
    () => nextScheduledMeal(dayLog, schedule, customFoods, nowHHMM),
    [dayLog, schedule, customFoods, nowHHMM]
  )

  const toggleSlotEatenHome = slot => {
    update(s => {
      if (!s.nutrition) s.nutrition = emptyNutrition()
      if (!s.nutrition.logs) s.nutrition.logs = {}
      const cur = s.nutrition.logs[today] || { items: [], waterMl: 0, _ts: 0 }
      const slotItems = (cur.items || []).filter(x => x.slot === slot)
      const nextState = !slotItems.every(x => x.eaten)
      s.nutrition.logs[today] = {
        ...cur,
        items: (cur.items || []).map(x => (x.slot === slot ? { ...x, eaten: nextState } : x)),
        _ts: Date.now()
      }
    })
    toast(t('Updated meal status!'))
  }

  const quickActivateBeginnerWeek = () => {
    const items = buildItemsFromTemplate('plan_beginner_balanced', customFoods, uid)
    update(s => {
      if (!s.nutrition) s.nutrition = emptyNutrition()
      s.nutrition.logs = applyDayItemsToRange(s.nutrition.logs || {}, items, today, 7, Date.now(), uid)
      s.nutrition.schedule = {
        ...DEFAULT_MEAL_SCHEDULE,
        ...(s.nutrition.schedule || {}),
        confirmed: true,
        confirmedAt: Date.now(),
        remindersOn: true,
        _ts: Date.now()
      }
    })
    toast(t('Activated 7-Day Beginner Meal Schedule & Home Notifications!'))
  }

  const banner = PROMO_BANNERS[bannerIdx]
  const hasMealsToday = (dayLog.items || []).length > 0

  return (
    <>
      {/* 1. Promotional & Feature Banner Carousel on Home */}
      <div
        className="card"
        data-testid="home-promo-banner"
        style={{
          background: banner.gradient,
          border: '1px solid var(--surface-3)',
          position: 'relative',
          overflow: 'hidden',
          padding: '14px 16px'
        }}
      >
        <div className="row between" style={{ marginBottom: 6 }}>
          <span
            className="tag"
            style={{
              background: 'var(--surface)',
              color: banner.accentColor,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.04em'
            }}
          >
            <Icon name={banner.icon} style={{ marginInlineEnd: 4 }} />
            {t(banner.badge)}
          </span>
          <div className="row" style={{ gap: 5 }}>
            {PROMO_BANNERS.map((b, idx) => (
              <button
                key={b.id}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setBannerIdx(idx)}
                style={{
                  width: idx === bannerIdx ? 18 : 7,
                  height: 7,
                  borderRadius: 99,
                  border: 0,
                  padding: 0,
                  background: idx === bannerIdx ? banner.accentColor : 'var(--surface-3)',
                  transition: 'width 0.2s ease'
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ fontWeight: 700, fontSize: 'var(--fs-title3)', lineHeight: 1.25, marginBottom: 4 }}>
          {t(banner.title)}
        </div>
        <div className="small muted" style={{ lineHeight: 1.38, marginBottom: 12 }}>
          {t(banner.sub)}
        </div>

        <div className="row between">
          <Button
            size="sm"
            variant="primary"
            trailingIcon="chevronRight"
            onClick={() => nav(banner.path)}
          >
            {t(banner.cta)}
          </Button>
          <div className="row" style={{ gap: 4 }}>
            <button
              type="button"
              className="iconbtn"
              style={{ width: 28, height: 28, background: 'var(--surface)' }}
              onClick={() => setBannerIdx(i => (i - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length)}
              aria-label={t('Previous banner')}
            >
              <Icon name="chevronLeft" />
            </button>
            <button
              type="button"
              className="iconbtn"
              style={{ width: 28, height: 28, background: 'var(--surface)' }}
              onClick={() => setBannerIdx(i => (i + 1) % PROMO_BANNERS.length)}
              aria-label={t('Next banner')}
            >
              <Icon name="chevronRight" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Home Meal Notification Center (Breakfast / Lunch / Snack / Dinner alerts right on Home) */}
      <div className="card" data-testid="home-nutrition-card">
        <CardHead
          icon="bell"
          tint={schedule.confirmed ? 'var(--orange)' : 'var(--green)'}
          eyebrow={schedule.confirmed ? t('Daily Meal Notifications Active') : t('Calories & Macros')}
          title={t('Today’s Meal Reminders & Nutrition')}
          sub={
            hasMealsToday
              ? `${totals.kcal} kcal · ${totals.protein}g ${t('Protein')} · ${totals.carbs}g C · ${totals.fat}g F`
              : t('No meal schedule confirmed yet. Activate a 1-tap beginner schedule or customize your meals.')
          }
          open={{ onClick: () => nav('/nutrition') }}
          action={<Icon name="chevronRight" className="chev" />}
        />

        {hasMealsToday ? (
          <div style={{ marginTop: 6 }}>
            {/* Highlighted Next Meal Alert Box */}
            {upcoming && !upcoming.allDoneToday && (
              <div
                data-testid="home-upcoming-meal-alert"
                style={{
                  background: 'color-mix(in srgb, var(--orange) 14%, var(--surface-2))',
                  border: '1px solid color-mix(in srgb, var(--orange) 38%, transparent)',
                  borderRadius: 10,
                  padding: '9px 12px',
                  marginBottom: 8
                }}
              >
                <div className="row between" style={{ gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="small" style={{ color: 'var(--orange)', fontWeight: 700 }}>
                      🔔 {t('Upcoming Meal')}: {t(SLOT_LABELS[upcoming.slot])} ({upcoming.time})
                    </div>
                    <div className="small" style={{ fontWeight: 500, marginTop: 2 }}>
                      {upcoming.items.map(x => x.name).join(' + ')}
                    </div>
                    <div className="small muted">
                      {upcoming.kcal} kcal · {upcoming.protein}g {t('Protein')}
                    </div>
                  </div>
                  <Button size="xs" variant="primary" onClick={() => toggleSlotEatenHome(upcoming.slot)}>
                    {t('Mark eaten')}
                  </Button>
                </div>
              </div>
            )}

            {/* Schedule list of all 4 meals (Morning, Noon, Afternoon, Evening) */}
            {['breakfast', 'lunch', 'snack', 'dinner'].map(slot => {
              const m = totals.bySlot[slot]
              if (!m || !m.items.length) return null
              const time = schedule.times[slot] || DEFAULT_MEAL_SCHEDULE.times[slot]
              return (
                <div key={slot} className="lrow" style={{ paddingBlock: 7 }}>
                  <span
                    className="lrow-i"
                    style={{
                      width: 32,
                      height: 32,
                      background: m.allEaten ? 'var(--green)' : 'var(--surface-2)',
                      color: m.allEaten ? '#000' : 'var(--label)'
                    }}
                  >
                    <Icon name={m.allEaten ? 'checkCircle' : SLOT_ICONS[slot]} />
                  </span>
                  <div className="lrow-m">
                    <div className="lrow-t" style={{ fontWeight: 600 }}>
                      {t(SLOT_LABELS[slot])} <span className="small muted">({time})</span>
                    </div>
                    <div className="lrow-s">
                      {m.items.map(x => x.name).join(' + ')} · {m.kcal} kcal ({m.protein}g P)
                    </div>
                  </div>
                  <Button
                    size="xs"
                    variant={m.allEaten ? 'tinted' : 'ghost'}
                    onClick={() => toggleSlotEatenHome(slot)}
                  >
                    {m.allEaten ? t('Eaten') : t('Mark eaten')}
                  </Button>
                </div>
              )
            })}

            <div className="row between" style={{ marginTop: 8 }}>
              <Button size="sm" variant="ghost" icon="sliders" onClick={() => nav('/nutrition')}>
                {t('Edit Meals & Times')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="row" style={{ gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <Button
              size="sm"
              variant="primary"
              icon="bell"
              onClick={quickActivateBeginnerWeek}
              data-testid="home-quick-activate-meals"
            >
              {t('1-Tap Activate Beginner Meal Reminders')}
            </Button>
            <Button size="sm" variant="tinted" onClick={() => nav('/nutrition')}>
              {t('Customize Menu')}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
