import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { DAYS, DAYN, todayISO, weekOrder, weekStartOf } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import CardHead from './CardHead.jsx'
import { Button } from './ui.jsx'
import {
  crossDomainReadiness,
  proposeScheduleAdaptation,
  applyApprovedSchedule,
  undoLastScheduleAdaptation
} from '../lib/adaptive-schedule.js'

export default function AdaptiveScheduleCard() {
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)
  const toast = msg => useUI.getState().toast(msg)

  const [busyDays, setBusyDays] = useState([])
  const [proposal, setProposal] = useState(null)

  const today = todayISO()
  const readiness = useMemo(() => crossDomainReadiness(S, today), [S, today])
  const ws = weekStartOf(S)
  const order = weekOrder(ws)
  const hasSnapshots = Array.isArray(S?.adaptiveSnapshots) && S.adaptiveSnapshots.length > 0

  const toggleBusyDay = d => {
    setBusyDays(prev => {
      const next = prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
      setProposal(next.length ? proposeScheduleAdaptation(S, { busyDays: next, todayIso: today }) : null)
      return next
    })
  }

  const handleApprove = () => {
    if (!proposal) return
    update(s => {
      applyApprovedSchedule(s, proposal)
    })
    setProposal(null)
    setBusyDays([])
    toast(t('Applied adaptive schedule! You can undo anytime.'))
  }

  const handleUndo = () => {
    update(s => {
      undoLastScheduleAdaptation(s)
    })
    toast(t('Restored previous weekly schedule!'))
  }

  const badgeColor =
    readiness.status === 'optimal'
      ? 'var(--green)'
      : readiness.status === 'moderate_fatigue'
        ? 'var(--orange)'
        : 'var(--red)'

  return (
    <div className="card" data-testid="adaptive-schedule-card" style={{ marginTop: 12 }}>
      <CardHead
        icon="sparkles"
        tint={badgeColor}
        eyebrow={`${t('Adaptive Engine')} · ${t('Readiness')} ${readiness.score}/100`}
        title={t('Smart Schedule & Recovery Adaptation')}
        sub={t(readiness.recommendation)}
        action={
          hasSnapshots ? (
            <Button size="xs" variant="ghost" onClick={handleUndo} data-testid="adaptive-undo-btn">
              {t('Undo')}
            </Button>
          ) : null
        }
      />

      {readiness.signals.length > 0 && (
        <div className="chips" style={{ paddingInline: 0, marginTop: 4 }}>
          {readiness.signals.map((sig, idx) => (
            <span key={idx} className="tag" style={{ background: 'var(--surface-2)' }}>
              {sig}
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <div className="small muted" style={{ marginBottom: 6 }}>
          {t('Busy this week? Tap the days you cannot train to preview an automatic schedule adaptation:')}
        </div>
        <div className="chips" style={{ paddingInline: 0 }}>
          {order.map(d => {
            const isBusy = busyDays.includes(d)
            return (
              <button
                key={d}
                type="button"
                className={'chip' + (isBusy ? ' on' : '')}
                onClick={() => toggleBusyDay(d)}
                data-testid={`busy-day-${d}`}
              >
                {t(DAYS[d])}
              </button>
            )
          })}
        </div>
      </div>

      {proposal && (
        <div
          data-testid="adaptive-proposal-preview"
          style={{
            background: 'var(--surface-2)',
            borderRadius: 10,
            padding: 12,
            marginTop: 10
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            {t('Proposed Schedule Adjustment (Requires Approval)')}
          </div>
          {proposal.changes.length > 0 ? (
            <>
              {proposal.changes.map((ch, idx) => (
                <div key={idx} className="lrow" style={{ paddingBlock: 6 }}>
                  <span className="lrow-i" style={{ width: 28, height: 28, background: 'var(--surface-3)' }}>
                    <Icon name="swap" />
                  </span>
                  <div className="lrow-m">
                    <div className="lrow-t">
                      <strong>{ch.routineName}</strong>: {t(DAYN[ch.fromDay])} → {t(DAYN[ch.toDay])}
                    </div>
                    <div className="lrow-s">{t(ch.reason)}</div>
                  </div>
                </div>
              ))}
              <div className="row" style={{ gap: 8, marginTop: 10 }}>
                <Button size="sm" variant="primary" icon="checkCircle" onClick={handleApprove} data-testid="approve-adaptive-btn">
                  {t('Approve & Apply')}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setProposal(null); setBusyDays([]) }}>
                  {t('Cancel')}
                </Button>
              </div>
            </>
          ) : (
            <div className="small muted">{t('No planned sessions fell on the selected busy days.')}</div>
          )}
        </div>
      )}
    </div>
  )
}
