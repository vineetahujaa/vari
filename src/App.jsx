import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Globe,
  Lock,
  Menu,
  Minus,
  Monitor,
  PhoneCall,
  Plus,
  Quote,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';

// ─── CONFIG ────────────────────────────────────────────────────────────────
// Set VITE_WAITLIST_ENDPOINT in your .env file to point at your backend
// e.g. VITE_WAITLIST_ENDPOINT=https://formspree.io/f/yourFormId
const WAITLIST_ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT || null;

// ─── STATIC DATA ───────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'The problem', href: '#problem' },
  { label: 'The engine',  href: '#engine' },
  { label: 'For families',href: '#families' },
  { label: 'For banks',   href: '#banks' },
  { label: 'FAQ',         href: '#faq' },
];

const DATA_SOURCES = [
  'UK Finance','FBI IC3','ACCC','Europol','RBI','PSR','GASA',
  "Alzheimer's Assoc.",'NCRP','FTC',
];

const PROBLEM_STATS = [
  { region: 'USA',       amount: '$7.75B',      meta: 'Adults 60+', source: 'FBI IC3 2025' },
  { region: 'UK',        amount: '£1.17B',      meta: 'All ages',   source: 'UK Finance 2025' },
  { region: 'Australia', amount: '$2.18B',      meta: 'All ages',   source: 'ACCC 2025' },
  { region: 'Europe',    amount: '€6B+',        meta: 'Estimate',   source: 'Europol' },
  { region: 'India',     amount: '₹22,000 Cr',  meta: 'All ages',   source: 'MHA / NCRP 2024' },
];

const OUTSIDE_THREATS = [
  'Voice-cloned family emergencies',
  'Pig-butchering & romance scams',
  'Fake bank / fake police calls',
  'Investment & crypto scams',
];

const INSIDE_RISKS = [
  'Coaching by scammer on the call',
  'Remote-access sessions in progress',
  'Urgency-driven authorized payments',
  'Unusual mule destinations',
];

const SENSORS = [
  {
    icon: 'phone',
    name: 'Call Sensor',
    desc: 'On-device voice AI that detects urgency, impersonation, scripting and coaching the moment a scammer starts talking.',
  },
  {
    icon: 'globe',
    name: 'Browser Guard',
    desc: 'DOM-level detection of fake support pages, overlays, phishing kits and manipulated login flows — before a click becomes a loss.',
  },
  {
    icon: 'activity',
    name: 'Payment Journey Watch',
    desc: "A human-state risk score on every authorized payment. Catches the 'I'm sending this myself' scams that existing fraud stacks miss.",
  },
  {
    icon: 'monitor',
    name: 'Remote-Access Detector',
    desc: 'Instant alerts the second AnyDesk, TeamViewer or screen-share enters the session — the #1 vector in elder and SME fraud.',
  },
];

const INTERVENTION_FEATURES = [
  'Graded friction',
  'Trusted contact alert',
  'Bank hand-off',
  'Cooling-off receipt',
];

const FAMILY_FEATURES = [
  'Scam-call protection on device',
  'Browser guard against fake support',
  'Instant remote-access alerts',
  'Daily check-ins with family',
  'Trusted-contact transfer holds',
  'Zero-audio privacy by design',
];

const BANKS_FEATURES = ['PSR-ready','PSD3-aligned','RBI-aware','SOC2 path','On-device privacy'];

const TESTIMONIALS = [
  {
    quote: "The fraud stack protects accounts. Vasorin protects the person sitting at the account. That's the layer we've been missing for a decade.",
    author: 'Head of Financial Crime, Top-10 European Retail Bank',
  },
  {
    quote: 'APP reimbursement changed our P&L overnight. We need prevention at the human layer — Vasorin is the first platform actually built for that moment.',
    author: 'Chief Risk Officer, UK Challenger Bank',
  },
  {
    quote: 'My dad almost lost everything to a remote-access scam. Vasorin paused the transfer and called me. That one alert was worth years of subscription.',
    author: 'Priya S., Family member, Mumbai',
  },
  {
    quote: "We've priced scam-reimbursement cover for years without real prevention data. Vasorin's intelligence network is rewriting our underwriting model.",
    author: 'VP, Cyber & Scam Lines, Global Specialty Insurer',
  },
];

const FAQS = [
  {
    q: "How is this different from my bank's fraud detection?",
    a: "Bank fraud systems protect the account and the transaction. They cannot see the call you're on, the browser you're looking at, or the person coaching you. Vasorin sits at the human decision layer — across channels — and intervenes before the money moves.",
  },
  {
    q: 'Do you record my calls?',
    a: 'No. Vasorin runs entirely on-device. We never upload, store, or transmit raw audio. Only the risk signal — a small, privacy-preserving score — is ever shared, and only when you choose to involve a trusted contact or your bank.',
  },
  {
    q: 'Is this only for older adults?',
    a: 'No. While elder fraud is a major vector, modern scams target every age group — pig-butchering, investment scams, impersonation and deepfake voice attacks hit 30–50 year olds the hardest. Vasorin is a universal human-layer guardian.',
  },
  {
    q: 'Can banks and insurers integrate Vasorin?',
    a: 'Yes. Vasorin ships as an API, SDK, secure intelligence feed or fully white-labeled experience. PSR-ready in the UK, PSD3-aligned in the EU, RBI-aware in India and on a SOC2 path — deployable in weeks, not quarters.',
  },
];

const FOOTER_LINKS = {
  Product: ['How it works', 'For families', 'For banks'],
  Company: ['About', 'Careers', 'Press'],
  Legal:   ['Privacy', 'Security', 'Terms'],
};

const IMAGES = {
  hero:   'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
  family: 'https://images.pexels.com/photos/7927998/pexels-photo-7927998.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
};

const PERSONAS = ['Family', 'Bank / Insurer', 'Other'];

// ─── WAITLIST HELPERS ───────────────────────────────────────────────────────
const safeStorage = {
  get: (key, fallback = null) => {
    try { const v = localStorage.getItem(key); return v !== null ? v : fallback; }
    catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, value); return true; }
    catch { return false; }
  },
};

const getWaitlistCount = () => {
  const base = 2;
  const extra = parseInt(safeStorage.get('vasorin_waitlist_extra', '0'), 10);
  return base + (isNaN(extra) ? 0 : extra);
};

/** Returns { ok: boolean, error?: string } */
const submitWaitlist = async ({ persona, email, name }) => {
  // If a real endpoint is configured, post to it
  if (WAITLIST_ENDPOINT) {
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ persona, email, name }),
      });
      if (!res.ok) return { ok: false, error: 'Server error. Please try again.' };
    } catch {
      return { ok: false, error: 'Network error. Please check your connection.' };
    }
  }

  // Local persistence (used as fallback / dev)
  try {
    const list = JSON.parse(safeStorage.get('vasorin_waitlist', '[]'));
    list.push({ persona, email, name, ts: Date.now() });
    safeStorage.set('vasorin_waitlist', JSON.stringify(list));
    const extra = parseInt(safeStorage.get('vasorin_waitlist_extra', '0'), 10) + 1;
    safeStorage.set('vasorin_waitlist_extra', String(extra));
  } catch { /* non-fatal */ }

  return { ok: true };
};

// ─── TOAST ─────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);
let _toastId = 0;

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, opts = {}) => {
    const id = ++_toastId;
    setToasts(prev => [...prev, { id, message, ...opts }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), opts.duration || 4000);
  }, []);

  const toast = {
    success: (msg, opts) => add(msg, { type: 'success', ...opts }),
    error:   (msg, opts) => add(msg, { type: 'error',   ...opts }),
    info:    (msg, opts) => add(msg, { type: 'info',    ...opts }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4"
      >
        {toasts.map(t => (
          <div
            key={t.id}
            role="alert"
            className="bg-[var(--ink)] text-white shadow-xl rounded-2xl px-5 py-4 pointer-events-auto flex flex-col gap-1 border border-white/10 animate-fade-in"
          >
            <div className="text-sm font-medium flex items-center gap-2">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
              {t.type === 'error'   && <AlertCircle  className="w-4 h-4 text-red-400 shrink-0" />}
              {t.message}
            </div>
            {t.description && <div className="text-xs text-white/65">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

// ─── WAITLIST CONTEXT ───────────────────────────────────────────────────────
const WaitlistContext = createContext(null);

const WaitlistProvider = ({ children }) => {
  const [open, setOpen]       = useState(false);
  const [persona, setPersona] = useState('Family');

  const openWaitlist  = useCallback((p = 'Family') => { setPersona(p); setOpen(true); }, []);
  const closeWaitlist = useCallback(() => setOpen(false), []);

  return (
    <WaitlistContext.Provider value={{ open, persona, setPersona, openWaitlist, closeWaitlist }}>
      {children}
    </WaitlistContext.Provider>
  );
};

const useWaitlist = () => {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error('useWaitlist must be used within WaitlistProvider');
  return ctx;
};

// ─── ERROR BOUNDARY ─────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { console.error('[Vasorin] Error:', err, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
          <div className="text-center max-w-md px-6">
            <Shield className="w-10 h-10 text-[var(--orange)] mx-auto mb-4" />
            <h1 className="font-serif-display text-2xl mb-3">Something went wrong</h1>
            <p className="text-[var(--muted)] text-sm mb-6">Please refresh the page to continue.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[var(--orange)] text-white rounded-full px-6 py-3 text-sm font-medium"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── SCROLL REVEAL HOOK ──────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    // Observe all current elements
    const observe = () => {
      document.querySelectorAll('.fade-up:not(.in-view)').forEach(el => io.observe(el));
    };

    observe();

    // In case of async renders
    const timer = setTimeout(observe, 200);

    return () => { io.disconnect(); clearTimeout(timer); };
  }, []);
}

// ─── ICON MAP ───────────────────────────────────────────────────────────────
const ICON_MAP = { phone: PhoneCall, globe: Globe, activity: Activity, monitor: Monitor };

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const Header = () => {
  const { openWaitlist } = useWaitlist();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-[var(--cream)]/90 backdrop-blur-md border-b border-[var(--cream-3)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex items-center justify-between h-[72px]">
        <a href="#top" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--ink)] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[var(--orange)]" strokeWidth={2.4} />
          </div>
          <span className="font-serif-display text-[22px] tracking-tight">
            Vasorin<span className="text-[var(--orange)]">.AI</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-[15px] text-[var(--ink)]/80 hover:text-[var(--orange)] transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openWaitlist('Family')}
            className="hidden sm:inline-flex items-center gap-2 bg-[var(--orange)] hover:bg-[var(--orange-2)] text-white rounded-full px-5 py-[10px] text-[15px] font-medium transition-colors"
          >
            Get early access <ArrowRight className="w-4 h-4" />
          </button>
          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden p-2 text-[var(--ink)]"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[var(--cream)] border-t border-[var(--cream-3)] px-6 py-4 space-y-3 shadow-lg">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={closeMobile} className="block text-[16px] py-2 font-medium">
              {l.label}
            </a>
          ))}
          <button
            onClick={() => { closeMobile(); openWaitlist('Family'); }}
            className="w-full inline-flex items-center justify-center gap-2 bg-[var(--orange)] text-white rounded-full px-5 py-3 text-[15px] font-medium mt-2"
          >
            Get early access <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  const { openWaitlist } = useWaitlist();
  return (
    <section id="top" className="relative pt-[120px] pb-24 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
        <div className="fade-up">
          <div className="inline-flex items-center gap-2 bg-white/70 border border-[var(--cream-3)] rounded-full px-4 py-1.5 text-[13px] text-[var(--ink)]/80">
            <span className="w-2 h-2 rounded-full bg-[var(--orange)] pulse-dot" />
            The Human Risk Intelligence Engine
          </div>
          <h1 className="font-serif-display text-[52px] sm:text-[64px] lg:text-[76px] leading-[0.98] mt-6 tracking-tight">
            The only platform that <em className="italic text-[var(--orange)]">stops fraud before</em> it happens.
          </h1>
          <p className="mt-8 text-[18px] leading-relaxed text-[var(--ink)]/75 max-w-[540px]">
            Existing systems protect accounts. Vasorin protects the{' '}
            <em className="italic">human decision</em> — across calls, browsers, payments and devices —
            the moment a scammer tries to manipulate it.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              onClick={() => openWaitlist('Family')}
              className="inline-flex items-center gap-2 bg-[var(--orange)] hover:bg-[var(--orange-2)] text-white rounded-full px-6 py-[14px] text-[15px] font-medium transition-colors"
            >
              Protect my family <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#banks"
              className="inline-flex items-center gap-2 bg-white border border-[var(--cream-3)] text-[var(--ink)] hover:border-[var(--ink)] rounded-full px-6 py-[14px] text-[15px] font-medium transition-colors"
            >
              For banks & insurers <Building2 className="w-4 h-4" />
            </a>
          </div>
          <div className="mt-8 flex items-center gap-2 text-[13px] text-[var(--ink)]/60">
            <Lock className="w-4 h-4" />
            On-device AI. Zero raw audio leaves the phone.
          </div>
        </div>

        <div className="relative fade-up">
          <div className="rounded-[28px] overflow-hidden aspect-[4/3] shadow-[0_30px_80px_-30px_rgba(12,20,36,0.35)] bg-[var(--cream-3)]">
            <img
              src={IMAGES.hero}
              alt="Two people reviewing finances on a phone"
              className="w-full h-full object-cover"
              loading="eager"
              width={1200}
              height={900}
            />
          </div>
          <div className="absolute -top-3 left-6 right-6 sm:left-10 sm:right-10 lg:left-8 lg:right-auto lg:w-[360px] bg-white rounded-2xl shadow-[0_18px_40px_-16px_rgba(12,20,36,0.25)] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--cream)] flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-[var(--orange)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-[var(--ink)]/60">Incoming call</div>
              <div className="text-[15px] font-medium">Impersonation detected</div>
            </div>
            <div className="text-[11px] font-semibold tracking-wider text-[var(--orange)] shrink-0">PAUSED</div>
          </div>
          <div className="absolute -bottom-4 right-4 sm:right-8 bg-white rounded-2xl shadow-[0_18px_40px_-16px_rgba(12,20,36,0.25)] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-[12px] text-[var(--ink)]/60">Transfer held</div>
              <div className="text-[15px] font-medium">$4,200 protected</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DataTicker = () => {
  const items = [...DATA_SOURCES, ...DATA_SOURCES];
  return (
    <section aria-label="Data sources" className="bg-[var(--cream-2)] border-y border-[var(--cream-3)] py-8">
      <div className="text-center text-[12px] tracking-[0.22em] uppercase text-[var(--ink)]/55 mb-6">
        Built on data from
      </div>
      <div className="overflow-hidden no-scrollbar" aria-hidden="true">
        <div className="marquee-track gap-16 whitespace-nowrap px-6">
          {items.map((s, i) => (
            <span key={i} className="font-serif-display text-[28px] text-[var(--ink)]/80 mr-16">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

const Problem = () => (
  <section id="problem" className="py-28 bg-[var(--cream)]">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
      <div className="fade-up">
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">
          The $20B+ blind spot
        </div>
        <h2 className="font-serif-display text-[48px] sm:text-[64px] leading-[1] mt-5 tracking-tight">
          Every fraud loss flows through a{' '}
          <em className="italic text-[var(--orange)]">human</em> being manipulated.
        </h2>
        <p className="mt-8 text-[17px] leading-relaxed text-[var(--ink)]/75 max-w-[540px]">
          Banks protect accounts. Telcos protect networks. Card networks protect transactions.
          Nobody protects the person — which is why authorized-payment scams are now the{' '}
          <strong className="text-[var(--ink)]">largest fraud category on Earth</strong>.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 max-w-[480px]">
          <div className="bg-[#F7D9CF] rounded-2xl p-5">
            <div className="font-serif-display text-[40px] text-[var(--ink)]">+38%</div>
            <div className="text-[13px] text-[var(--ink)]/70 mt-1">YoY growth in APP &amp; scam fraud</div>
          </div>
          <div className="bg-[#F7E2A8] rounded-2xl p-5">
            <div className="font-serif-display text-[40px] text-[var(--ink)]">&gt;50%</div>
            <div className="text-[13px] text-[var(--ink)]/70 mt-1">of fraud losses are now authorized by the victim</div>
          </div>
        </div>
      </div>

      <div className="fade-up">
        <div className="bg-[var(--ink)] text-white rounded-[28px] p-8 shadow-[0_30px_80px_-30px_rgba(12,20,36,0.45)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-[13px] text-white/70">
              <Activity className="w-4 h-4 text-[var(--orange)]" />
              Reported losses — last full year
            </div>
            <div className="text-[12px] text-white/50">Source-linked</div>
          </div>
          <div className="divide-y divide-white/10">
            {PROBLEM_STATS.map(r => (
              <div key={r.region} className="grid grid-cols-12 items-center py-4 gap-2">
                <div className="col-span-3 font-serif-display text-[22px]">{r.region}</div>
                <div className="col-span-3 text-[var(--orange)] font-semibold text-[18px]">{r.amount}</div>
                <div className="col-span-3 text-[13px] text-white/70">{r.meta}</div>
                <div className="col-span-3 text-right text-[12px] text-white/50">{r.source}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="text-[13px] text-white/70">Combined visible losses</div>
            <div className="font-serif-display text-[32px]">&gt; $20 Billion / year</div>
          </div>
        </div>
        <p className="mt-4 text-[12px] text-[var(--ink)]/55 text-center">
          Sources: FBI IC3 2025, UK Finance 2025, ACCC Scamwatch 2025, Europol, MHA/NCRP India 2024.
        </p>
      </div>
    </div>
  </section>
);

const ThreatsRisks = () => (
  <section aria-label="Threat categories" className="py-20 bg-[var(--cream-2)]">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-[28px] p-10 shadow-[0_10px_40px_-20px_rgba(12,20,36,0.15)] fade-up">
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">Outside threats</div>
        <h3 className="font-serif-display text-[36px] sm:text-[44px] leading-[1.05] mt-5">
          Scammers calling. Fake tech support. Impersonation. Deepfake voices.
        </h3>
        <ul className="mt-8 space-y-4">
          {OUTSIDE_THREATS.map(t => (
            <li key={t} className="flex items-center gap-3 text-[16px] text-[var(--ink)]/85">
              <AlertCircle className="w-5 h-5 text-[var(--orange)] shrink-0" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-[var(--ink)] text-white rounded-[28px] p-10 shadow-[0_10px_40px_-20px_rgba(12,20,36,0.35)] fade-up">
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">Inside risks</div>
        <h3 className="font-serif-display text-[36px] sm:text-[44px] leading-[1.05] mt-5">
          The human layer. Urgency, confusion, misplaced trust.
        </h3>
        <ul className="mt-8 space-y-4">
          {INSIDE_RISKS.map(t => (
            <li key={t} className="flex items-center gap-3 text-[16px] text-white/85">
              <Sparkles className="w-5 h-5 text-[var(--orange)] shrink-0" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

const Engine = () => (
  <section id="engine" className="py-28 bg-[var(--cream)]">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
      <div className="max-w-[880px] fade-up">
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">
          How the engine works
        </div>
        <h2 className="font-serif-display text-[48px] sm:text-[64px] leading-[1.02] mt-5 tracking-tight">
          Four sensors. One intelligence core.{' '}
          <em className="italic text-[var(--orange)]">Real-time intervention.</em>
        </h2>
        <p className="mt-6 text-[17px] leading-relaxed text-[var(--ink)]/75 max-w-[640px]">
          Vasorin stitches signals across channels to answer the question nobody else is asking:{' '}
          <strong className="text-[var(--ink)]">is this person being manipulated right now?</strong>
        </p>
      </div>
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SENSORS.map(s => {
          const Icon = ICON_MAP[s.icon];
          return (
            <div
              key={s.name}
              className="bg-white rounded-2xl p-6 border border-[var(--cream-3)] hover:-translate-y-1 hover:shadow-[0_20px_60px_-30px_rgba(12,20,36,0.25)] transition-all duration-300 fade-up"
            >
              <div className="w-11 h-11 rounded-xl bg-[var(--cream)] flex items-center justify-center">
                <Icon className="w-5 h-5 text-[var(--orange)]" />
              </div>
              <h4 className="font-serif-display text-[24px] mt-5">{s.name}</h4>
              <p className="text-[14px] text-[var(--ink)]/70 mt-3 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const Intervention = () => {
  const toast      = useToast();
  const [dismissed, setDismissed] = useState(false);

  const handleReview = () => {
    toast.success('Loop with family sent');
    setDismissed(true);
  };
  const handleSafe = () => {
    toast.info('Transfer released', { description: 'Marked safe. Risk score logged.' });
    setDismissed(true);
  };

  return (
    <section aria-label="Intervention demo" className="py-16 bg-[var(--cream)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="bg-[var(--ink)] text-white rounded-[32px] p-10 lg:p-14 grid lg:grid-cols-2 gap-12 items-center fade-up">
          <div>
            <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">
              The intervention layer
            </div>
            <h2 className="font-serif-display text-[44px] sm:text-[56px] leading-[1.02] mt-5 tracking-tight">
              The cooling-off second between{' '}
              <em className="italic text-[var(--orange)]">intent</em> and loss.
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-white/75 max-w-[520px]">
              When risk crosses threshold, Vasorin nudges, delays or pauses — asks the right question,
              loops in a trusted contact, and hands off to bank customer support with full context.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {INTERVENTION_FEATURES.map(f => (
                <span key={f} className="px-4 py-2 rounded-full border border-white/20 text-[13px] text-white/85">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div
            className={`bg-[var(--cream)] text-[var(--ink)] rounded-2xl p-6 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)] transition-all duration-500 ${
              dismissed ? 'opacity-60 scale-[0.98]' : ''
            }`}
            aria-label="Sample alert card"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-[var(--cream-3)] flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-[var(--orange)]" />
              </div>
              <div className="flex-1">
                <div className="text-[12px] text-[var(--ink)]/60">Vasorin Alert · just now</div>
                <div className="font-serif-display text-[22px] mt-0.5">Manipulation risk — HIGH</div>
              </div>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--ink)]/80">
              We paused your transfer of <strong>$4,200 to ACC •••7821</strong>.
              The caller used urgency language and requested remote access.{' '}
              <strong>Priya (daughter)</strong> has been notified.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={handleReview}
                className="bg-[var(--orange)] hover:bg-[var(--orange-2)] text-white rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors"
              >
                Review with family
              </button>
              <button
                onClick={handleSafe}
                className="bg-white border border-[var(--cream-3)] text-[var(--ink)] rounded-full px-5 py-2.5 text-[14px] font-medium hover:border-[var(--ink)] transition-colors"
              >
                I&apos;m safe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Families = () => {
  const { openWaitlist } = useWaitlist();
  return (
    <section id="families" className="py-28 bg-[var(--cream)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
        <div className="rounded-[28px] overflow-hidden aspect-square shadow-[0_30px_80px_-30px_rgba(12,20,36,0.35)] fade-up">
          <img
            src={IMAGES.family}
            alt="Family together"
            className="w-full h-full object-cover"
            loading="lazy"
            width={900}
            height={900}
          />
        </div>
        <div className="fade-up">
          <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">
            For families
          </div>
          <h2 className="font-serif-display text-[48px] sm:text-[60px] leading-[1] mt-5 tracking-tight">
            Peace of mind for the people you love most.
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-[var(--ink)]/75 max-w-[520px]">
            A gentle, always-on guardian for parents and partners — on the phone, in the browser,
            in the banking app. No spying. No recording. Just intervention when it matters.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            {FAMILY_FEATURES.map(f => (
              <div
                key={f}
                className="flex items-center gap-3 bg-white rounded-full pl-3 pr-5 py-2.5 border border-[var(--cream-3)]"
              >
                <span className="w-6 h-6 rounded-full bg-[var(--cream)] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[var(--orange)]" strokeWidth={3} />
                </span>
                <span className="text-[14px]">{f}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => openWaitlist('Family')}
            className="mt-10 inline-flex items-center gap-2 bg-[var(--orange)] hover:bg-[var(--orange-2)] text-white rounded-full px-6 py-[14px] text-[15px] font-medium transition-colors"
          >
            Join the family waitlist <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

const Banks = () => {
  const { openWaitlist } = useWaitlist();
  return (
    <section id="banks" className="py-20 bg-[var(--cream)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="fade-up mb-10">
          <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">
            For banks, insurers &amp; telcos
          </div>
          <h2 className="font-serif-display text-[48px] sm:text-[60px] leading-[1] mt-5 tracking-tight max-w-[900px]">
            The protection layer your fraud stack is{' '}
            <em className="italic text-[var(--orange)]">missing.</em>
          </h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-[var(--ink)] text-white rounded-[28px] p-10 fade-up">
            <p className="text-[17px] leading-relaxed text-white/80 max-w-[640px]">
              APP reimbursement rules made authorized fraud your P&amp;L problem. Vasorin is the only
              engine built across calls, browsers, devices and payment intent — deployed as API, SDK,
              feed or full white-label.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {BANKS_FEATURES.map(f => (
                <span key={f} className="px-4 py-2 rounded-full border border-white/20 text-[13px] text-white/90">
                  {f}
                </span>
              ))}
            </div>
            <button
              onClick={() => openWaitlist('Bank / Insurer')}
              className="mt-10 inline-flex items-center gap-2 bg-[var(--orange)] hover:bg-[var(--orange-2)] text-white rounded-full px-6 py-[14px] text-[15px] font-medium transition-colors"
            >
              Request a design partner slot <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-5 fade-up">
            <div className="bg-[var(--cream-2)] rounded-2xl p-6 border border-[var(--cream-3)]">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Activity className="w-5 h-5 text-[var(--orange)]" />
              </div>
              <div className="font-serif-display text-[22px] mt-4">Intelligence API</div>
              <p className="text-[13px] text-[var(--ink)]/70 mt-2">
                Real-time human-state risk scores into your existing fraud stack.
              </p>
            </div>
            <div className="bg-[var(--cream-2)] rounded-2xl p-6 border border-[var(--cream-3)]">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Monitor className="w-5 h-5 text-[var(--orange)]" />
              </div>
              <div className="font-serif-display text-[22px] mt-4">White-label SDK</div>
              <p className="text-[13px] text-[var(--ink)]/70 mt-2">
                Ship a branded guardian inside your banking app in weeks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => (
  <section aria-label="Testimonials" className="py-28 bg-[var(--cream-2)]">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
      <div className="max-w-[760px] fade-up">
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">
          Early signal
        </div>
        <h2 className="font-serif-display text-[44px] sm:text-[56px] leading-[1.02] mt-5 tracking-tight">
          What banks, insurers and{' '}
          <em className="italic text-[var(--orange)]">families</em> are saying.
        </h2>
      </div>
      <div className="mt-14 grid md:grid-cols-2 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={i}
            className="bg-white border border-[var(--cream-3)] rounded-[24px] p-8 fade-up hover:-translate-y-1 transition-transform duration-300"
          >
            <Quote className="w-6 h-6 text-[var(--orange)]" aria-hidden="true" />
            <blockquote className="mt-5 font-serif-display text-[22px] leading-[1.3]">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-[13px] text-[var(--ink)]/60 uppercase tracking-wider">
              {t.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);
  const toggle = useCallback((i) => setOpenIdx(prev => prev === i ? -1 : i), []);

  return (
    <section id="faq" className="py-28 bg-[var(--cream)]">
      <div className="max-w-[900px] mx-auto px-6 lg:px-10 text-center">
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)] fade-up">FAQ</div>
        <h2 className="font-serif-display text-[48px] sm:text-[60px] leading-[1] mt-4 fade-up">
          Questions worth asking.
        </h2>
        <div className="mt-14 bg-white rounded-[24px] shadow-[0_10px_40px_-20px_rgba(12,20,36,0.15)] text-left fade-up overflow-hidden">
          {FAQS.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={f.q} className={i !== 0 ? 'border-t border-[var(--cream-3)]' : ''}>
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 px-8 py-6 text-left"
                >
                  <span className="font-serif-display text-[22px] sm:text-[24px]">{f.q}</span>
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[var(--orange)] text-white' : 'bg-[var(--cream)] text-[var(--orange)]'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {/* grid trick for height animation */}
                <div
                  className={`grid transition-all duration-[350ms] ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-8 pb-7 text-[16px] leading-relaxed text-[var(--ink)]/75 max-w-[760px]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  const { openWaitlist } = useWaitlist();
  return (
    <section aria-label="Call to action" className="pb-24 pt-4 bg-[var(--cream)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="bg-[var(--ink)] text-white rounded-[32px] p-12 lg:p-20 relative overflow-hidden fade-up">
          <div className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full bg-[var(--orange)]/15 blur-3xl pointer-events-none" />
          <h2 className="font-serif-display text-[52px] sm:text-[72px] leading-[1] tracking-tight max-w-[900px] relative">
            Protect the human.{' '}
            <em className="italic text-[var(--orange)]">Stop the scam.</em>{' '}
            Before money moves.
          </h2>
          <p className="mt-8 text-[17px] text-white/75 max-w-[560px] relative">
            Join the Vasorin early-access program — for families, and for the banks and insurers
            ready to deploy the human risk layer.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 relative">
            <button
              onClick={() => openWaitlist('Family')}
              className="inline-flex items-center gap-2 bg-[var(--orange)] hover:bg-[var(--orange-2)] text-white rounded-full px-6 py-[14px] text-[15px] font-medium transition-colors"
            >
              Get early access <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openWaitlist('Bank / Insurer')}
              className="inline-flex items-center gap-2 bg-transparent border border-white/30 hover:border-white text-white rounded-full px-6 py-[14px] text-[15px] font-medium transition-colors"
            >
              Talk to our team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[var(--cream)] border-t border-[var(--cream-3)] pt-16 pb-10">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--ink)] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[var(--orange)]" />
          </div>
          <span className="font-serif-display text-[22px]">
            Vasorin<span className="text-[var(--orange)]">.AI</span>
          </span>
        </div>
        <p className="mt-4 text-[14px] text-[var(--ink)]/70 max-w-[260px]">
          The Human Risk Intelligence Engine. Protecting the human decision layer across calls,
          browsers, payments and devices.
        </p>
      </div>
      {Object.entries(FOOTER_LINKS).map(([title, links]) => (
        <nav key={title} aria-label={title}>
          <div className="text-[13px] uppercase tracking-wider text-[var(--ink)]/50 mb-4">{title}</div>
          <ul className="space-y-2.5">
            {links.map(l => (
              <li key={l}>
                <a href="#" className="text-[15px] text-[var(--ink)]/85 hover:text-[var(--orange)] transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mt-12 pt-6 border-t border-[var(--cream-3)] flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-[var(--ink)]/55">
      <div>&copy; {new Date().getFullYear()} Vasorin AI. All rights reserved.</div>
      <div>Built with privacy by design — on-device AI.</div>
    </div>
  </footer>
);

const WaitlistPill = () => {
  const { openWaitlist, open } = useWaitlist();
  const [count, setCount] = useState(getWaitlistCount);

  useEffect(() => {
    if (!open) setCount(getWaitlistCount());
  }, [open]);

  return (
    <button
      onClick={() => openWaitlist('Family')}
      aria-label="Join waitlist"
      className="fixed bottom-5 left-5 z-30 bg-white border border-[var(--cream-3)] rounded-full pl-2 pr-4 py-2 flex items-center gap-2 shadow-[0_10px_30px_-10px_rgba(12,20,36,0.2)] hover:shadow-[0_15px_40px_-10px_rgba(12,20,36,0.28)] transition-shadow"
    >
      <span className="w-7 h-7 rounded-full bg-[var(--orange)] text-white text-[13px] font-semibold flex items-center justify-center">
        {count}
      </span>
      <span className="text-[13px] text-[var(--ink)]/80">already on the waitlist</span>
    </button>
  );
};

const WaitlistModal = () => {
  const toast                     = useToast();
  const { open, persona, setPersona, closeWaitlist } = useWaitlist();
  const [email,      setEmail]      = useState('');
  const [name,       setName]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef(null);

  // Reset fields when closed
  useEffect(() => {
    if (!open) { setEmail(''); setName(''); }
  }, [open]);

  // Keyboard close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeWaitlist(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeWaitlist]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus first input
  useEffect(() => {
    if (open) setTimeout(() => firstInputRef.current?.focus(), 50);
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubmitting(true);
    const result = await submitWaitlist({ persona, email, name });
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error || 'Something went wrong. Please try again.');
      return;
    }
    closeWaitlist();
    toast.success("You're on the list!", { description: `We'll reach out shortly — ${persona}` });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Join waitlist">
      <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={closeWaitlist} />
      <div className="relative bg-[var(--cream-2)] rounded-[24px] w-full max-w-[480px] p-8 shadow-[0_30px_80px_-20px_rgba(12,20,36,0.5)] border border-[var(--cream-3)] animate-fade-in">
        <button
          onClick={closeWaitlist}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-[var(--cream-3)] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">Early access</div>
        <h3 className="font-serif-display text-[34px] leading-[1.05] mt-3 text-[var(--ink)]">
          Get Vasorin before everyone else.
        </h3>
        <p className="mt-3 text-[14px] text-[var(--ink)]/70">
          Tell us who you are and we&apos;ll reach out with the right product.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-2" role="group" aria-label="I am a...">
          {PERSONAS.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPersona(p)}
              aria-pressed={persona === p}
              className={`rounded-full py-2.5 text-[13px] font-medium transition-all border ${
                persona === p
                  ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                  : 'bg-white text-[var(--ink)] border-[var(--cream-3)] hover:border-[var(--ink)]/40'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3" noValidate>
          <input
            ref={firstInputRef}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@work.com"
            autoComplete="email"
            className="w-full bg-white rounded-full px-5 py-3 border border-[var(--cream-3)] focus:border-[var(--orange)] outline-none text-[15px] text-[var(--ink)]"
            required
          />
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full name (optional)"
            autoComplete="name"
            className="w-full bg-white rounded-full px-5 py-3 border border-[var(--cream-3)] focus:border-[var(--orange)] outline-none text-[15px] text-[var(--ink)]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[var(--orange)] hover:bg-[var(--orange-2)] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-full py-3.5 text-[15px] font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {submitting ? 'Joining…' : 'Join the waitlist'}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
        <p className="mt-4 text-[12px] text-[var(--ink)]/55 text-center">
          No spam. Unsubscribe anytime. On-device privacy by design.
        </p>
      </div>
    </div>
  );
};

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  useReveal();

  return (
    <ErrorBoundary>
      <ToastProvider>
        <WaitlistProvider>
          <div className="bg-[var(--cream)] text-[var(--ink)] min-h-screen">
            <Header />
            <main>
              <Hero />
              <DataTicker />
              <Problem />
              <ThreatsRisks />
              <Engine />
              <Intervention />
              <Families />
              <Banks />
              <Testimonials />
              <FAQ />
              <FinalCTA />
            </main>
            <Footer />
            <WaitlistModal />
            <WaitlistPill />
          </div>
        </WaitlistProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
