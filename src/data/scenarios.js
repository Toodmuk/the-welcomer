// ─────────────────────────────────────────────────────────────────────────
// Grounded in the True Shop · Central World field research (Assignment 1
// personas / journeys / pain points). Two connected concepts share this data:
//
//   • TRUE QUEUE   — customer books a queue from home in the True App, is told
//                    what to bring, and (if they share their True number) their
//                    profile is "pierced" into the queue so staff are ready.
//   • THE WELCOMER — staff greet + diagnose on an iPad the moment the customer
//                    arrives, the system narrows 40+ promotions down to the
//                    right offer, and the data is handed off to Service Staff.
//
// Customer data here is MOCK — designed so it can be wired to True's real
// systems (CRM Lite / billing / usage) with zero structural change.
// ─────────────────────────────────────────────────────────────────────────

// ── Personas (composite, from the field research) ─────────────────────────
export const PERSONAS = [
  {
    id: 'somchai',
    emoji: '👴',
    name: 'Somchai',
    tagline: 'Senior customer, not comfortable with digital',
    blurb: 'Wants to talk to a person, not be pointed at a kiosk — price-sensitive and puzzled by a higher bill.',
    accent: '#b45309',
  },
  {
    id: 'nut',
    emoji: '💼',
    name: 'Nat',
    tagline: 'Office worker on a short lunch break',
    blurb: 'Time is money — quick to compare with AIS. Wants everything done in one visit, no waiting around.',
    accent: '#1d4ed8',
  },
  {
    id: 'mark',
    emoji: '🎒',
    name: 'Mark',
    tagline: 'Foreign tourist (weekend visit)',
    blurb: "Can't read Thai — needs a SIM or data plan right away and wants to know exactly what they're paying for.",
    accent: '#0891b2',
  },
  {
    id: 'ae',
    emoji: '😤',
    name: 'Ae',
    tagline: 'At-risk customer — cancellation / port-out',
    blurb: 'Came in ready to cancel or port out — patience exhausted. Will only stay if the offer is genuinely worthwhile.',
    accent: '#dc2626',
  },
]

export function getPersona(id) {
  return PERSONAS.find((p) => p.id === id) || null
}

// ── True Queue: services a customer can book from home ────────────────────
// Each maps to the "select service → prep checklist → link number → book queue" flow.
export const QUEUE_SERVICES = [
  {
    id: 'package',
    icon: 'signal',
    title: 'Change / renew package',
    sub: 'Consult on a mobile or home-broadband plan, or renew a contract',
    counter: 'Sales & Consultation counter',
    estMin: 12,
    personaId: 'nut',
    docs: [
      { icon: 'idcard', label: 'National ID card', required: true },
      { icon: 'smartphone', label: 'Phone number to change the package on', required: true },
      { icon: 'creditcard', label: 'Participating credit card (if 0% instalment)', required: false },
    ],
  },
  {
    id: 'device',
    icon: 'smartphone',
    title: 'Buy / finance a new device',
    sub: 'Choose a device, finance at 0%, or trade in your old one',
    counter: 'Device Sales counter (ITF)',
    estMin: 18,
    personaId: 'nut',
    docs: [
      { icon: 'idcard', label: 'National ID card', required: true },
      { icon: 'creditcard', label: 'Participating credit card (for 0% instalment)', required: true },
      { icon: 'package', label: 'Old device + box (if trading in)', required: false },
      { icon: 'file', label: 'Pay slip (required for select instalment plans)', required: false },
    ],
  },
  {
    id: 'new-sim',
    icon: 'globe',
    title: 'New number / Tourist SIM',
    sub: 'Open a new number · Tourist SIM',
    counter: 'New Number counter',
    estMin: 15,
    personaId: 'mark',
    english: 'New SIM / Tourist SIM — bring your passport',
    docs: [
      { icon: 'idcard', label: 'National ID card / Passport', required: true },
      { icon: 'scanface', label: 'Face scan (done in-store)', required: true },
    ],
  },
  {
    id: 'bill',
    icon: 'receipt',
    title: 'Pay bill / query charges',
    sub: 'Make a payment or ask why your bill went up',
    counter: 'Fast Lane',
    estMin: 5,
    personaId: 'somchai',
    fastLane: true,
    docs: [
      { icon: 'idcard', label: 'National ID card', required: true },
      { icon: 'receipt', label: 'Invoice number / phone number to pay', required: false },
    ],
  },
  {
    id: 'retention',
    icon: 'repeat',
    title: 'Cancel / port out',
    sub: 'Cancel a service or port your number out',
    counter: 'Retention desk',
    estMin: 20,
    personaId: 'ae',
    docs: [
      { icon: 'idcard', label: 'National ID card of the account holder', required: true },
      { icon: 'banknote', label: 'Settle any outstanding balance (if applicable)', required: true },
      { icon: 'file', label: 'Authorisation document (if registering on behalf)', required: false },
    ],
  },
  {
    id: 'signal',
    icon: 'wifi',
    title: 'Signal / connectivity issue',
    sub: 'Report a mobile signal or home broadband problem',
    counter: 'Technical / After-sales counter',
    estMin: 10,
    personaId: 'somchai',
    docs: [
      { icon: 'idcard', label: 'National ID card / affected phone number', required: true },
      { icon: 'home', label: 'Installation address (for home broadband)', required: false },
    ],
  },
]

export function getQueueService(id) {
  return QUEUE_SERVICES.find((s) => s.id === id) || null
}

// What the True App can pre-fill once the customer shares their True number.
// This is the data that gets "pierced" into the queue ticket.
export const QUEUE_PROFILE = {
  package: {
    name: 'Nat Wilaiporn',
    phone: '089-xxx-1188',
    plan: 'True 5G 399 (30 GB data)',
    insight: 'Exceeded data allowance 5 months in a row — likely here to upgrade their plan.',
  },
  device: {
    name: 'Nat Wilaiporn',
    phone: '089-xxx-1188',
    plan: 'True 5G 399',
    insight: 'Customer for 2 years with a clean payment history — eligible for 0% instalment over 10 months.',
  },
  retention: {
    name: 'Ae (account holder)',
    phone: '062-xxx-4420',
    plan: 'True 5G Together 599 + Home Broadband',
    insight: 'Stated reason: moving house + has a backup number — high churn risk.',
  },
  bill: {
    name: 'Somchai Pakdeepong',
    phone: '081-xxx-3210',
    plan: 'True 5G Together 599',
    insight: 'Bill this month +฿300 — 12-month promotional discount just expired.',
  },
  signal: {
    name: 'Somchai Pakdeepong',
    phone: '081-xxx-3210',
    plan: 'True Online 1Gbps + True Vision',
    insight: 'Reported slow home broadband in the evenings for 3 consecutive days.',
  },
  'new-sim': null, // tourist — no existing True profile to pull
}

// ── The Welcomer: staff-led in-shop scenarios ─────────────────────────────
// Kept intentionally rich so the iPad flow reads as a real product.
export const WELCOMER_SCENARIOS = [
  {
    id: 'bill-dispute',
    personaId: 'somchai',
    title: 'Somchai — Bill went up (promo expired)',
    tag: 'Frustrated customer · Vulnerable group',
    accent: '#ec2127',
    walkIn: {
      emoji: '😟',
      mood: 'Confused + irritated',
      headline: 'Elderly customer walks in holding a bill, looking for a staff member',
      quote: "Why is my bill so much higher this month? It wasn't like this last month!",
    },
    customer: {
      name: 'Somchai Pakdeepong',
      phone: '081-654-3210',
      plan: 'True 5G Together 599',
      tenure: '4 years 3 months',
      arpu: '฿599 → ฿899 (this month)',
      segment: 'Loyal customer · Uses True Vision + home broadband',
      autopay: 'Auto-debit card · Never missed a payment',
      insights: [
        '4-year loyal customer — never missed a payment',
        'This month\'s bill unusually high, +฿300',
        '12-month promotional discount expired this billing cycle',
      ],
      history: [
        { date: 'Feb 2022', text: 'Signed up for 599 package + 12-month discount' },
        { date: 'Jan 2026', text: 'Promotional discount ended → reverted to full price' },
      ],
    },
    diagnosis: [
      {
        id: 'reason',
        icon: 'target',
        q: "What is the customer here for?",
        captureLabel: 'Visit reason',
        options: [
          {
            value: 'bill',
            label: 'Billing / abnormal charge',
            suggests: [
              { kind: 'do', text: 'Pull up the last 3 months of bills on the tablet and review them together.' },
            ],
          },
          { value: 'signal', label: 'Signal / slow internet' },
          { value: 'package', label: 'Package consultation / change' },
          { value: 'device', label: 'Device / SIM' },
        ],
      },
      {
        id: 'mood',
        icon: 'thermometer',
        q: 'Assess the customer\'s mood',
        captureLabel: 'Mood',
        options: [
          {
            value: 'hot',
            label: 'Frustrated / irritated',
            flag: 'priority',
            suggests: [
              { kind: 'say', text: '"I completely understand — let me look into this for you right away." — Listen first, don\'t rush to fix.' },
              { kind: 'insight', text: 'Flag the queue as "Priority / Needs Care" — signals Service to be ready.' },
            ],
          },
          { value: 'neutral', label: 'Calm' },
          { value: 'good', label: 'Good mood' },
        ],
      },
      {
        id: 'detail',
        icon: 'search',
        q: 'System found the cause — confirm with the customer',
        captureLabel: 'Root cause',
        options: [
          {
            value: 'promo-ended',
            label: '12-month promotional discount expired',
            suggests: [
              { kind: 'say', text: '"The bill went up because the 12-month promotional discount just ended — it\'s not an error or extra charge. Let me find you a new offer."' },
              { kind: 'do', text: 'Attach proof of the bill + promo expiry date to the queue ticket.' },
            ],
          },
          { value: 'roaming', label: 'Roaming / international usage charges' },
          { value: 'overage', label: 'Exceeded data allowance' },
        ],
      },
    ],
    promoMatch: {
      poolNote: '40+ active promotions in the pool',
      reason: '4-year loyal customer + price-sensitive + just lost discount',
      matched: [
        {
          name: 'Loyalty Save 599 — lock in current price for 12 months',
          why: 'Retains a loyal customer and brings the bill back to ฿599 — directly addresses the reason for frustration.',
          price: '฿599/month',
          badge: 'Recommended',
        },
        {
          name: 'Auto-pay discount −฿50',
          why: 'Customer already auto-debits — they qualify instantly, no action needed.',
          price: '−฿50/month',
          badge: 'Add-on',
        },
      ],
    },
    handoff: {
      summary:
        'Loyal 4-year customer (elderly) — came in frustrated about +฿300 bill. Root cause confirmed: 12-month promo discount expired (not a billing error). Front desk listened and explained; customer has calmed down.',
      nextAction: 'Renew with Loyalty Save 599 / apply retention discount to keep this loyal customer.',
    },
    service: {
      greeting: "Hello Khun Somchai — I've already seen the notes from the front desk. I'm here to sort out your bill.",
      note: "Service Staff opens the case with full context — no need to ask again, customer doesn't have to repeat.",
      steps: [
        { label: 'Greet by name + confirm the issue was received', detail: 'Defuses frustration immediately — they know they don\'t have to start over.' },
        { label: 'Show the bill + where the promo expired', detail: 'Transparency builds trust.' },
        { label: 'Apply retention credit to extend the package discount', detail: 'Protects a loyal customer.' },
      ],
      resolution: {
        title: 'Close case',
        text: 'Extended the discount — bill returns to ฿599. Customer satisfied, leaves in a good mood.',
      },
      upsell: {
        trigger: 'Loyal customer + heavy True Vision usage (from front-desk data)',
        line: '"Since you already watch True Vision, adding the movie/sports channel pack is great value for just a little more."',
        offer: 'True Vision NOW add-on',
      },
    },
    impact: {
      metrics: [
        { value: '−67%', label: 'Service time per case (12→4 min)' },
        { value: '+18 pts', label: 'CSAT score — projected increase' },
        { value: '฿7,188/yr', label: 'ARPU retained (prevented churn)' },
      ],
      before: {
        time: '~12 min',
        mood: 'Getting more frustrated by the minute',
        steps: ['Directed to grab a queue ticket alone', 'Waits while already angry', 'Explains everything from scratch to Service', 'Service starts investigating from zero'],
      },
      after: {
        time: '~4 min',
        mood: 'Calms down from the first step',
        steps: ['Front desk listens + diagnoses immediately', 'Context travels with the queue ticket', 'Service greets by name — already knows the story', 'Resolves + renews promo + offers True Vision'],
      },
      wins: [
        { icon: 'smile', label: 'Fewer frustrated customers', text: 'Listened to from the first moment — no need to repeat the story.' },
        { icon: 'clock', label: 'Save ~8 minutes', text: 'Service can act immediately with full context.' },
        { icon: 'wallet', label: 'More upsell opportunity', text: 'Usage data surfaces the right offer at the right time.' },
      ],
    },
  },

  {
    id: 'plan-upgrade',
    personaId: 'nut',
    title: 'Nat — Wants faster / unlimited data',
    tag: 'Upsell case · Short lunch break',
    accent: '#0a7c5a',
    walkIn: {
      emoji: '🙂',
      mood: 'Good mood / in a hurry (lunch break)',
      headline: 'Working professional walks in — friendly but clearly pressed for time',
      quote: "My data runs out all the time. Is there a better plan? I need this quick.",
    },
    customer: {
      name: 'Nat Wilaiporn',
      phone: '089-222-1188',
      plan: 'True 5G 399 (30 GB data)',
      tenure: '2 years 1 month',
      arpu: '฿399/month',
      segment: 'Younger professional / heavy user / comparing with AIS',
      autopay: 'Pays via app · Always on time',
      insights: [
        'Exceeded data allowance 5 months in a row — network throttled at end of month',
        'Usage pattern: very high video streaming and content consumption',
        'Has never unlocked full 5G capability',
      ],
      history: [
        { date: 'May 2024', text: 'Signed up for 399 package' },
        { date: 'Last 5 months', text: 'Exceeded data every month — avg +12 GB over' },
      ],
    },
    diagnosis: [
      {
        id: 'reason',
        icon: 'target',
        q: "What is the customer here for?",
        captureLabel: 'Visit reason',
        options: [
          {
            value: 'package',
            label: 'Wants faster / unlimited data — package consultation',
            suggests: [
              { kind: 'do', text: 'Show 6-month data usage history on screen — let them see the pattern themselves.' },
            ],
          },
          { value: 'bill', label: 'Billing question' },
          { value: 'signal', label: 'Signal / slow internet' },
          { value: 'device', label: 'Device / SIM' },
        ],
      },
      {
        id: 'need',
        icon: 'lightbulb',
        q: 'Capture the need (so Service can close the sale)',
        captureLabel: 'Core need',
        options: [
          {
            value: 'streaming',
            label: 'Streams a lot — wants unlimited data',
            suggests: [
              { kind: 'say', text: '"Based on your usage, the unlimited 5G plan suits you perfectly — no more checking how much data you have left."' },
              { kind: 'upsell', text: 'Match: 5G Together 699 Unlimited + Entertainment bundle' },
            ],
          },
          { value: 'gaming', label: 'Gaming — needs low latency' },
          { value: 'wfh', label: 'Working from home / video calls' },
        ],
      },
      {
        id: 'mood',
        icon: 'thermometer',
        q: 'Assess mood / buying readiness',
        captureLabel: 'Mood',
        options: [
          {
            value: 'warm',
            label: 'Good mood — open to an offer',
            suggests: [
              { kind: 'insight', text: 'Customer is ready to buy — send the queue with the tailored offer so Service can close immediately.' },
            ],
          },
          { value: 'compare', label: 'Comparing with another carrier (AIS)' },
          { value: 'budget', label: 'Concerned about price' },
        ],
      },
    ],
    promoMatch: {
      poolNote: '40+ active promotions in the pool',
      reason: 'Exceeded data 5 months straight + heavy streaming + comparing with AIS',
      matched: [
        {
          name: '5G Together 699 Unlimited (max speed)',
          why: 'Directly fixes end-of-month throttling — and beats the equivalent AIS plan on value.',
          price: '฿699/month',
          badge: 'Recommended',
        },
        {
          name: 'Entertainment bundle (Netflix/Viu) +฿100',
          why: 'Customer streams heavily — adds real value without feeling like a hard sell.',
          price: '+฿100/month',
          badge: 'Add-on',
        },
      ],
    },
    handoff: {
      summary:
        'Customer exceeds data allowance every month for 5 months, heavy streamer, good mood and ready for an offer (but in a hurry) — front desk captured the need and pre-selected the right offer.',
      nextAction: 'Close the upgrade to 5G Together 699 Unlimited + propose entertainment bundle.',
    },
    service: {
      greeting: "Hi Nat — I've got the notes from the front desk. You're looking for unlimited data, right?",
      note: "Service Staff doesn't need to cold-pitch — the right offer was already matched using real usage data.",
      steps: [
        { label: 'Confirm need from front-desk data', detail: "No need to ask again — customer feels understood." },
        { label: 'Show data usage stats + compare plans', detail: 'Close the sale with real data, not guesswork.' },
        { label: 'Offer the entertainment bundle add-on', detail: 'Upsell flows naturally from the stated preference.' },
      ],
      resolution: {
        title: 'Sale closed',
        text: 'Upgraded to 5G Together 699 Unlimited. ARPU +฿300. Customer got exactly what they needed.',
      },
      upsell: {
        trigger: 'Heavy streaming usage (from front-desk data)',
        line: '"Adding the movie/series pack for a little more is better value than subscribing separately."',
        offer: 'Entertainment bundle + device on 0% instalment',
      },
    },
    impact: {
      metrics: [
        { value: '−50%', label: 'Service time (10→5 min)' },
        { value: '+฿3,600/yr', label: 'ARPU increase from upsell (+฿300/mo)' },
        { value: '×2', label: 'Conversion chance (offer is on-target)' },
      ],
      before: {
        time: '~10 min',
        mood: 'Hesitant — might walk out to compare',
        steps: ['Gets queue ticket, generic questions asked', 'Service pitches blindly without knowing the need', 'Customer feels like they\'re being pushed', 'Hard to close the sale'],
      },
      after: {
        time: '~5 min',
        mood: 'Confident — got exactly what they wanted',
        steps: ['Front desk captures need from real usage data', 'Tailored offer travels with the queue', 'Service pitches accurately and closes quickly', 'Entertainment bundle added as a natural upsell'],
      },
      wins: [
        { icon: 'target', label: 'Sell to the actual need', text: 'Real usage data drives the pitch — not guesswork.' },
        { icon: 'trendingup', label: 'Higher conversion', text: "Customer doesn't feel pushed — easier to close." },
        { icon: 'wallet', label: 'ARPU +฿300 + bundle', text: 'Upsell opportunity prepared from the front desk.' },
      ],
    },
  },

  {
    id: 'retention',
    personaId: 'ae',
    title: 'Ae — Wants to cancel / port out',
    tag: 'Retention case · High churn risk',
    accent: '#7c3aed',
    walkIn: {
      emoji: '😤',
      mood: 'Out of patience / decision already made',
      headline: 'Customer walks straight to the counter to cancel',
      quote: "I'm here to cancel my mobile line and home broadband. I've moved house too. Please make it quick.",
    },
    customer: {
      name: 'Ae Rattanapol',
      phone: '062-781-4420',
      plan: 'True 5G Together 599 + True Online 1Gbps',
      tenure: '3 years',
      arpu: '฿1,089/month (incl. home broadband)',
      segment: 'Existing customer — but ready to leave',
      autopay: 'Pays via app · 1 outstanding balance',
      insights: [
        'Cancellation reason: moving house + has a backup dtac number',
        'High combined annual value (~฿13,000) — worth retaining',
        'New address is covered by True Fibre (verified via GIS)',
      ],
      history: [
        { date: '3 years ago', text: 'Signed up for mobile + home broadband convergence bundle' },
        { date: 'This month', text: 'Moving house → came in to cancel' },
      ],
    },
    diagnosis: [
      {
        id: 'reason',
        icon: 'target',
        q: "What is the customer here for?",
        captureLabel: 'Visit reason',
        options: [
          {
            value: 'cancel',
            label: 'Cancel / port out',
            suggests: [
              { kind: 'do', text: "Ask for the real reason before offering anything — don't jump to a promo or it feels pushy." },
            ],
          },
          { value: 'bill', label: 'Outstanding balance' },
          { value: 'signal', label: 'Signal / connectivity issue' },
          { value: 'package', label: 'Change package' },
        ],
      },
      {
        id: 'why',
        icon: 'search',
        q: 'Real reason for cancellation',
        captureLabel: 'Reason',
        options: [
          {
            value: 'moved',
            label: 'Moving house (believes new address has no coverage)',
            flag: 'priority',
            suggests: [
              { kind: 'insight', text: "GIS check: new address is covered by True Fibre — we can transfer the installation for free, no need to cancel." },
              { kind: 'say', text: '"Your new address is covered by True — we can transfer it at no cost, no new contract needed."' },
            ],
          },
          { value: 'price', label: 'Too expensive / already has a backup number' },
          { value: 'service', label: 'Unhappy with past service' },
        ],
      },
      {
        id: 'mood',
        icon: 'thermometer',
        q: 'Assess patience level',
        captureLabel: 'Mood',
        options: [
          {
            value: 'impatient',
            label: 'Out of patience / in a hurry',
            flag: 'priority',
            suggests: [
              { kind: 'insight', text: 'Flag queue as "Priority" + pre-clear outstanding balance — reduces back-and-forth paperwork.' },
            ],
          },
          { value: 'open', label: 'Open to listening if the offer is worthwhile' },
        ],
      },
    ],
    promoMatch: {
      poolNote: '40+ active promotions + retention offers in the pool',
      reason: 'Real reason = moving house (not price) + high customer value',
      matched: [
        {
          name: 'Transfer home broadband installation (free)',
          why: "Addresses the actual reason — new address is covered by True Fibre, so cancellation isn't necessary.",
          price: 'Free transfer',
          badge: 'Recommended',
        },
        {
          name: 'Win-back −25% for 6 months + clear balance',
          why: 'Retains a high-value customer (~฿13,000/yr) — gives a compelling enough reason to stay.',
          price: '−25% for 6 months',
          badge: 'Retention offer',
        },
      ],
    },
    handoff: {
      summary:
        'High-value customer (~฿13,000/yr) came in to cancel because of a house move — mistakenly believed new address has no coverage. GIS confirms new address is covered. Front desk offered a free address transfer; customer is starting to open up.',
      nextAction: 'Process address transfer (no cancellation) + clear outstanding balance + apply win-back −25%.',
    },
    service: {
      greeting: "Hello Ae — I can see you're moving house. Good news: your new address already has True coverage.",
      note: "Service Staff knows the real reason from the start — can pivot from 'cancellation' to 'service transfer' immediately.",
      steps: [
        { label: 'Confirm new address has coverage (show GIS)', detail: 'Corrects the misunderstanding that was driving the cancellation.' },
        { label: 'Offer free address transfer + clear outstanding balance', detail: 'Removes friction — customer feels treated fairly.' },
        { label: 'Apply win-back −25% for 6 months', detail: 'Close with a genuine deal, not a hard sell.' },
      ],
      resolution: {
        title: 'Customer retained',
        text: 'Cancellation converted to service transfer + discount applied. Customer stays. Revenue of ~฿13,000/yr protected.',
      },
      upsell: {
        trigger: 'Moving to a new home (from front-desk data)',
        line: '"For a new home, TrueX security cameras that you can monitor from your phone might give you some peace of mind."',
        offer: 'TrueX security camera + installation bundle',
      },
    },
    impact: {
      metrics: [
        { value: '−60%', label: 'Service time (20→8 min)' },
        { value: '฿13,000/yr', label: 'Customer value protected from churning' },
        { value: '1→0', label: '"Cancel" converted to "transfer service"' },
      ],
      before: {
        time: '~20 min',
        mood: 'Cancellation complete — customer lost',
        steps: ['Gets retention queue ticket, long wait', 'Staff pitches random offers (feels pushy)', "Doesn't uncover the real reason — the house move", 'Customer cancels — full revenue lost'],
      },
      after: {
        time: '~8 min',
        mood: 'Feels cared for — stays',
        steps: ['Front desk uncovers real reason (moving house)', 'GIS confirms new address is covered', 'Offers transfer + discount — targeted, not pushy', 'High-value customer retained'],
      },
      wins: [
        { icon: 'shieldcheck', label: 'Prevented churn — high-value customer', text: 'Protected ~฿13,000/yr of revenue that was about to walk out.' },
        { icon: 'target', label: 'Addressed the real reason — not pushy', text: 'Turned "cancel" into "transfer service".' },
        { icon: 'clock', label: 'Saved time + reduced paperwork loops', text: 'Balance cleared and priority queue prepared in advance.' },
      ],
    },
  },
]

export function getScenario(id) {
  return WELCOMER_SCENARIOS.find((s) => s.id === id) || null
}

// Deterministic so a live pitch shows the same plausible numbers every run
// (no Math.random surprises mid-demo). Stable hash from the seed id.
function hashSeed(s) {
  let h = 2166136261
  for (let i = 0; i < String(s).length; i++) {
    h ^= String(s).charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// queue numbers — a fresh "new-format" code (e.g. B8823) per the field note that
// True is moving to a new queue-number scheme.
export function makeQueueNumber(seedId) {
  const letter = { 'package': 'B', 'device': 'C', 'new-sim': 'S', 'bill': 'P', 'retention': 'R', 'signal': 'T' }[seedId] || 'A'
  const n = 1000 + (hashSeed(seedId) % 9000)
  return `${letter}${n}`
}

// Stable, plausible wait estimate for the True Queue ticket (no randomness).
export function queueEstimate(seedId) {
  const h = hashSeed(seedId)
  const position = 1 + (h % 3) // 1–3 ahead in queue
  const waitMin = position * 4 + (h % 4) + 2 // ~6–18 min, realistic range
  return { waitMin, position }
}
