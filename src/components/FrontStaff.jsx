import {
  Tablet,
  RotateCcw,
  IdCard,
  ChevronRight,
  Phone,
  Brain,
  Check,
  CheckCircle2,
  ClipboardList,
  Ticket as TicketIcon,
  Gift,
  Sparkles,
} from 'lucide-react'
import { useSession, makeQueueNumber } from '../store.jsx'
import { getScenario } from '../data/scenarios.js'
import { RoleBar, Suggestion, SectionLabel } from './ui.jsx'
import { getIcon } from './icons.jsx'

export default function FrontStaff() {
  const { state, dispatch } = useSession()
  const sc = getScenario(state.scenarioId)
  const looked = state.looked

  const steps = sc.diagnosis
  const step = state.step
  const done = step >= steps.length
  const current = done ? null : steps[step]

  const sendToQueue = () => {
    dispatch({ type: 'ISSUE_TICKET', number: makeQueueNumber(sc.id), ts: Date.now() })
  }

  return (
    <div className="flex flex-1 flex-col">
      <RoleBar
        device={<Tablet className="h-5 w-5" aria-hidden="true" />}
        role="Front-desk staff · The Welcomer"
        sub="Tablet · True Shop CentralWorld"
        right={
          <button
            onClick={() => dispatch({ type: 'RESTART_WELCOMER' })}
            className="inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-[12px] font-medium text-ink-mute active:scale-95"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Restart
          </button>
        }
      />

      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        {/* walk-in context */}
        <div className="anim-fadeUp rounded-2xl border border-line bg-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{sc.walkIn.emoji}</span>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-ink-soft">{sc.walkIn.headline}</div>
              <div className="text-[11px] text-true">Mood: {sc.walkIn.mood}</div>
            </div>
          </div>
          <p className="mt-3 rounded-xl bg-cloud px-3 py-2.5 text-[14px] italic leading-relaxed text-ink">
            “{sc.walkIn.quote}”
          </p>
        </div>

        {!looked ? (
          /* ---- identify gate: ID reader OR phone ---- */
          <div className="anim-fadeUp rounded-2xl border border-line bg-white p-4 shadow-card">
            <SectionLabel>Identify the customer — before any queue ticket</SectionLabel>

            <button
              onClick={() => dispatch({ type: 'LOOKUP', method: 'idcard' })}
              className="flex w-full items-center gap-3 rounded-xl border border-true/30 bg-true-soft px-3.5 py-3 text-left transition active:scale-[0.98]"
            >
              <IdCard className="h-6 w-6 shrink-0 text-true" strokeWidth={1.75} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-ink">Insert ID card (ID Reader)</span>
                <span className="block text-[11px] text-ink-soft">Pulls the profile automatically in 1 second</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-true" strokeWidth={2} aria-hidden="true" />
            </button>

            <div className="my-3 flex items-center gap-2 text-[11px] text-ink-soft/50">
              <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-line bg-cloud px-3 py-2.5 transition focus-within:ring-2 focus-within:ring-true">
              <Phone className="h-4 w-4 text-ink-soft" strokeWidth={1.75} aria-hidden="true" />
              <input
                defaultValue={sc.customer.phone}
                inputMode="tel"
                aria-label="Customer phone number"
                className="w-full bg-transparent text-base font-medium text-ink outline-none"
              />
            </div>
            <button
              onClick={() => dispatch({ type: 'LOOKUP', method: 'phone' })}
              className="mt-3 w-full rounded-xl bg-true py-3 text-[15px] font-bold text-white shadow-sm transition active:scale-[0.98]"
            >
              Search by phone number
            </button>
            <p className="mt-2 text-center text-[11px] text-ink-mute">
              If the customer booked through <b>True Queue</b>, their details arrive with the queue automatically.
            </p>
          </div>
        ) : (
          <>
            {/* ---- retrieved profile ---- */}
            <div className="anim-pop rounded-2xl border border-line bg-white p-4 shadow-card">
              <div className="mb-2 flex items-center justify-between">
                <SectionLabel>Customer profile (from the system)</SectionLabel>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {state.idMethod === 'idcard' ? 'Via ID card' : 'Via phone number'}
                </span>
              </div>
              <div className="text-[16px] font-bold text-ink">{sc.customer.name}</div>
              <div className="text-[12px] text-ink-soft">{sc.customer.phone}</div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Field k="Plan" v={sc.customer.plan} />
                <Field k="Tenure" v={sc.customer.tenure} />
                <Field k="Monthly spend" v={sc.customer.arpu} />
                <Field k="Segment" v={sc.customer.segment} />
              </div>

              <div className="mt-3 rounded-xl bg-violet-50 p-3">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-700">
                  <Brain className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> System insight
                </div>
                <ul className="space-y-1">
                  {sc.customer.insights.map((it, i) => (
                    <li key={i} className="flex gap-1.5 text-[13px] leading-snug text-violet-900">
                      <span className="text-violet-400">•</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ---- guided diagnosis ---- */}
            <div className="anim-fadeUp rounded-2xl border border-line bg-white p-4 shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <SectionLabel>Front-desk diagnosis</SectionLabel>
                <div className="flex gap-1">
                  {steps.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i < step ? 'w-5 bg-true' : i === step ? 'w-5 bg-true/40' : 'w-1.5 bg-line'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* answered chips */}
              {step > 0 && (
                <div className="mb-3 flex flex-col gap-1.5">
                  {steps.slice(0, step).map((s) => {
                    const a = state.captured[s.id]
                    return (
                      <div
                        key={s.id}
                        className="flex items-center gap-2 rounded-lg bg-cloud px-3 py-1.5 text-[13px]"
                      >
                        <Check className="h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.5} aria-hidden="true" />
                        <span className="text-ink-soft">{a?.captureLabel}:</span>
                        <span className="font-semibold text-ink">{a?.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {current ? (
                <div key={current.id} className="anim-fadeIn">
                  <div className="mb-2.5 flex items-center gap-2 text-[15px] font-bold text-ink">
                    {(() => {
                      const QIcon = getIcon(current.icon)
                      return <QIcon className="h-4 w-4 shrink-0 text-true" strokeWidth={2} aria-hidden="true" />
                    })()}
                    {current.q}
                  </div>
                  <div className="flex flex-col gap-2">
                    {current.options.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => dispatch({ type: 'SELECT_OPTION', option: o })}
                        className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-left text-[14px] font-medium text-ink transition active:scale-[0.98] hover:border-true/40 hover:bg-true-soft"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="anim-pop rounded-xl bg-emerald-50 p-3.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[14px] font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Diagnosis complete
                  </div>
                  <div className="mt-0.5 text-[12px] text-emerald-700">Ready to hand off to Service</div>
                </div>
              )}
            </div>

            {/* ---- live suggestions ---- */}
            {state.suggestions.length > 0 && (
              <div className="anim-fadeUp">
                <div className="mb-2 flex items-center gap-2">
                  <SectionLabel>Live guidance · staff assist</SectionLabel>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-true">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-true" aria-hidden="true" /> LIVE
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {state.suggestions.map((s, i) => (
                    <Suggestion key={i} s={s} />
                  ))}
                </div>
              </div>
            )}

            {/* ---- promotion-overwhelm solver ---- */}
            {done && sc.promoMatch && <PromoSolver sc={sc} revealed={state.promoRevealed} onReveal={() => dispatch({ type: 'REVEAL_PROMO' })} />}

            {/* ---- handoff + queue ---- */}
            {done && (
              <div className="anim-fadeUp sticky bottom-0 -mx-4 mt-1 border-t border-line bg-white/95 px-4 pb-4 pt-3 backdrop-blur">
                <div className="mb-3 rounded-xl border border-true/20 bg-true-soft p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-true">
                    <ClipboardList className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Handoff summary for Service
                  </div>
                  <p className="text-[13px] leading-relaxed text-ink">{sc.handoff.summary}</p>
                </div>
                <button
                  onClick={sendToQueue}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-true py-3.5 text-[16px] font-bold text-white shadow-pop transition active:scale-[0.98]"
                >
                  <TicketIcon className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Hand off to Service + print queue ticket
                </button>
                <p className="mt-2 text-center text-[11px] text-ink-mute">
                  Print a ticket only when a handoff is needed — if it can be resolved at the front desk, no ticket at all.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function PromoSolver({ sc, revealed, onReveal }) {
  const pm = sc.promoMatch
  if (!revealed) {
    return (
      <div className="anim-fadeUp rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2 text-[14px] font-bold text-amber-900">
          <Gift className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" /> Too many promotions to choose from?
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-amber-900/90">
          {pm.poolNote} — the system filters to only what fits this customer, so even new staff can recommend accurately.
        </p>
        <button
          onClick={onReveal}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-3 text-[14px] font-bold text-white shadow-sm transition active:scale-[0.98]"
        >
          <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Auto-filter the right promotions
        </button>
      </div>
    )
  }
  return (
    <div className="anim-pop rounded-2xl border border-amber-200 bg-white p-4 shadow-card">
      <div className="mb-1 flex items-center justify-between">
        <SectionLabel>Matched promotions (filtered)</SectionLabel>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
          from {pm.poolNote}
        </span>
      </div>
      <p className="mb-2.5 text-[12px] text-ink-soft">Why selected: {pm.reason}</p>
      <div className="flex flex-col gap-2.5">
        {pm.matched.map((m, i) => (
          <div key={i} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="text-[14px] font-bold text-ink">{m.name}</div>
              <span className="shrink-0 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {m.badge}
              </span>
            </div>
            <div className="mt-1 text-[13px] font-semibold text-amber-800">{m.price}</div>
            <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">{m.why}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ k, v }) {
  return (
    <div className="rounded-lg bg-cloud px-3 py-2">
      <div className="text-[10px] text-ink-mute">{k}</div>
      <div className="tnum text-[13px] font-semibold leading-snug text-ink">{v}</div>
    </div>
  )
}
