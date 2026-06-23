import { User, Search, Brain, Zap, Ticket, Printer, Check, Laptop } from 'lucide-react'
import { useSession } from '../store.jsx'
import { getScenario } from '../data/scenarios.js'

export default function Kiosk() {
  const { state, dispatch } = useSession()
  const sc = getScenario(state.scenarioId)
  const number = state.ticket?.number || '—'

  const attached = [
    { Icon: User, text: 'Customer profile + plan' },
    { Icon: Search, text: 'Diagnosis from the front desk' },
    { Icon: Brain, text: 'Recommendations + prepared offer' },
    sc.diagnosis.some((d) => state.captured[d.id]?.flag === 'priority')
      ? { Icon: Zap, text: 'Queue flag: priority care (urgent)' }
      : { Icon: Ticket, text: 'Queue position with attached data' },
  ]

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-6 py-10">
      <div className="anim-fadeIn mb-4 flex items-center gap-2 text-[13px] font-medium text-white/70">
        <Printer className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" /> Printing your queue ticket...
      </div>

      {/* printer slot — the ticket below appears to feed out of it */}
      <div className="printer-slot z-10 w-full max-w-[300px] shadow-lg" aria-hidden="true" />

      {/* printed ticket */}
      <div className="anim-ticket -mt-1 w-full max-w-[300px] origin-top rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-dashed border-line pb-3">
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-true text-xs font-bold text-white">
              T
            </div>
            <span className="text-[12px] font-bold text-ink">True Shop</span>
          </div>
          <span className="text-[11px] text-ink-soft">Queue ticket</span>
        </div>

        <div className="py-5 text-center">
          <div className="text-[11px] font-medium uppercase tracking-wider text-ink-mute">
            Your queue number
          </div>
          <div className="tnum mt-1 text-[56px] font-extrabold leading-none tracking-tight text-true">
            {number}
          </div>
          <div className="mt-2 inline-block rounded-full bg-cloud px-3 py-1 text-[12px] font-semibold text-ink-soft">
            {sc.title}
          </div>
        </div>

        <div className="rounded-xl bg-emerald-50 p-3">
          <div className="mb-2 flex items-center justify-center gap-1.5 text-center text-[12px] font-bold text-emerald-800">
            <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" /> The full context is attached to this ticket
          </div>
          <div className="space-y-1.5">
            {attached.map((a, i) => {
              const Icon = a.Icon
              return (
              <div key={i} className="flex items-center gap-2 text-[12px] text-emerald-900">
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {a.text}
              </div>
              )
            })}
          </div>
        </div>

        <div className="mt-3 border-t border-dashed border-line pt-3 text-center text-[10px] leading-relaxed text-ink-mute">
          When the customer is called, Service sees everything instantly
          <br />
          no need to repeat the story
        </div>
      </div>

      <button
        onClick={() => dispatch({ type: 'GO', stage: 'service' })}
        className="anim-fadeUp mt-7 flex w-full max-w-[300px] items-center justify-center gap-1.5 rounded-xl bg-white py-3.5 text-[15px] font-bold text-slate-900 shadow-lg transition active:scale-[0.98]"
        style={{ animationDelay: '0.5s' }}
      >
        <Laptop className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Customer called → go to Service
      </button>
    </div>
  )
}
