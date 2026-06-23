// ─────────────────────────────────────────────────────────────────────────
// The Welcomer — a STAFF-DRIVEN floor tool, not a scripted demo.
// We can't predict who walks into a True Shop, so there are NO pre-baked
// customers/stories here. Instead the greeter captures the REAL person in
// front of them: how they seem (state) + what they need. The app then ROUTES
// (resolve now at a booth vs. issue a queue ticket) and, for plan/device
// needs, narrows 40+ promotions to the few that fit.
// ─────────────────────────────────────────────────────────────────────────

// ── How the customer seems (staff taps; multi-select). No names, no story. ──
export const STATES = [
  { id: 'relaxed', icon: 'smile', label: 'Relaxed', tip: null },
  { id: 'hurry', icon: 'clock', label: 'In a hurry', tip: 'Prioritise speed — take the fastest path, skip the small talk.' },
  { id: 'confused', icon: 'help', label: 'Confused / unsure', tip: 'Explain in plain steps and confirm understanding before acting.' },
  { id: 'upset', icon: 'frown', label: 'Upset / frustrated', tip: 'Acknowledge and listen first; slow down and don’t pitch yet.' },
  { id: 'assist', icon: 'accessibility', label: 'Needs extra help', tip: 'Assist hands-on (elderly / accessibility) — never send to a kiosk alone.' },
  { id: 'language', icon: 'globe', label: 'Language support', tip: 'Use English / visual aids and keep terms simple.' },
]

// ── What they came for (staff taps one). Drives routing + destination. ──
// complexity: 'quick' → resolve now at a standing booth (no ticket);
//             'complex' → issue a queue ticket to the right counter;
//             'ask' → staff decides.
export const NEEDS = [
  { id: 'bill', icon: 'receipt', label: 'Pay bill', complexity: 'quick', dest: 'Express booth', est: 3 },
  { id: 'number', icon: 'repeat', label: 'Change number', complexity: 'quick', dest: 'Standing booth', est: 4 },
  { id: 'esim', icon: 'smartphone', label: 'New SIM / eSIM', complexity: 'quick', dest: 'Standing booth', est: 6 },
  { id: 'plan', icon: 'signal', label: 'Change / renew plan', complexity: 'complex', dest: 'Sales & Advice', est: 12, promo: true },
  { id: 'device', icon: 'package', label: 'Buy / finance device', complexity: 'complex', dest: 'Device counter', est: 18, promo: true },
  { id: 'internet', icon: 'wifi', label: 'Signal / internet issue', complexity: 'complex', dest: 'Technical desk', est: 15 },
  { id: 'retention', icon: 'shieldcheck', label: 'Cancel / move carrier', complexity: 'complex', dest: 'Retention desk', est: 20 },
  { id: 'other', icon: 'help', label: 'Something else', complexity: 'ask', dest: 'Staff decides', est: 0 },
]

// ── Promotion Solver — quick reads the staff confirms with the customer.
// Each toggle weights the plan catalog, narrowing 40+ plans to the best few.
export const SOLVER_QUESTIONS = [
  { id: 'data', label: 'Uses lots of data / streams video' },
  { id: 'budget', label: 'Wants to keep it affordable' },
  { id: 'ent', label: 'Likes entertainment (Netflix / Viu / WeTV)' },
  { id: 'home', label: 'Multiple lines or whole-home internet' },
  { id: 'calls', label: 'Makes a lot of calls' },
  { id: 'travel', label: 'Travels / needs roaming' },
]

// ── Plan catalog (mirrors True's 5G line-up). weights keyed to solver answers. ──
export const PLANS = [
  { id: 's299', name: 'True 5G S 299', price: '฿299/mo', data: '15GB + social', tag: 'Light', why: 'Lowest commitment for light users.', weights: { budget: 3, data: -1 } },
  { id: 'm399', name: 'True 5G M 399', price: '฿399/mo', data: '30GB + 200 mins', tag: 'Everyday', why: 'Balanced data and calls for everyday use.', weights: { budget: 2, calls: 3, data: 1 } },
  { id: 'l599', name: 'True 5G L 599', price: '฿599/mo', data: '50GB + unlimited social', tag: 'Popular', why: 'All-rounder with lots of data and social.', weights: { data: 2, ent: 1, calls: 1 } },
  { id: 'max699', name: 'True 5G Max 699', price: '฿699/mo', data: 'Unlimited full-speed', tag: 'Heavy use', why: 'Unlimited full-speed — no overage for heavy users.', weights: { data: 4, travel: 1 } },
  { id: 'together999', name: 'True 5G Together 999', price: '฿999/mo', data: '2 lines · shared unlimited · home WiFi', tag: 'Household', why: 'Shares unlimited data across lines and bundles home internet.', weights: { home: 4, data: 2 } },
  { id: 'ent119', name: 'Entertainment+ add-on', price: '+฿119/mo', data: 'Netflix · Viu · WeTV', tag: 'Add-on', why: 'Adds streaming services — pairs with any plan.', weights: { ent: 4 } },
  { id: 'fiber599', name: 'True Gigatex Fiber 599', price: '฿599/mo', data: '1Gbps home fibre', tag: 'Home', why: 'Whole-home 1Gbps fibre.', weights: { home: 3 } },
  { id: 'roam', name: 'Roaming Pass', price: 'from ฿299', data: 'Data roaming abroad', tag: 'Add-on', why: 'Data roaming for travellers.', weights: { travel: 4 } },
]

// labels for the "matches:" chips on a recommended plan
export const SOLVER_LABEL = {
  data: 'heavy data', budget: 'budget', ent: 'entertainment',
  home: 'whole home', calls: 'calls', travel: 'roaming',
}

// Rank plans against the staff's selected reads. Returns top 3 with the
// answers that drove each match (for an at-a-glance "why").
export function rankPlans(answers) {
  const active = Object.keys(answers).filter((k) => answers[k])
  if (!active.length) return []
  return PLANS
    .map((p) => {
      let score = 0
      const matched = []
      for (const a of active) {
        const w = p.weights[a] || 0
        score += w
        if (w > 0) matched.push(a)
      }
      return { ...p, score, matched }
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

// Deterministic queue number so a live demo never shows a jarring value.
export function makeTicket(needId) {
  const letter = { plan: 'B', device: 'C', internet: 'T', retention: 'R' }[needId] || 'A'
  const base = { plan: 23, device: 48, internet: 12, retention: 7 }[needId] ?? 5
  return `${letter}${4500 + base}`
}
