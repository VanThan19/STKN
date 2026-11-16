import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { muscleComboFor, buildRoutineFromCombo, exerciseMetaOf } from '../lib/curated-exercises.js'
import { t, exerciseNameFor, exerciseNameClass, getLang } from '../lib/i18n.js'
import { nav } from '../lib/nav.js'
import { Thumb } from './Media.jsx'
import Icon from './Icon.jsx'
import { Button } from './ui.jsx'

export default function MuscleComboCard({ muscle, onDetail }) {
  const [savedId, setSavedId] = useState(null)
  const lang = getLang()
  const isVi = String(lang).startsWith('vi')
  const combo = muscle ? muscleComboFor(muscle) : null
  if (!combo) return null

  const title = isVi ? combo.titleVi : combo.titleEn
  const tip = isVi ? combo.tipVi : combo.tipEn

  const handleSaveRoutine = () => {
    const routine = buildRoutineFromCombo(muscle, lang)
    if (!routine) return
    const st = useStore.getState()
    if (typeof st?.update === 'function') {
      st.update(s => {
        if (!Array.isArray(s.routines)) s.routines = []
        s.routines.push(routine)
      })
      setSavedId(routine.id)
    }
  }

  return (
    <div className="card muscle-combo-card" style={{ marginBottom: 14, borderColor: 'var(--acc-line)', background: 'var(--surface)' }}>
      <div className="row between" style={{ gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div className="small" style={{ color: 'var(--acc-ink)', fontWeight: 700, marginBottom: 2 }}>
            ⭐ {t('Starter workout blueprint')}
          </div>
          <h3 style={{ margin: 0 }}>{title}</h3>
        </div>
        <span className="tag acc">{combo.items.length} {t('Exercises').toLowerCase()}</span>
      </div>

      <div className="small dim" style={{ marginBottom: 10, lineHeight: 1.45 }}>
        💡 {tip}
      </div>

      <div className="combo-rows" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {combo.items.map((it, idx) => {
          const meta = exerciseMetaOf(it.ex)
          const diffLabel = meta.difficulty === 'beginner'
            ? t('Beginner')
            : meta.difficulty === 'advanced'
              ? t('Advanced')
              : t('Intermediate')
          return (
            <button
              key={it.ex.id}
              type="button"
              className="combo-row"
              onClick={() => onDetail?.(it.ex)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 12,
                border: '1px solid var(--sep)',
                background: 'var(--surface-2)',
                textAlign: 'left',
                width: '100%',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <span className="small dim" style={{ fontWeight: 700, minWidth: 16 }}>{idx + 1}.</span>
              <Thumb ex={it.ex} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={exerciseNameClass(it.ex)} style={{ fontWeight: 600, fontSize: 'var(--fs-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {exerciseNameFor(it.ex)}
                </div>
                <div className="small dim" style={{ marginTop: 2 }}>
                  <span>{it.sets} × {it.reps}</span>
                  <span> · {diffLabel}</span>
                  <span> · {isVi ? it.noteVi : it.noteEn}</span>
                </div>
              </div>
              <Icon name="chevronRight" className="chev" />
            </button>
          )
        })}
      </div>

      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        {savedId ? (
          <Button size="sm" variant="primary" icon="check" onClick={() => nav('/plan')}>
            {t('Saved to Plan · View')}
          </Button>
        ) : (
          <Button size="sm" variant="primary" icon="plus" onClick={handleSaveRoutine}>
            {t('Save as routine')}
          </Button>
        )}
        <Button size="sm" variant="tinted" icon="sparkles" onClick={() => nav('/coach')}>
          {t('Ask AI Coach form tips')}
        </Button>
      </div>
    </div>
  )
}
