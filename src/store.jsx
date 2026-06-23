import { createContext, useContext, useEffect, useReducer } from 'react'
import { getScenario } from './data/scenarios.js'

const KEY = 'tw-session-v1'

const initial = {
  // ── The Welcomer (staff iPad) flow ──
  stage: 'intro', // intro | front | kiosk | service | impact
  scenarioId: null,
  idMethod: null, // 'phone' | 'idcard' — how the customer was identified
  looked: false, // front-staff customer lookup performed
  step: 0, // current diagnosis step index
  captured: {}, // keyed by step id → { value, label, captureLabel, flag }
  suggestions: [], // [{ kind, text }]
  promoRevealed: false, // promotion-overwhelm solver opened
  ticket: null, // { number, ts }
  serviceDone: {}, // { stepIndex: true }
}

function load() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) return { ...initial, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return initial
}

function mergeSuggestions(existing, incoming) {
  const out = [...existing]
  for (const s of incoming || []) {
    if (!out.some((m) => m.text === s.text)) out.push(s)
  }
  return out
}

function reducer(state, action) {
  switch (action.type) {
    case 'RESTART_WELCOMER':
      return { ...initial, stage: 'intro' }

    case 'PICK_SCENARIO':
      return { ...initial, scenarioId: action.id, stage: 'front', step: 0 }

    case 'LOOKUP':
      return { ...state, looked: true, idMethod: action.method || 'phone' }

    case 'SELECT_OPTION': {
      const sc = getScenario(state.scenarioId)
      const stepDef = sc.diagnosis[state.step]
      const opt = action.option
      const captured = {
        ...state.captured,
        [stepDef.id]: {
          value: opt.value,
          label: opt.label,
          captureLabel: stepDef.captureLabel,
          flag: opt.flag || null,
        },
      }
      return {
        ...state,
        captured,
        suggestions: mergeSuggestions(state.suggestions, opt.suggests),
        step: state.step + 1,
      }
    }

    case 'REVEAL_PROMO':
      return { ...state, promoRevealed: true }

    case 'ISSUE_TICKET':
      return { ...state, ticket: { number: action.number, ts: action.ts }, stage: 'kiosk' }

    case 'GO':
      return { ...state, stage: action.stage }

    case 'TOGGLE_SERVICE':
      return {
        ...state,
        serviceDone: { ...state.serviceDone, [action.i]: !state.serviceDone[action.i] },
      }

    case 'RESET':
      return { ...initial }

    default:
      return state
  }
}

const Ctx = createContext(null)

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useSession() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}

export { makeQueueNumber } from './data/scenarios.js'
