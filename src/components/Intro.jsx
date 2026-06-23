import { Tablet, Ticket, Laptop, BarChart3, ChevronRight } from 'lucide-react'
import { useSession } from '../store.jsx'
import { WELCOMER_SCENARIOS } from '../data/scenarios.js'
import { Brand, Tag } from './ui.jsx'

const FLOW = [
  { Icon: Tablet, t: 'Greet + diagnose' },
  { Icon: Ticket, t: 'Queue (if needed)' },
  { Icon: Laptop, t: 'Service' },
  { Icon: BarChart3, t: 'Impact' },
]

export default function Intro() {
  const { dispatch } = useSession()

  return (
    <div className="flex flex-1 flex-col px-5 pb-10 pt-7">
      <div className="anim-fadeUp flex items-center justify-between">
        <Brand sub="The Welcomer" />
      </div>

      <div className="anim-fadeUp mt-6" style={{ animationDelay: '0.05s' }}>
        <h1 className="text-[24px] font-bold leading-tight text-ink">
          Start serving from
          <br />
          the customer&rsquo;s first step
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Staff greet and diagnose on a tablet <b className="text-ink">before issuing a queue ticket</b> (a ticket is only printed when a handoff is needed).
          The system surfaces the right promotion, then <b className="text-ink">passes everything to Service</b> so they can act right away.
        </p>
      </div>

      {/* flow strip */}
      <div className="anim-fadeUp mt-6 flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3.5 shadow-card" style={{ animationDelay: '0.1s' }}>
        {FLOW.map((f, i) => {
          const Icon = f.Icon
          return (
          <div key={f.t} className="flex items-center">
            <div className="flex flex-col items-center gap-1 text-center">
              <Icon className="h-5 w-5 text-ink-soft" strokeWidth={1.75} aria-hidden="true" />
              <span className="text-[10px] font-medium leading-tight text-ink-soft">{f.t}</span>
            </div>
            {i < FLOW.length - 1 && <span className="mx-1 text-ink-soft/40">→</span>}
          </div>
          )
        })}
      </div>

      <div className="anim-fadeUp mt-8" style={{ animationDelay: '0.16s' }}>
        <div className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-mute">
          Choose a scenario to walk through
        </div>
        <div className="flex flex-col gap-3.5">
          {WELCOMER_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => dispatch({ type: 'PICK_SCENARIO', id: s.id })}
              className="group w-full rounded-2xl border border-line bg-white p-4 text-left shadow-card transition active:scale-[0.985] hover:border-ink/15 hover:shadow-pop"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                  style={{ background: `${s.accent}12` }}
                >
                  {s.walkIn.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-ink">{s.title}</span>
                  </div>
                  <div className="mt-0.5">
                    <Tag color={s.accent}>{s.tag}</Tag>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[13px] italic leading-snug text-ink-soft">
                    “{s.walkIn.quote}”
                  </p>
                </div>
                <ChevronRight
                  className="mt-1 h-5 w-5 shrink-0 text-ink-soft/40 transition group-hover:translate-x-0.5 group-hover:text-true"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
