import { Laptop, Zap, ArrowRight, MessageCircle, Check, Wallet, BarChart3 } from 'lucide-react'
import { useSession } from '../store.jsx'
import { getScenario } from '../data/scenarios.js'
import { RoleBar, SectionLabel } from './ui.jsx'

export default function ServiceStaff() {
  const { state, dispatch } = useSession()
  const sc = getScenario(state.scenarioId)
  const number = state.ticket?.number || '—'
  const captured = sc.diagnosis.map((d) => state.captured[d.id]).filter(Boolean)
  const allDone = sc.service.steps.every((_, i) => state.serviceDone[i])

  return (
    <div className="flex flex-1 flex-col">
      <RoleBar
        device={<Laptop className="h-5 w-5" aria-hidden="true" />}
        role="Service Staff"
        sub="Laptop · Service counter"
        accent="#1f2937"
        right={
          <span className="tnum rounded-lg bg-true px-2.5 py-1 text-[13px] font-extrabold text-white">
            {number}
          </span>
        }
      />

      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        {/* magic moment */}
        <div className="anim-pop rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-[14px] font-bold text-emerald-800">
            <Zap className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" /> Front-desk context ready
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-emerald-900">
            The customer just sat down — and you already know everything. <b>No need to ask again. No need for them to repeat.</b>
          </p>
        </div>

        {/* customer continuity */}
        <div className="anim-fadeUp rounded-2xl border border-line bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[16px] font-bold text-ink">{sc.customer.name}</div>
              <div className="text-[12px] text-ink-soft">
                {sc.customer.plan} · {sc.customer.segment}
              </div>
            </div>
            <span className="text-2xl">{sc.walkIn.emoji}</span>
          </div>

          <div className="mt-3.5">
            <SectionLabel>Front-desk summary</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {captured.map((a, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-lg bg-cloud px-2.5 py-1 text-[12px]"
                >
                  <span className="text-ink-mute">{a.captureLabel}:</span>
                  <span className="font-semibold text-ink">{a.label}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-true/15 bg-true-soft p-3">
            <p className="text-[13px] leading-relaxed text-ink">{sc.handoff.summary}</p>
            <div className="mt-2 flex items-start gap-1.5 text-[12px] font-semibold text-true">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" /> {sc.handoff.nextAction}
            </div>
          </div>
        </div>

        {/* greeting */}
        <div className="anim-fadeUp rounded-2xl border border-blue-200 bg-blue-50 p-3.5">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-blue-700">
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Open with this
          </div>
          <p className="text-[14px] italic leading-relaxed text-blue-950">“{sc.service.greeting}”</p>
        </div>

        {/* service checklist */}
        <div className="anim-fadeUp rounded-2xl border border-line bg-white p-4 shadow-card">
          <SectionLabel>Steps to complete (tap to check off)</SectionLabel>
          <div className="flex flex-col gap-2">
            {sc.service.steps.map((s, i) => {
              const checked = !!state.serviceDone[i]
              return (
                <button
                  key={i}
                  onClick={() => dispatch({ type: 'TOGGLE_SERVICE', i })}
                  className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition active:scale-[0.99] ${
                    checked ? 'border-emerald-200 bg-emerald-50' : 'border-line bg-white'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      checked
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-ink-soft/30'
                    }`}
                  >
                    {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />}
                  </span>
                  <div className="min-w-0">
                    <div className={`text-[14px] font-semibold ${checked ? 'text-emerald-900' : 'text-ink'}`}>
                      {s.label}
                    </div>
                    <div className="text-[12px] leading-snug text-ink-soft">{s.detail}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* upsell */}
        <div className="anim-fadeUp rounded-2xl border border-emerald-200 bg-white p-4 shadow-card">
          <div className="mb-2 flex items-center gap-2">
            <Wallet className="h-5 w-5 shrink-0 text-emerald-700" strokeWidth={1.75} aria-hidden="true" />
            <span className="text-[14px] font-bold text-emerald-800">Upsell opportunity (from front-desk data)</span>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3">
            <div className="text-[12px] text-emerald-700">Trigger: {sc.service.upsell.trigger}</div>
            <p className="mt-1.5 text-[14px] italic leading-relaxed text-emerald-950">
              “{sc.service.upsell.line}”
            </p>
            <div className="mt-2 inline-block rounded-lg bg-emerald-600 px-3 py-1 text-[12px] font-bold text-white">
              {sc.service.upsell.offer}
            </div>
          </div>
        </div>

        {/* close */}
        <div className="anim-fadeUp sticky bottom-0 -mx-4 mt-1 border-t border-line bg-white/95 px-4 pb-4 pt-3 backdrop-blur">
          {!allDone && (
            <p className="mb-2 text-center text-[11px] text-ink-mute">
              Check off all steps, or close the case to see the outcome.
            </p>
          )}
          <button
            onClick={() => dispatch({ type: 'GO', stage: 'impact' })}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-true py-3.5 text-[16px] font-bold text-white shadow-pop transition active:scale-[0.98]"
          >
            <BarChart3 className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" /> {sc.service.resolution.title} → See outcome
          </button>
        </div>
      </div>
    </div>
  )
}
