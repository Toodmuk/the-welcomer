import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  Phone,
  IdCard,
  UserPlus,
  ArrowRight,
  Sparkles,
  MapPin,
  Ticket as TicketIcon,
  Check,
  Store,
  Clock,
  CircleUserRound,
  RotateCcw,
} from 'lucide-react'
import {
  STATES,
  NEEDS,
  SOLVER_QUESTIONS,
  SOLVER_LABEL,
  rankPlans,
  makeTicket,
} from '../data/welcomer.js'
import { Brand, SectionLabel } from './ui.jsx'
import { getIcon } from './icons.jsx'

// ── shared header ──────────────────────────────────────────────────────────
function Header({ onBack, title, right }) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-line bg-white/90 px-4 py-3 backdrop-blur">
      {onBack ? (
        <button
          onClick={onBack}
          className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-ink-soft active:scale-90"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
        </button>
      ) : (
        <Brand sub="Welcomer" small />
      )}
      {title && <div className="text-[15px] font-bold text-ink">{title}</div>}
      <div className="ml-auto">{right}</div>
    </div>
  )
}

function ShiftPill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
      <span className="relative flex h-2 w-2">
        <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      On shift · CentralWorld
    </span>
  )
}

export default function Welcomer() {
  const [stage, setStage] = useState('home') // home | greet | solve | handover
  const [idMethod, setIdMethod] = useState(null) // 'phone' | 'id' | 'guest'
  const [phone, setPhone] = useState('')
  const [states, setStates] = useState([]) // selected state ids
  const [needId, setNeedId] = useState(null)
  const [solver, setSolver] = useState({}) // { questionId: bool }
  const [pickedPlan, setPickedPlan] = useState(null) // plan id chosen by staff
  const [outcome, setOutcome] = useState(null) // { mode, dest, ticket }

  const need = needId ? NEEDS.find((n) => n.id === needId) : null
  const linked = idMethod === 'id' || (idMethod === 'phone' && phone.trim().length >= 4)
  const ranked = useMemo(() => rankPlans(solver), [solver])
  const picked = pickedPlan ? ranked.find((p) => p.id === pickedPlan) || null : null

  const reset = () => {
    setIdMethod(null)
    setPhone('')
    setStates([])
    setNeedId(null)
    setSolver({})
    setPickedPlan(null)
    setOutcome(null)
  }

  const startGreet = () => {
    reset()
    setStage('greet')
  }

  const continueFromGreet = () => {
    if (!need) return
    if (need.promo) setStage('solve')
    else setStage('handover')
  }

  if (stage === 'home') return <Home onStart={startGreet} />

  if (stage === 'greet')
    return (
      <Greet
        idMethod={idMethod}
        setIdMethod={setIdMethod}
        phone={phone}
        setPhone={setPhone}
        linked={linked}
        states={states}
        setStates={setStates}
        needId={needId}
        setNeedId={setNeedId}
        need={need}
        onBack={() => setStage('home')}
        onContinue={continueFromGreet}
      />
    )

  if (stage === 'solve')
    return (
      <Solve
        solver={solver}
        setSolver={setSolver}
        ranked={ranked}
        pickedPlan={pickedPlan}
        setPickedPlan={setPickedPlan}
        onBack={() => setStage('greet')}
        onContinue={() => setStage('handover')}
      />
    )

  return (
    <Handover
      linked={linked}
      idMethod={idMethod}
      phone={phone}
      states={states}
      need={need}
      picked={picked}
      outcome={outcome}
      setOutcome={setOutcome}
      onBack={() => setStage(need?.promo ? 'solve' : 'greet')}
      onNext={startGreet}
      onHome={() => {
        reset()
        setStage('home')
      }}
    />
  )
}

// ── Home — the greeter's starting point ─────────────────────────────────────
function Home({ onStart }) {
  return (
    <div className="flex flex-1 flex-col">
      <Header right={<ShiftPill />} />
      <div className="flex flex-1 flex-col px-6 pb-10 pt-8 sm:px-8">
        <div className="anim-fadeUp">
          <h1 className="text-[28px] font-bold leading-tight text-ink">Serve from the first step</h1>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">
            Walk up, read what the customer needs, and route them on the spot — before they ever hunt for a
            ticket machine. Quick things get solved at a booth; only complex cases take a queue number.
          </p>
        </div>

        {/* today's deflection — shows the value of greeting first */}
        <div className="anim-fadeUp mt-7 grid grid-cols-3 gap-3" style={{ animationDelay: '0.08s' }}>
          <Stat value="18" label="Greeted today" />
          <Stat value="12" label="Solved at booth" accent />
          <Stat value="6" label="Sent to queue" />
        </div>

        <div className="anim-fadeUp mt-auto pt-8" style={{ animationDelay: '0.16s' }}>
          <button
            onClick={onStart}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-true py-4 text-[17px] font-bold text-white shadow-pop transition active:scale-[0.98]"
          >
            <UserPlus className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" /> Greet a customer
          </button>
        </div>
      </div>
    </div>
  )
}

function Stat({ value, label, accent }) {
  return (
    <div className={`rounded-2xl border p-4 text-center ${accent ? 'border-true/20 bg-true-soft' : 'border-line bg-white'}`}>
      <div className={`tnum text-[26px] font-extrabold leading-none ${accent ? 'text-true' : 'text-ink'}`}>{value}</div>
      <div className="mt-1 text-[11px] font-medium text-ink-soft">{label}</div>
    </div>
  )
}

// ── Greet — identify + read state + need, with a live routing preview ────────
function Greet({
  idMethod, setIdMethod, phone, setPhone, linked,
  states, setStates, needId, setNeedId, need, onBack, onContinue,
}) {
  const toggleState = (id) =>
    setStates((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <div className="flex flex-1 flex-col">
      <Header onBack={onBack} title="New customer" right={<ShiftPill />} />
      <div className="flex flex-1 flex-col gap-6 px-5 py-5 sm:px-7">
        {/* A — identify */}
        <section className="anim-fadeUp">
          <SectionLabel>1 · Who's the customer?</SectionLabel>
          <div className="grid grid-cols-3 gap-2.5">
            <IdBtn active={idMethod === 'id'} onClick={() => setIdMethod('id')} icon={IdCard} label="Scan ID card" />
            <IdBtn active={idMethod === 'phone'} onClick={() => setIdMethod('phone')} icon={Phone} label="Phone number" />
            <IdBtn active={idMethod === 'guest'} onClick={() => setIdMethod('guest')} icon={CircleUserRound} label="Walk-in" />
          </div>

          {idMethod === 'phone' && (
            <div className="anim-fadeIn mt-3 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 transition focus-within:ring-2 focus-within:ring-true/40">
              <Phone className="h-4 w-4 shrink-0 text-ink-soft" strokeWidth={1.75} aria-hidden="true" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="08x-xxx-xxxx"
                className="w-full bg-transparent text-[16px] font-medium text-ink outline-none"
              />
            </div>
          )}

          {linked && (
            <div className="anim-fadeIn mt-3 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden="true" />
              <div className="text-[12px] leading-snug text-emerald-900">
                <b>Account linked.</b> Their plan &amp; history will follow them to whoever serves next — no
                repeating themselves.
              </div>
            </div>
          )}
          {idMethod === 'guest' && (
            <p className="anim-fadeIn mt-3 text-[12px] text-ink-soft">Walk-in / not a True number — continue without an account.</p>
          )}
        </section>

        {/* B — how they seem */}
        <section className="anim-fadeUp" style={{ animationDelay: '0.04s' }}>
          <SectionLabel>2 · How do they seem?</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {STATES.map((s) => {
              const Icon = getIcon(s.icon)
              const on = states.includes(s.id)
              return (
                <button
                  key={s.id}
                  onClick={() => toggleState(s.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition active:scale-[0.97] ${
                    on ? 'border-true bg-true-soft text-true' : 'border-line bg-white text-ink-soft hover:border-true/40'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" /> {s.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* C — what they need */}
        <section className="anim-fadeUp" style={{ animationDelay: '0.08s' }}>
          <SectionLabel>3 · What do they need?</SectionLabel>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {NEEDS.map((n) => {
              const Icon = getIcon(n.icon)
              const on = needId === n.id
              return (
                <button
                  key={n.id}
                  onClick={() => setNeedId(n.id)}
                  className={`flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition active:scale-[0.97] ${
                    on ? 'border-true bg-true-soft shadow-card' : 'border-line bg-white hover:border-true/40'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${on ? 'text-true' : 'text-ink-soft'}`} strokeWidth={1.75} aria-hidden="true" />
                  <span className={`text-[13px] font-bold leading-tight ${on ? 'text-true' : 'text-ink'}`}>{n.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* live routing preview */}
        {need && <RoutePreview need={need} states={states} />}

        <div className="sticky bottom-0 -mx-5 mt-auto border-t border-line bg-white/95 px-5 pb-4 pt-3 backdrop-blur sm:-mx-7 sm:px-7">
          <button
            onClick={onContinue}
            disabled={!need}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-true py-3.5 text-[16px] font-bold text-white shadow-pop transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-true/15 disabled:text-true/50 disabled:shadow-none"
          >
            {need?.promo ? (
              <>
                <Sparkles className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" /> Find the right plan
              </>
            ) : (
              <>
                Route &amp; hand over <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function IdBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition active:scale-[0.97] ${
        active ? 'border-true bg-true-soft text-true' : 'border-line bg-white text-ink-soft hover:border-true/40'
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
      <span className="text-[12px] font-semibold leading-tight">{label}</span>
    </button>
  )
}

function routeMeta(need) {
  if (need.complexity === 'quick')
    return {
      mode: 'booth',
      color: 'emerald',
      text: `Quick request (~${need.est} min) — resolve now at the ${need.dest}. No queue ticket needed.`,
    }
  if (need.complexity === 'complex')
    return {
      mode: 'queue',
      color: 'true',
      text: `Needs a counter (~${need.est} min) — issue a queue ticket to ${need.dest}, with this context attached.`,
    }
  return { mode: 'ask', color: 'slate', text: 'Staff to decide — solve at a booth if quick, or issue a ticket if it gets complex.' }
}

function RoutePreview({ need, states }) {
  const r = routeMeta(need)
  const tips = states.map((id) => STATES.find((s) => s.id === id)).filter((s) => s && s.tip)
  const tone =
    r.color === 'emerald'
      ? 'border-emerald-200 bg-emerald-50'
      : r.color === 'true'
      ? 'border-true/20 bg-true-soft'
      : 'border-slate-200 bg-slate-50'
  const Icon = r.mode === 'booth' ? Store : r.mode === 'queue' ? TicketIcon : MapPin
  const head = r.color === 'emerald' ? 'text-emerald-800' : r.color === 'true' ? 'text-true' : 'text-ink-soft'
  return (
    <section className={`anim-fadeIn rounded-2xl border p-4 ${tone}`}>
      <div className={`flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide ${head}`}>
        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Suggested routing
      </div>
      <p className="mt-1.5 text-[14px] leading-snug text-ink">{r.text}</p>
      {tips.length > 0 && (
        <div className="mt-3 border-t border-black/5 pt-2.5">
          {tips.map((t) => (
            <div key={t.id} className="flex items-start gap-1.5 text-[12px] leading-snug text-ink-soft">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-mute" /> {t.tip}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ── Solve — narrow 40+ promotions to the few that fit ────────────────────────
function Solve({ solver, setSolver, ranked, pickedPlan, setPickedPlan, onBack, onContinue }) {
  const toggle = (id) => setSolver((s) => ({ ...s, [id]: !s[id] }))
  return (
    <div className="flex flex-1 flex-col">
      <Header onBack={onBack} title="Match the right plan" right={<ShiftPill />} />
      <div className="flex flex-1 flex-col gap-5 px-5 py-5 sm:px-7">
        <div className="anim-fadeUp rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-violet-700">
            <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Promotion Solver
          </div>
          <p className="mt-1 text-[13px] leading-snug text-violet-900">
            Tap what fits this customer — we narrow <b>40+ plans</b> to the best options, so anyone can recommend accurately.
          </p>
        </div>

        <section className="anim-fadeUp" style={{ animationDelay: '0.04s' }}>
          <SectionLabel>What fits them?</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {SOLVER_QUESTIONS.map((q) => {
              const on = !!solver[q.id]
              return (
                <button
                  key={q.id}
                  onClick={() => toggle(q.id)}
                  className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition active:scale-[0.97] ${
                    on ? 'border-true bg-true-soft text-true' : 'border-line bg-white text-ink-soft hover:border-true/40'
                  }`}
                >
                  {q.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="anim-fadeUp flex-1" style={{ animationDelay: '0.08s' }}>
          <SectionLabel>{ranked.length ? `Top ${ranked.length} for this customer` : 'Best matches'}</SectionLabel>
          {!ranked.length ? (
            <div className="rounded-2xl border border-dashed border-line bg-white px-4 py-8 text-center text-[13px] text-ink-soft">
              Tap a read above to see matching plans.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {ranked.map((p, i) => {
                const on = pickedPlan === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setPickedPlan(on ? null : p.id)}
                    className={`rounded-2xl border p-3.5 text-left transition active:scale-[0.99] ${
                      on ? 'border-true bg-true-soft shadow-card' : 'border-line bg-white hover:border-true/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {i === 0 && (
                          <span className="rounded-full bg-true px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Best fit
                          </span>
                        )}
                        <span className="text-[15px] font-bold text-ink">{p.name}</span>
                      </div>
                      <span className="tnum text-[13px] font-bold text-ink-soft">{p.price}</span>
                    </div>
                    <div className="mt-1 text-[13px] text-ink">{p.data}</div>
                    <p className="mt-1.5 text-[12px] leading-snug text-ink-soft">{p.why}</p>
                    {p.matched.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.matched.map((m) => (
                          <span key={m} className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-true ring-1 ring-true/20">
                            ✓ {SOLVER_LABEL[m] || m}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </section>

        <div className="sticky bottom-0 -mx-5 mt-auto border-t border-line bg-white/95 px-5 pb-4 pt-3 backdrop-blur sm:-mx-7 sm:px-7">
          <button
            onClick={onContinue}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-true py-3.5 text-[16px] font-bold text-white shadow-pop transition active:scale-[0.98]"
          >
            Continue to hand over <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Handover — the summary the next staff sees + the routing action ──────────
function Handover({ linked, idMethod, phone, states, need, picked, outcome, setOutcome, onBack, onNext, onHome }) {
  const r = need ? routeMeta(need) : null
  const stateLabels = states.map((id) => STATES.find((s) => s.id === id)).filter(Boolean)
  const tips = stateLabels.filter((s) => s.tip)

  const resolveBooth = () => setOutcome({ mode: 'booth', dest: need.dest })
  const issueTicket = () => setOutcome({ mode: 'queue', dest: need.dest, ticket: makeTicket(need.id) })

  if (outcome) return <Outcome outcome={outcome} need={need} onNext={onNext} onHome={onHome} />

  return (
    <div className="flex flex-1 flex-col">
      <Header onBack={onBack} title="Hand-over summary" right={<ShiftPill />} />
      <div className="flex flex-1 flex-col gap-4 px-5 py-5 sm:px-7">
        <div className="anim-fadeUp rounded-2xl border border-line bg-white p-4 shadow-card">
          <SectionLabel>What the next staff sees</SectionLabel>
          <Row k="Customer" v={linked ? `Account linked${idMethod === 'phone' && phone ? ` · ${phone}` : ''}` : 'Walk-in / guest'} />
          <Row
            k="How they seem"
            v={stateLabels.length ? stateLabels.map((s) => s.label).join(' · ') : 'Not noted'}
          />
          <Row k="Need" v={need ? need.label : '—'} />
          {picked && <Row k="Suggested offer" v={`${picked.name} · ${picked.price}`} />}
        </div>

        {tips.length > 0 && (
          <div className="anim-fadeUp rounded-2xl border border-amber-200 bg-amber-50 p-4" style={{ animationDelay: '0.04s' }}>
            <div className="text-[11px] font-bold uppercase tracking-wide text-amber-700">How to handle</div>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {tips.map((t) => (
                <div key={t.id} className="flex items-start gap-1.5 text-[13px] leading-snug text-amber-900">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /> {t.tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* routing action */}
        <div className="anim-fadeUp mt-auto" style={{ animationDelay: '0.08s' }}>
          {r?.mode === 'booth' && (
            <ActionCard
              tone="emerald"
              icon={Store}
              title={`Resolve now at the ${need.dest}`}
              note={`Quick request (~${need.est} min) — no queue ticket needed.`}
              btn="Mark resolved at booth"
              onClick={resolveBooth}
            />
          )}
          {r?.mode === 'queue' && (
            <ActionCard
              tone="true"
              icon={TicketIcon}
              title={`Send to ${need.dest}`}
              note={`Complex case (~${need.est} min) — context travels with the ticket.`}
              btn="Issue queue ticket"
              onClick={issueTicket}
            />
          )}
          {r?.mode === 'ask' && (
            <div className="flex gap-2.5">
              <button
                onClick={resolveBooth}
                className="flex-1 rounded-xl bg-emerald-600 py-3.5 text-[15px] font-bold text-white shadow-pop transition active:scale-[0.98]"
              >
                Resolve at booth
              </button>
              <button
                onClick={issueTicket}
                className="flex-1 rounded-xl bg-true py-3.5 text-[15px] font-bold text-white shadow-pop transition active:scale-[0.98]"
              >
                Issue queue ticket
              </button>
            </div>
          )}
          <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-mute">
            The customer never repeats themselves — their context follows them to the booth or counter.
          </p>
        </div>
      </div>
    </div>
  )
}

function ActionCard({ tone, icon: Icon, title, note, btn, onClick }) {
  const wrap = tone === 'emerald' ? 'border-emerald-200 bg-emerald-50' : 'border-true/20 bg-true-soft'
  const head = tone === 'emerald' ? 'text-emerald-800' : 'text-true'
  const button = tone === 'emerald' ? 'bg-emerald-600' : 'bg-true'
  return (
    <div className={`rounded-2xl border p-4 ${wrap}`}>
      <div className={`flex items-center gap-2 text-[15px] font-bold ${head}`}>
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> {title}
      </div>
      <p className="mt-1 text-[13px] leading-snug text-ink-soft">{note}</p>
      <button
        onClick={onClick}
        className={`mt-3 w-full rounded-xl ${button} py-3.5 text-[16px] font-bold text-white shadow-pop transition active:scale-[0.98]`}
      >
        {btn}
      </button>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line py-2 last:border-0">
      <span className="text-[12px] text-ink-soft">{k}</span>
      <span className="text-right text-[13px] font-semibold text-ink">{v}</span>
    </div>
  )
}

// ── Outcome — booth resolved or ticket printed ───────────────────────────────
function Outcome({ outcome, need, onNext, onHome }) {
  const isQueue = outcome.mode === 'queue'
  return (
    <div className="flex flex-1 flex-col">
      <Header title="Done" right={<ShiftPill />} />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        {isQueue ? (
          <div className="anim-ticket w-full max-w-[300px] rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-center gap-1.5 border-b border-dashed border-line pb-3 text-[12px] font-bold text-ink">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-true text-[12px] text-white">T</span>
              True Shop · CentralWorld
            </div>
            <div className="py-4">
              <div className="text-[11px] font-medium uppercase tracking-wider text-ink-mute">Queue number</div>
              <div className="tnum mt-1 text-[52px] font-extrabold leading-none tracking-tight text-true">{outcome.ticket}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-cloud px-3 py-1 text-[12px] font-semibold text-ink-soft">
                <MapPin className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> {outcome.dest}
              </div>
            </div>
            <p className="border-t border-dashed border-line pt-3 text-[11px] leading-relaxed text-ink-mute">
              Context already attached — the counter sees everything when it's their turn.
            </p>
          </div>
        ) : (
          <div className="anim-pop flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-10 w-10 text-emerald-600" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-[22px] font-bold text-ink">Resolved at the booth</h2>
            <p className="mt-1 max-w-[34ch] text-[14px] leading-relaxed text-ink-soft">
              Handled on the spot at the <b className="text-ink">{outcome.dest}</b> — no queue ticket, no waiting.
            </p>
          </div>
        )}

        <div className="mt-8 flex w-full max-w-[320px] gap-2.5">
          <button
            onClick={onNext}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-true py-3 text-[14px] font-bold text-white shadow-pop transition active:scale-[0.98]"
          >
            <UserPlus className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" /> Greet next
          </button>
          <button
            onClick={onHome}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-white py-3 text-[13px] font-semibold text-ink-soft transition active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Home
          </button>
        </div>
      </div>
    </div>
  )
}
