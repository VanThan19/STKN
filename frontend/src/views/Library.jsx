import { useDeferredValue, useMemo, useRef, useState } from 'react'
import { useUI } from '../store/useUI.js'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { EXDB, BODYPARTS, allExercises, equipmentOf, byCategory, searchExercises, similarExercises } from '../lib/exercises.js'
import { MUSCLES, MUSCLE_NAME, musclesOf } from '../lib/muscles.js'
import {
  QUICK_SCENES,
  exerciseMetaOf,
  isEssentialForMuscle,
  muscleCountsOf,
} from '../lib/curated-exercises.js'
import { activeProfile, exAvailable } from '../lib/equipment.js'
import { bestWeightFor } from '../lib/history.js'
import { fmtNum, exCount } from '../lib/format.js'
import { t, tn, exerciseNameFor, exerciseNameClass } from '../lib/i18n.js'
import BodyMap from '../components/BodyMap.jsx'
import MuscleComboCard from '../components/MuscleComboCard.jsx'
import { Thumb } from '../components/Media.jsx'
import { exerciseDetailSheet, addToRoutineSheet, customExSheet } from '../sheets.jsx'
import Icon from '../components/Icon.jsx'
import ExerciseViewToggle from '../components/ExerciseViewToggle.jsx'
import { Button, Segmented } from '../components/ui.jsx'
import { tappable, useRevealActiveChip } from '../lib/use-sheet-keyboard.js'
import { useAutoMore } from '../lib/use-auto-more.js'
import { isFav, sortFavouritesFirst, sortYoursFirst, usageOf } from '../lib/favourites.js'

function metaBadgeText(meta) {
  const diff = meta.difficulty === 'beginner'
    ? '🟢 ' + t('Beginner')
    : meta.difficulty === 'advanced'
      ? '🔴 ' + t('Advanced')
      : '🟡 ' + t('Intermediate')
  const mech = meta.mechanic === 'compound'
    ? t('Compound')
    : meta.mechanic === 'mobility'
      ? t('Mobility')
      : t('Isolation')
  return (meta.isEssential ? '⭐ ' + t('Essential') + ' · ' : '') + diff + ' · ' + mech
}

export default function Library() {
  const nav = useNavigate()
  const S = useStore(s => s.S)
  const [q, setQ] = useState('')
  const [bp, setBp] = useState('')
  const [eq, setEq] = useState('')
  const [cat, setCat] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState(null)
  const [tier, setTier] = useState('all')       // 'all' | 'essential' | 'compound'
  const [scene, setScene] = useState('all')
  const [mapOpen, setMapOpen] = useState(true)
  const [showAll, setShowAll] = useState(false)   // ignore the active equipment profile for this session
  const [shown, setShown] = useState(40)
  const bpStrip = useRef(null)
  const moreRef = useAutoMore(() => setShown(s => s + 40))
  const profile = activeProfile(S)
  // Your own exercises, counted the way the list below shows them (allExercises puts every
  // custom entry in front of the catalogue; deleting one removes it from customEx outright).
  const ownCount = (S.customEx || []).filter(c => c && c.id).length

  const catalogAll = useMemo(() => allExercises(S), [S.customEx, S.exMerged])
  const musclePool = useMemo(
    () => (profile && !showAll) ? catalogAll.filter(e => exAvailable(S, e)) : catalogAll,
    [catalogAll, profile, showAll, S],
  )
  const muscleCounts = useMemo(
    () => Object.fromEntries(MUSCLES.map(m => [m, muscleCountsOf(musclePool, m)])),
    [musclePool],
  )

  const sceneObj = QUICK_SCENES.find(sc => sc.id === scene) || QUICK_SCENES[0]
  const matchesGuide = e => {
    if (!sceneObj.match(e)) return false
    if (tier === 'essential') return isEssentialForMuscle(e, selectedMuscle)
    if (tier === 'compound') return exerciseMetaOf(e).mechanic === 'compound'
    return true
  }

  const pickMuscle = m => {
    setSelectedMuscle(cur => (cur === m ? null : m))
    setShown(40)
  }

  const byMuscleAndPart = catalogAll.filter(e => {
    if (bp && e.bp !== bp) return false
    if (selectedMuscle && !musclesOf(e)[selectedMuscle]) return false
    return matchesGuide(e)
  })
  const inPart = searchExercises(byMuscleAndPart, q)
  // Kind of exercise (strength, stretching, cardio...), the same fallback as equipment below: a
  // choice the search or body part has narrowed away is ignored for now, never a dead end.
  const { opts: catOpts, on: catOn, list: base } = byCategory(inPart, cat)
  const eqFiltered = (profile && !showAll) ? base.filter(e => exAvailable(S, e)) : base
  const eqOpts = equipmentOf(eqFiltered)
  // Drop the equipment filter if the search narrowed it away, so you never hit a dead end.
  const eqOn = eqOpts.includes(eq) ? eq : ''
  // Favourites float to the top of whatever the filters left (issue #6), the rest keeps its order;
  // while searching, the exercises you have logged or planned follow right after them.
  const narrowedList = eqOn ? eqFiltered.filter(e => e.eq === eqOn) : eqFiltered
  const usage = useMemo(() => (q.trim() ? usageOf(S) : null), [q, S.routines, S.workouts])
  const f = useMemo(() => {
    const ordered = usage ? sortYoursFirst(narrowedList, S, usage) : sortFavouritesFirst(narrowedList, S)
    if (selectedMuscle && tier === 'essential') {
      return [...ordered].sort((a, b) => {
        const fa = isFav(S, a.id) ? 0 : 1
        const fb = isFav(S, b.id) ? 0 : 1
        if (fa !== fb) return fa - fb
        return (musclesOf(b)[selectedMuscle] || 0) - (musclesOf(a)[selectedMuscle] || 0)
      })
    }
    return ordered
  }, [narrowedList, S, usage, selectedMuscle, tier])

  useRevealActiveChip(bpStrip, bp)
  // Type and equipment live in the Filters sheet (P7). It works out its own options from the same
  // search and body part, so a choice it offers is never a dead end either.
  const sheetOn = (catOn ? 1 : 0) + (eqOn ? 1 : 0)
  const filtersFor = (c, e) => {
    const by = byCategory(inPart, c)
    const pool = (profile && !showAll) ? by.list.filter(x => exAvailable(S, x)) : by.list
    const opts = equipmentOf(pool)
    return { catOpts: by.opts, catOn: by.on, eqOpts: opts, eqOn: opts.includes(e) ? e : '' }
  }
  const openFilters = () => useUI.getState().openSheet(close => <LibraryFilters close={close} cat={catOn} eq={eqOn} filtersFor={filtersFor}
    onChange={(c, e) => { setCat(c); setEq(e); setShown(40) }} />)
  // A live count at the end of the search field while a search or filter narrows the list.
  const narrowed = !!(q.trim() || bp || eqOn || catOn || selectedMuscle || tier !== 'all' || scene !== 'all')
  // Close but not exact (a typo too many, most of the words, a similar name), under the results
  // once they are all on screen, so a search almost never ends on "No match".
  const qLate = useDeferredValue(q)
  const similar = q.trim() && qLate === q && f.length <= shown
    ? similarExercises(catalogAll.filter(e => (!bp || e.bp === bp) && (!profile || showAll || exAvailable(S, e))), q, f, f.length ? 12 : 30)
    : []

  const row = e => {
    const best = bestWeightFor(S, e.id)
    const meta = exerciseMetaOf(e)
    // The row is not a button: its name is, stretched over the row (.tap-main), with Add to my plan
    // a sibling above it (card dismiss pass), so neither tap can land on the other.
    return <div key={e.id} className="item tap-host">
      <Thumb ex={e} />
      <button type="button" className="grow item-open tap-main" aria-haspopup="dialog" onClick={() => exerciseDetailSheet(e)}>
        <span className={`tt ${exerciseNameClass(e)}`}>{isFav(S, e.id) && <Icon name="starFill" className="fav-star" />}{exerciseNameFor(e)}</span>
        <span className="ss capitalize">{t(MUSCLE_NAME[e.tg] || e.tg || e.bp)} · {t(e.eq)}</span>
        <span className="ex-meta-badges" style={{ display: 'block', marginTop: 2, fontSize: 'var(--fs-caption)', opacity: 0.72 }}>{metaBadgeText(meta)}</span>
      </button>
      {best > 0 && <span className="tag acc">{fmtNum(best)}</span>}
      {/* a quiet trailing button (P7): the accent stays on the one action of the screen */}
      <button type="button" className="iconbtn lib-add" aria-label={t('Add to my plan')} title={t('Add to my plan')}
        onClick={() => addToRoutineSheet(e)}><Icon name="plus" /></button>
    </div>
  }

  return <>
    <div className="hdr lib-hdr"><div><h1>{t('Exercises')}</h1></div>
      <Button size="sm" variant="tinted" icon="figureStrength" onClick={() => nav('/muscles')}>{t('By muscle')}</Button>
      <div className="sub lib-count">{ownCount
        ? tn('{1} animated exercises + 1 of your own', '{1} animated exercises + {0} of your own', ownCount, EXDB.length)
        : t('{0} exercises with animations', EXDB.length)}</div>
    </div>

    {/* Visual Muscle Map & Beginner Guide Card — keeps the BodyMap centerpiece right inside Exercises */}
    <div className="card lib-explorer-card" style={{ marginBottom: 12 }}>
      <div className="row between" style={{ marginBottom: mapOpen ? 8 : 0, gap: 8, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 'var(--fs-body)' }}>{t('Explore muscles')}</div>
          <div className="small dim">
            {selectedMuscle
              ? `${t(MUSCLE_NAME[selectedMuscle])} · ${muscleCounts[selectedMuscle]?.essential || 0} ${t('Essential').toLowerCase()} · ${muscleCounts[selectedMuscle]?.primary || 0} ${t('Primary target').toLowerCase()}`
              : t('Choose a muscle to see exercises that train it.')}
          </div>
        </div>
        <div className="row" style={{ gap: 6, flexShrink: 0 }}>
          {selectedMuscle && <Button size="sm" variant="ghost" onClick={() => setSelectedMuscle(null)}>{t('Clear selection')}</Button>}
          <Button size="sm" variant="ghost" trailingIcon={mapOpen ? 'chevronUp' : 'chevronDown'} onClick={() => setMapOpen(v => !v)}>
            {mapOpen ? t('Hide map') : t('Show map')}
          </Button>
        </div>
      </div>

      {mapOpen && <>
        <BodyMap className="tappable" body={S.body} selected={selectedMuscle} onMuscle={pickMuscle} />
        <div className="row" style={{ gap: 6, marginTop: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {MUSCLES.map(m => {
            const on = selectedMuscle === m
            const cnt = tier === 'essential' ? muscleCounts[m]?.essential : muscleCounts[m]?.primary
            return (
              <button
                key={m}
                type="button"
                className={'muscle-pill' + (on ? ' on' : '')}
                aria-pressed={on}
                onClick={() => pickMuscle(m)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '6px 12px',
                  borderRadius: 999,
                  fontSize: 'var(--fs-caption)',
                  fontWeight: 600,
                  border: '1px solid ' + (on ? 'var(--acc)' : 'var(--sep)'),
                  background: on ? 'var(--acc)' : 'var(--surface-2)',
                  color: on ? 'var(--on-acc)' : 'var(--label)',
                  cursor: 'pointer',
                }}
              >
                {t(MUSCLE_NAME[m])} <span style={{ opacity: on ? 0.9 : 0.6 }}>{cnt}</span>
              </button>
            )
          })}
        </div>
      </>}
    </div>

    {selectedMuscle && <MuscleComboCard muscle={selectedMuscle} onDetail={exerciseDetailSheet} />}

    {/* Beginner Curation & Setup Filter Bar */}
    <div className="lib-guide-bar" style={{ marginBottom: 10 }}>
      <Segmented
        className="seg-range"
        value={tier}
        onChange={v => { setTier(v); setShown(40) }}
        options={[
          { value: 'all', label: t('All exercises') },
          { value: 'essential', label: '⭐ ' + t('Beginner essentials') },
          { value: 'compound', label: '🎯 ' + t('Compound lifts') },
        ]}
      />
      <div className="row" style={{ gap: 6, marginTop: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {QUICK_SCENES.map(sc => (
          <button
            key={sc.id}
            type="button"
            className={'scene-pill' + (scene === sc.id ? ' on' : '')}
            aria-pressed={scene === sc.id}
            onClick={() => { setScene(sc.id); setShown(40) }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              whiteSpace: 'nowrap',
              padding: '5px 10px',
              borderRadius: 999,
              fontSize: 'var(--fs-caption)',
              fontWeight: 600,
              border: '1px solid ' + (scene === sc.id ? 'var(--acc)' : 'var(--sep)'),
              background: scene === sc.id ? 'var(--acc)' : 'var(--surface-2)',
              color: scene === sc.id ? 'var(--on-acc)' : 'var(--label)',
              cursor: 'pointer',
            }}
          >
            <Icon name={sc.icon} size={14} />
            <span>{t(sc.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>

    <div className="search-row" data-tour="lib-search" style={{ marginBottom: 10 }}><div className={'search' + (narrowed ? ' has-count' : '') + (q ? ' has-clear' : '')}><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      <input className="input" placeholder={t('Search…')} value={q} onChange={e => { setQ(e.target.value); setShown(40) }} />
      {narrowed && <span className="search-count" role="status" aria-label={exCount(f.length)}>{fmtNum(f.length)}</span>}
      {q && <button className="clear" onClick={() => { setQ(''); setShown(40) }} aria-label={t('Clear')}><Icon name="xmark" /></button>}</div>
      <ExerciseViewToggle /></div>
    {profile && <div className="small dim row" style={{ margin: '-4px 2px 10px', gap: 6, alignItems: 'center' }}>
      <Icon name="kettlebell" style={{ fontSize: 'var(--fs-footnote)' }} />
      {showAll ? t('Showing all equipment') : t('Showing what you have in "{0}"', profile.name)}
      <button className="chip nocap" style={{ marginInlineStart: 'auto', padding: '3px 10px', fontSize: 'var(--fs-caption)' }} onClick={() => setShowAll(v => !v)}>
        {showAll ? t('Filter by "{0}"', profile.name) : t('Show all equipment')}
      </button>
    </div>}
    <div className="chips lib-filters" data-tour="lib-filters" ref={bpStrip}>
      <button type="button" className={'chip nocap ichip lib-fbtn' + (sheetOn ? ' on' : '')} aria-haspopup="dialog" onClick={openFilters}>
        <Icon name="slider" />{t('Filters')}{sheetOn ? <span className="lib-fn">{sheetOn}</span> : null}
      </button>
      {catOn && <button type="button" className="chip on ichip" aria-label={t('Clear') + ': ' + t(catOn)} onClick={() => { setCat(''); setShown(40) }}>{t(catOn)}<Icon name="xmark" /></button>}
      {eqOn && <button type="button" className="chip on ichip" aria-label={t('Clear') + ': ' + t(eqOn)} onClick={() => { setEq(''); setShown(40) }}>{t(eqOn)}<Icon name="xmark" /></button>}
      {BODYPARTS.map(b => <button key={b} className={'chip' + (bp === b ? ' on ichip' : '')} aria-pressed={bp === b}
        onClick={() => { setBp(bp === b ? '' : b); setShown(40) }}>{t(b)}{bp === b && <Icon name="xmark" />}</button>)}
    </div>
    <div className={'list' + (S.exerciseView === 'cards' ? ' ex-grid' : '')}>
      <div className="item ex-new" data-tour="lib-new" {...tappable(() => customExSheet(null, ex => exerciseDetailSheet(ex), q.trim()))}>
        <div className="thumb thumb-x"><Icon name="plusCircle" /></div>
        <div className="grow"><div className="tt">{t('Create your own exercise')}</div><div className="ss">{t('name + body part, and a photo or video if you like')}</div></div><Icon name="plus" className="chev" />
      </div>
      {f.slice(0, shown).map(row)}
      {f.length === 0 && !similar.length && <div className="empty"><div className="ico"><Icon name="magnifier" /></div>{t('No match')}</div>}
      {similar.length > 0 && <h4 className="sec similar-label">{f.length ? t('Similar exercises') : t('No exact match. These come close:')}</h4>}
      {similar.map(row)}
    </div>
    {f.length > shown && <><div style={{ height: 10 }} /><Button ref={moreRef} onClick={() => setShown(s => s + 40)}>{t('Show more')}</Button></>}
  </>
}


// The Library's Filters sheet (P7): the kind of exercise and the equipment, as wrapping chips. Every
// tap filters the list behind it at once; Done only closes.
function LibraryFilters({ close, cat, eq, filtersFor, onChange }) {
  const [c, setC] = useState(cat)
  const [e, setE] = useState(eq)
  const { catOpts, catOn, eqOpts, eqOn } = filtersFor(c, e)
  const set = (nc, ne) => { setC(nc); setE(ne); onChange(nc, ne) }
  return <div className="lib-fsheet">
    <h3>{t('Filters')}</h3>
    {catOpts.length > 1 && <>
      <h4 className="sec">{t('Exercise type')}</h4>
      <div className="chips wrap">
        <button type="button" className={'chip nocap' + (!catOn ? ' on' : '')} aria-pressed={!catOn} onClick={() => set('', e)}>{t('Any type')}</button>
        {catOpts.map(x => <button type="button" key={x} className={'chip' + (catOn === x ? ' on' : '')} aria-pressed={catOn === x} onClick={() => set(x, e)}>{t(x)}</button>)}
      </div>
    </>}
    {eqOpts.length > 1 && <>
      <h4 className="sec">{t('Equipment')}</h4>
      <div className="chips wrap">
        <button type="button" className={'chip nocap' + (!eqOn ? ' on' : '')} aria-pressed={!eqOn} onClick={() => set(c, '')}>{t('Any equipment')}</button>
        {eqOpts.map(x => <button type="button" key={x} className={'chip' + (eqOn === x ? ' on' : '')} aria-pressed={eqOn === x} onClick={() => set(c, x)}>{t(x)}</button>)}
      </div>
    </>}
    <div style={{ height: 16 }} />
    <Button variant="primary" onClick={close}>{t('Done')}</Button>
    {(catOn || eqOn) && <Button variant="ghost" className="dim" style={{ marginTop: 6 }} onClick={() => set('', '')}>{t('Clear filters')}</Button>}
  </div>
}
