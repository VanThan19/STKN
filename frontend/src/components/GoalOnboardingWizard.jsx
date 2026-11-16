import { useMemo, useState } from 'react'
import { t } from '../lib/i18n.js'
import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import Icon from './Icon.jsx'
import { Button } from './ui.jsx'
import {
  ONBOARDING_GOALS,
  ONBOARDING_EXPERIENCE,
  ONBOARDING_ACTIVITY,
  DEFAULT_ONBOARDING_FORM,
  computeOnboardingPreview,
  applyGoalOnboarding
} from '../lib/starter-onboarding.js'

const PLAN_LABELS = {
  'full-body': 'Full Body (3 days/wk)',
  'upper-lower': 'Upper / Lower (4 days/wk)',
  ppl: 'Push / Pull / Legs (3 days/wk)',
  '5x5': '5×5 Strength (3 days/wk)'
}

const MEAL_LABELS = {
  plan_fat_loss_cut: '7-Day Fat Loss Meal Plan',
  plan_beginner_balanced: '7-Day Balanced Starter Menu',
  plan_muscle_bulk: '7-Day Lean Muscle Meal Plan'
}

export function GoalOnboardingWizard({ close, initialStep = 1, loadStarterPlanFn, onComplete }) {
  const S = useStore(s => s.S)
  const nutProfile = S?.nutrition?.profile
  const existingWeight = S?.bodyweight?.length ? S.bodyweight[S.bodyweight.length - 1].w : null

  const [step, setStep] = useState(initialStep)
  const [form, setForm] = useState(() => ({
    ...DEFAULT_ONBOARDING_FORM,
    sex: S?.sex === 'female' ? 'female' : (nutProfile?.sex || DEFAULT_ONBOARDING_FORM.sex),
    age: nutProfile?.age || (S?.birthYear ? Math.max(14, new Date().getFullYear() - S.birthYear) : DEFAULT_ONBOARDING_FORM.age),
    heightCm: nutProfile?.heightCm || DEFAULT_ONBOARDING_FORM.heightCm,
    weightKg: existingWeight || nutProfile?.weightKg || DEFAULT_ONBOARDING_FORM.weightKg,
    targetWeightKg: S?.targetW || existingWeight || nutProfile?.weightKg || DEFAULT_ONBOARDING_FORM.targetWeightKg,
    goal: nutProfile?.goal || DEFAULT_ONBOARDING_FORM.goal,
    activityLevel: nutProfile?.activityLevel || DEFAULT_ONBOARDING_FORM.activityLevel
  }))

  const preview = useMemo(() => computeOnboardingPreview(form), [form])
  const patch = next => setForm(prev => ({ ...prev, ...next }))

  const submit = () => {
    const res = applyGoalOnboarding(useStore, form, { loadStarterPlanFn })
    useUI.getState().toast(t('Starter workout & 7-day meal plan created!'))
    close?.()
    onComplete?.(res)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.25 }}>
            {step === 1 ? t('Step 1/2: Your Goal') : t('Step 2/2: Body Metrics')}
          </div>
          <div className="small muted" style={{ marginTop: 4 }}>
            {step === 1
              ? t('Tell us what you want to achieve so we can build your starter plan.')
              : t('Enter your body stats to calculate BMR, TDEE, and daily macros.')}
          </div>
        </div>
        {close && (
          <button
            type="button"
            className="btn-icon"
            aria-label={t('Close')}
            onClick={close}
            style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 99, width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--label)' }}
          >
            <Icon name="x" />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'var(--acc)' }} />
        <div style={{ flex: 1, height: 4, borderRadius: 99, background: step === 2 ? 'var(--acc)' : 'var(--surface-2)' }} />
      </div>

      {step === 1 ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="small muted" style={{ fontWeight: 600 }}>{t('Primary Goal')}</div>
            {ONBOARDING_GOALS.map(g => {
              const active = form.goal === g.id
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => patch({ goal: g.id })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 14px',
                    borderRadius: 14,
                    border: active ? '1.5px solid var(--acc)' : '1px solid var(--sep)',
                    background: active ? 'color-mix(in srgb, var(--acc) 12%, var(--surface))' : 'var(--surface)',
                    color: 'var(--label)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{g.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t(g.labelKey)}</div>
                    <div className="small muted">{t(g.descKey)}</div>
                  </div>
                  {active && <Icon name="check" style={{ color: 'var(--acc)' }} />}
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="small muted" style={{ fontWeight: 600 }}>{t('Training Experience')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {ONBOARDING_EXPERIENCE.map(exp => {
                const active = form.experience === exp.id
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => patch({ experience: exp.id })}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 12,
                      border: active ? '1.5px solid var(--acc)' : '1px solid var(--sep)',
                      background: active ? 'color-mix(in srgb, var(--acc) 12%, var(--surface))' : 'var(--surface)',
                      color: 'var(--label)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{t(exp.labelKey)}</div>
                    <div className="small muted" style={{ fontSize: 11 }}>{t(exp.descKey)}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="small muted" style={{ fontWeight: 600 }}>{t('Days per week')}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[2, 3, 4, 5, 6].map(d => {
                const active = form.daysPerWeek === d
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => patch({ daysPerWeek: d })}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      borderRadius: 12,
                      border: active ? '1.5px solid var(--acc)' : '1px solid var(--sep)',
                      background: active ? 'var(--acc)' : 'var(--surface)',
                      color: active ? 'var(--on-acc)' : 'var(--label)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
          </div>

          <Button variant="primary" icon="chevronRight" onClick={() => setStep(2)}>
            {t('Continue: Enter Body Metrics')}
          </Button>
        </>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div className="small muted" style={{ marginBottom: 4 }}>{t('Sex')}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[{ id: 'male', label: t('Male') }, { id: 'female', label: t('Female') }].map(sx => {
                  const active = form.sex === sx.id
                  return (
                    <button
                      key={sx.id}
                      type="button"
                      onClick={() => patch({ sex: sx.id })}
                      style={{
                        flex: 1,
                        padding: '9px 0',
                        borderRadius: 10,
                        border: active ? '1.5px solid var(--acc)' : '1px solid var(--sep)',
                        background: active ? 'var(--acc)' : 'var(--surface)',
                        color: active ? 'var(--on-acc)' : 'var(--label)',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {sx.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="small muted">{t('Age')}</span>
              <input
                className="input"
                type="number"
                min={13}
                max={85}
                value={form.age}
                onChange={e => patch({ age: e.target.value })}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="small muted">{t('Height (cm)')}</span>
              <input
                className="input"
                type="number"
                min={120}
                max={230}
                value={form.heightCm}
                onChange={e => patch({ heightCm: e.target.value })}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="small muted">{t('Current Weight (kg)')}</span>
              <input
                className="input"
                type="number"
                step="0.5"
                min={30}
                max={250}
                value={form.weightKg}
                onChange={e => patch({ weightKg: e.target.value })}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="small muted">{t('Target Weight (kg)')}</span>
              <input
                className="input"
                type="number"
                step="0.5"
                min={30}
                max={250}
                value={form.targetWeightKg}
                onChange={e => patch({ targetWeightKg: e.target.value })}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="small muted">{t('Daily Activity')}</span>
              <select
                className="input"
                value={form.activityLevel}
                onChange={e => patch({ activityLevel: e.target.value })}
              >
                {ONBOARDING_ACTIVITY.map(a => (
                  <option key={a.id} value={a.id}>{t(a.labelKey)}</option>
                ))}
              </select>
            </label>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 14,
              background: 'color-mix(in srgb, var(--acc) 10%, var(--surface))',
              border: '1px solid color-mix(in srgb, var(--acc) 35%, transparent)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{t('Your Personalized Starter Plan')}</span>
              <span className="small" style={{ color: 'var(--acc)', fontWeight: 700 }}>
                BMI {preview.bmi} · {preview.targets.kcal} kcal
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, textAlign: 'center' }}>
              <div style={{ padding: '6px 4px', borderRadius: 10, background: 'var(--surface)' }}>
                <div className="small muted" style={{ fontSize: 11 }}>TDEE</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{preview.targets.tdee}</div>
              </div>
              <div style={{ padding: '6px 4px', borderRadius: 10, background: 'var(--surface)' }}>
                <div className="small muted" style={{ fontSize: 11 }}>{t('Protein')}</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{preview.targets.protein}g</div>
              </div>
              <div style={{ padding: '6px 4px', borderRadius: 10, background: 'var(--surface)' }}>
                <div className="small muted" style={{ fontSize: 11 }}>{t('Carbs')}</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{preview.targets.carbs}g</div>
              </div>
              <div style={{ padding: '6px 4px', borderRadius: 10, background: 'var(--surface)' }}>
                <div className="small muted" style={{ fontSize: 11 }}>{t('Fat')}</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{preview.targets.fat}g</div>
              </div>
            </div>
            <div className="small" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span>🏋️ <strong>{t('Workout')}:</strong> {t(PLAN_LABELS[preview.workoutPlanId] || 'Full Body (3 days/wk)')}</span>
              <span>🥗 <strong>{t('Nutrition')}:</strong> {t(MEAL_LABELS[preview.mealTemplateId] || '7-Day Balanced Starter Menu')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => setStep(1)}>{t('Back')}</Button>
            <div style={{ flex: 1 }}>
              <Button variant="primary" icon="sparkles" onClick={submit}>
                {t('Create My Starter Plan')}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function goalOnboardingSheet({ loadStarterPlanFn, onComplete, initialStep = 1 } = {}) {
  useUI.getState().openSheet(close => (
    <GoalOnboardingWizard
      close={close}
      initialStep={initialStep}
      loadStarterPlanFn={loadStarterPlanFn}
      onComplete={onComplete}
    />
  ))
}
