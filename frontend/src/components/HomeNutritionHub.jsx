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
    promoTag: 'Free 7-Day Setup',
    shortTab: '7-Day Menu',
    title: '1-Tap 7-Day International Meal Plan',
    sub: 'Auto-calculate BMR, TDEE & Macros (USDA). Set your whole week and get Breakfast, Lunch & Dinner reminders!',
    highlights: ['Auto TDEE', '4 Meals/Day', 'USDA Data'],
    cta: 'Set Up Meal Schedule',
    path: '/nutrition',
    gradient: 'linear-gradient(135deg, rgba(48,209,88,0.22) 0%, rgba(16,185,129,0.10) 55%, var(--surface) 100%)',
    accentColor: 'var(--green)',
    icon: 'sparkles',
    image: 'banners/banner-meal-plan.svg',
    priceBadge: 'USDA Standard'
  },
  {
    id: 'promo_whey_combo',
    badge: 'FITNESS PARTNER SPOTLIGHT',
    promoTag: '-25% Combo Deal',
    shortTab: 'Whey Isolate',
    title: 'Whey Isolate & High-Protein Combos',
    sub: 'Hit 2.0g Protein/kg effortlessly with beginner-friendly post-workout shakes, oats & lean meat combos.',
    highlights: ['27g Protein', '5.5g BCAA', '0g Sugar'],
    cta: 'Explore Protein Combos',
    path: '/nutrition',
    gradient: 'linear-gradient(135deg, rgba(10,132,255,0.24) 0%, rgba(94,92,230,0.12) 55%, var(--surface) 100%)',
    accentColor: 'var(--blue)',
    icon: 'bolt',
    image: 'banners/banner-whey-pro.svg',
    priceBadge: '27g Protein/scoop'
  },
  {
    id: 'promo_ai_coach',
    badge: 'GEMINI AI TRAINER',
    promoTag: '24/7 Smart Coach',
    shortTab: 'AI Coach',
    title: 'AI Coach That Builds Your Menu & Plan',
    sub: 'Tell AI Coach your budget, favorite foods, or schedule — automatically update your meal plan and training split.',
    highlights: ['Auto Menu', 'Form Q&A', 'Goal Sync'],
    cta: 'Chat With AI Coach',
    path: '/coach',
    gradient: 'linear-gradient(135deg, rgba(191,90,242,0.24) 0%, rgba(48,209,88,0.10) 55%, var(--surface) 100%)',
    accentColor: 'var(--purple)',
    icon: 'chat',
    image: 'banners/banner-ai-coach.svg',
    priceBadge: 'Gemini Live'
  },
  {
    id: 'promo_anatomy_library',
    badge: 'SMART TRAINING SYSTEM',
    promoTag: 'Beginner Ready',
    shortTab: '5,600+ Exercises',
    title: '5,600+ Exercises & 3D Muscle Guide',
    sub: 'Interactive anatomical muscle map, beginner essentials filter & 1-tap starter workout combos per muscle.',
    highlights: ['18 Muscles', 'Difficulty Tags', 'HD Clips'],
    cta: 'Browse Exercises',
    path: '/library',
    gradient: 'linear-gradient(135deg, rgba(255,159,10,0.24) 0%, rgba(255,69,58,0.12) 55%, var(--surface) 100%)',
    accentColor: 'var(--orange)',
    icon: 'dumbbell',
    image: 'banners/banner-smart-gym.svg',
    athleteImg: 'exercise-media/still/0025.webp',
    priceBadge: '5,632 Clips'
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
          border: '1px solid color-mix(in srgb, ' + banner.accentColor + ' 32%, var(--sep))',
          position: 'relative',
          overflow: 'hidden',
          padding: '14px 14px 12px'
        }}
      >
        {/* Top Row: Brand Badge + Offer Ribbon + Dots */}
        <div className="row between" style={{ marginBottom: 10, gap: 8, flexWrap: 'wrap' }}>
          <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
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
            <span
              className="tag"
              style={{
                background: 'color-mix(in srgb, ' + banner.accentColor + ' 20%, var(--surface))',
                color: 'var(--label)',
                border: '1px solid color-mix(in srgb, ' + banner.accentColor + ' 45%, transparent)',
                fontWeight: 700,
                fontSize: 11
              }}
            >
              {t(banner.promoTag)}
            </span>
          </div>

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
                  transition: 'width 0.2s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>

        {/* Split-Hero Body: Copy + Highlights on Left, Commercial Visual Artwork on Right */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 'var(--fs-title3)', lineHeight: 1.24, marginBottom: 5 }}>
              {t(banner.title)}
            </div>
            <div className="small muted" style={{ lineHeight: 1.4, marginBottom: 9 }}>
              {t(banner.sub)}
            </div>

            {Array.isArray(banner.highlights) && (
              <div className="row" style={{ gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                {banner.highlights.map(h => (
                  <span
                    key={h}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 999,
                      background: 'color-mix(in srgb, var(--surface) 84%, transparent)',
                      border: '1px solid var(--sep)',
                      color: 'var(--label)'
                    }}
                  >
                    ✓ {t(h)}
                  </span>
                ))}
              </div>
            )}

            <div className="row" style={{ gap: 8, alignItems: 'center' }}>
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

          {/* Right Promotional Visual Showcase */}
          <button
            type="button"
            onClick={() => nav(banner.path)}
            aria-label={t(banner.title)}
            style={{
              position: 'relative',
              width: 126,
              height: 126,
              flexShrink: 0,
              padding: 0,
              borderRadius: 18,
              border: '1px solid color-mix(in srgb, ' + banner.accentColor + ' 45%, var(--sep))',
              background: 'var(--surface-2)',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)'
            }}
          >
            <img
              src={banner.image}
              alt={t(banner.title)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {banner.athleteImg && (
              <img
                src={banner.athleteImg}
                alt=""
                onError={e => { e.currentTarget.style.display = 'none' }}
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  objectFit: 'cover',
                  border: '1.5px solid #ffffff',
                  background: '#111'
                }}
              />
            )}
            <span
              style={{
                position: 'absolute',
                left: 6,
                right: 6,
                bottom: 6,
                padding: '3px 6px',
                borderRadius: 8,
                background: 'rgba(12, 14, 18, 0.86)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: '#ffffff',
                fontSize: 10,
                fontWeight: 700,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {t(banner.priceBadge)}
            </span>
          </button>
        </div>

        {/* Bottom 1-Tap Promo Quick-Switch Strip */}
        <div
          className="row"
          style={{
            gap: 6,
            overflowX: 'auto',
            paddingTop: 8,
            borderTop: 'var(--hair) solid var(--sep)'
          }}
        >
          {PROMO_BANNERS.map((b, idx) => {
            const active = idx === bannerIdx
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setBannerIdx(idx)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  whiteSpace: 'nowrap',
                  padding: '5px 9px',
                  borderRadius: 10,
                  border: '1px solid ' + (active ? b.accentColor : 'var(--sep)'),
                  background: active ? 'var(--acc)' : 'var(--surface-2)',
                  color: active ? 'var(--on-acc)' : 'var(--label-2)',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Icon name={b.icon} size={12} />
                <span>{t(b.shortTab)}</span>
              </button>
            )
          })}
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
          action={
            <button
              type="button"
              className="iconbtn"
              onClick={() => nav('/nutrition')}
              aria-label={t('Nutrition & Macros')}
            >
              <Icon name="chevronRight" />
            </button>
          }
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
              <Button size="sm" variant="ghost" icon="slider" onClick={() => nav('/nutrition')}>
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
