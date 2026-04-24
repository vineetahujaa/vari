import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Shield,
  ArrowRight,
  Menu,
  X,
  Building2,
  Lock,
  PhoneCall,
  CheckCircle2,
  Activity,
  AlertCircle,
  Sparkles,
  Globe,
  Monitor,
  Quote,
  Plus,
  Minus,
  Check
} from 'lucide-react';

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600;1,9..144,700&family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --cream: #F5EEE0;
    --cream-2: #FAF4E8;
    --cream-3: #EFE6D5;
    --ink: #0C1424;
    --ink-2: #121B30;
    --orange: #E85A3C;
    --orange-2: #D94E2E;
    --muted: #5E6479;
  }

  body {
    background-color: var(--cream);
    color: var(--ink);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }

  .font-serif-display {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  em, em.italic { font-style: italic; }

  .marquee-container { overflow: hidden; width: 100%; }

  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .marquee-track {
    display: flex;
    width: max-content;
    animation: marquee 30s linear infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.6; transform: scale(0.9); }
  }
  .pulse-dot { animation: pulse-dot 1.6s ease-in-out infinite; }

  .fade-up {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .fade-up.in-view { opacity: 1; transform: translateY(0); }

  html { scroll-behavior: smooth; }
  ::selection { background: var(--orange); color: white; }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  /* AI typewriter cursor */
  .typewriter-cursor {
    display: inline-block;
    width: 3px;
    height: 0.85em;
    background: var(--orange);
    margin-left: 4px;
    vertical-align: middle;
    border-radius: 2px;
    animation: blink-cursor 0.7s step-end infinite;
  }
  @keyframes blink-cursor {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
`;

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'The problem', href: '#problem' },
  { label: 'The engine',  href: '#engine' },
  { label: 'For families',href: '#families' },
  { label: 'For banks',   href: '#banks' },
  { label: 'FAQ',         href: '#faq' },
];

const DATA_SOURCES = ['UK Finance','FBI IC3','ACCC','Europol','RBI','PSR','GASA',"Alzheimer's Assoc.",'NCRP','FTC'];

const PROBLEM_STATS = [
  { region: 'USA',       amount: '$7.75B',      meta: 'Adults 60+',  source: 'FBI IC3 2025' },
  { region: 'UK',        amount: '£1.17B',      meta: 'All ages',    source: 'UK Finance 2025' },
  { region: 'Australia', amount: '$2.18B',      meta: 'All ages',    source: 'ACCC 2025' },
  { region: 'Europe',    amount: '€6B+',        meta: 'Estimate',    source: 'Europol' },
  { region: 'India',     amount: '₹22,000 Cr',  meta: 'All ages',    source: 'MHA / NCRP 2024' },
];

const OUTSIDE_THREATS = [
  'Voice-cloned family emergencies',
  'Pig-butchering and romance scams',
  'Fake bank or fake police calls',
  'Investment and crypto scams',
];
const INSIDE_RISKS = [
  'Coaching by scammer on the call',
  'Remote-access sessions in progress',
  'Urgency-driven authorized payments',
  'Unusual mule destinations',
];

const SENSORS = [
  { icon: 'phone',    name: 'Call Sensor',            desc: 'On-device voice AI that detects urgency, impersonation, scripting and coaching the moment a scammer starts talking.' },
  { icon: 'globe',    name: 'Browser Guard',           desc: 'DOM-level detection of fake support pages, overlays, phishing kits and manipulated login flows — before a click becomes a loss.' },
  { icon: 'activity', name: 'Payment Journey Watch',   desc: "A human-state risk score on every authorized payment. Catches the 'I'm sending this myself' scams that existing fraud stacks miss." },
  { icon: 'monitor',  name: 'Remote-Access Detector',  desc: 'Instant alerts the second AnyDesk, TeamViewer or screen-share enters the session — the number one vector in elder and SME fraud.' },
];

const INTERVENTION_FEATURES = ['Graded friction', 'Trusted contact alert', 'Bank hand-off', 'Cooling-off receipt'];
const FAMILY_FEATURES = [
  'Scam-call protection on device',
  'Browser guard against fake support',
  'Instant remote-access alerts',
  'Daily check-ins with family',
  'Trusted-contact transfer holds',
  'Zero-audio privacy by design',
];
const BANKS_FEATURES = ['PSR-ready', 'PSD3-aligned', 'RBI-aware', 'SOC2 path', 'On-device privacy'];

const TESTIMONIALS = [
  { quote: "The fraud stack protects accounts. Vasorin protects the person sitting at the account. That's the layer we've been missing for a decade.", author: 'Head of Financial Crime, Top-10 European Retail Bank' },
  { quote: 'APP reimbursement changed our P&L overnight. We need prevention at the human layer. Vasorin is the first platform actually built for that moment.', author: 'Chief Risk Officer, UK Challenger Bank' },
  { quote: 'My dad almost lost everything to a remote-access scam. Vasorin paused the transfer and called me. That one alert was worth years of subscription.', author: 'Priya S., Family member, Mumbai' },
  { quote: "We've priced scam-reimbursement cover for years without real prevention data. Vasorin's intelligence network is rewriting our underwriting model.", author: 'VP, Cyber and Scam Lines, Global Specialty Insurer' },
];

const FAQS = [
  { q: "How is this different from my bank's fraud detection?", a: "Bank fraud systems protect the account and the transaction. They cannot see the call you're on, the browser you're looking at, or the person coaching you. Vasorin sits at the human decision layer — across channels — and intervenes before the money moves." },
  { q: 'Do you record my calls?', a: 'No. Vasorin runs entirely on-device. We never upload, store, or transmit raw audio. Only the risk signal — a small, privacy-preserving score — is ever shared, and only when you choose to involve a trusted contact or your bank.' },
  { q: 'Is this only for older adults?', a: 'No. While elder fraud is a major vector, modern scams target every age group. Pig-butchering, investment scams, impersonation and deepfake voice attacks hit 30–50 year olds the hardest. Vasorin is a universal human-layer guardian.' },
  { q: 'Can banks and insurers integrate Vasorin?', a: 'Yes. Vasorin ships as an API, SDK, secure intelligence feed or fully white-labeled experience. PSR-ready in the UK, PSD3-aligned in the EU, RBI-aware in India and on a SOC2 path — deployable in weeks, not quarters.' },
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

// ─── WAITLIST STORAGE HELPERS ──────────────────────────────────────────────────
const getWaitlistCount = () => {
  try {
    const extra = parseInt(localStorage.getItem('vasorin_waitlist_extra') || '0', 10);
    return 2 + (isNaN(extra) ? 0 : extra);
  } catch { return 2; }
};

const submitWaitlist = ({ persona, email, name }) => {
  try {
    const list = JSON.parse(localStorage.getItem('vasorin_waitlist') || '[]');
    list.push({ persona, email, name, ts: Date.now() });
    localStorage.setItem('vasorin_waitlist', JSON.stringify(list));
    const extra = parseInt(localStorage.getItem('vasorin_waitlist_extra') || '0', 10) + 1;
    localStorage.setItem('vasorin_waitlist_extra', String(extra));
    return true;
  } catch { return false; }
};

// ─── CONTEXT ───────────────────────────────────────────────────────────────────
const WaitlistContext = createContext(null);
const WaitlistProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [persona, setPersona] = useState('Family');
  return (
    <WaitlistContext.Provider value={{
      open, persona, setPersona,
      openWaitlist: (p = 'Family') => { setPersona(p); setOpen(true); },
      closeWaitlist: () => setOpen(false),
    }}>
      {children}
    </WaitlistContext.Provider>
  );
};
const useWaitlist = () => {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error('useWaitlist must be within WaitlistProvider');
  return ctx;
};

// ─── TOAST ─────────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);
let toastId = 0;

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const show = (message, opts = {}) => {
    const id = ++toastId;
    setToasts(p => [...p, { id, message, ...opts }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), opts.duration || 4000);
  };
  window.toast = {
    success: (m, o) => show(m, { type: 'success', ...o }),
    error:   (m, o) => show(m, { type: 'error',   ...o }),
    default: (m, o) => show(m, { type: 'default', ...o }),
  };
  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="bg-[var(--ink)] text-white shadow-xl rounded-xl p-4 min-w-[320px] pointer-events-auto flex flex-col gap-1 border border-white/10">
            <div className="text-[14px] font-medium flex items-center gap-2">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
              {t.message}
            </div>
            {t.description && <div className="text-[13px] text-white/70">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ─── AI TYPEWRITER HOOK ────────────────────────────────────────────────────────
// Renders text char-by-char with a blinking cursor, mimicking AI output
function useTypewriter(phrases, { speed = 45, pause = 2200, deletePause = 900 } = {}) {
  const [display, setDisplay] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const current = phrases[phraseIdx];

    if (!deleting && charIdx < current.length) {
      const t = setTimeout(() => {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      }, speed);
      return () => clearTimeout(t);
    }

    if (!deleting && charIdx === current.length) {
      // Only one phrase — stop and mark done
      if (phrases.length === 1) { setDone(true); return; }
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }

    if (deleting && charIdx > 0) {
      const t = setTimeout(() => {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      }, speed / 2);
      return () => clearTimeout(t);
    }

    if (deleting && charIdx === 0) {
      const t = setTimeout(() => {
        setDeleting(false);
        setPhraseIdx(i => (i + 1) % phrases.length);
      }, deletePause);
      return () => clearTimeout(t);
    }
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause, deletePause, done]);

  return { display, done };
}

// ─── HEADER ────────────────────────────────────────────────────────────────────
const Header = () => {
  const { openWaitlist } = useWaitlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[var(--cream)]/85 backdrop-blur-md border-b border-[var(--cream-3)]' : 'bg-transparent'}`}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex items-center justify-between h-[72px]">
        <a href="#top" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--ink)] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[var(--orange)]" strokeWidth={2.4} />
          </div>
          <span className="font-serif-display text-[22px] tracking-tight">Vasorin<span className="text-[var(--orange)]">.AI</span></span>
        </a>
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-[15px] text-[var(--ink)]/80 hover:text-[var(--orange)] transition-colors">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openWaitlist('Family')}
            className="hidden sm:inline-flex items-center gap-2 bg-[var(--orange)] hover:bg-[var(--orange-2)] text-white rounded-full px-5 py-[10px] text-[15px] font-medium transition-colors"
          >
            Get early access<ArrowRight className="w-4 h-4" />
          </button>
          <button aria-label="Menu" className="lg:hidden p-2 text-[var(--ink)]" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-[var(--cream)] border-t border-[var(--cream-3)] px-6 py-4 space-y-3 shadow-lg absolute w-full">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-[16px] py-2 font-medium">{l.label}</a>
          ))}
          <button
            onClick={() => { setMobileOpen(false); openWaitlist('Family'); }}
            className="inline-flex w-full items-center justify-center gap-2 bg-[var(--orange)] text-white rounded-full px-5 py-3 text-[15px] font-medium mt-2"
          >
            Get early access<ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};

// ─── HERO ──────────────────────────────────────────────────────────────────────
const HERO_PHRASES = [
  'stops fraud before it happens.',
  'protects the human, not just the account.',
  'intervenes before money moves.',
];

const Hero = () => {
  const { openWaitlist } = useWaitlist();
  const { display, done } = useTypewriter(HERO_PHRASES, { speed: 42, pause: 2400, deletePause: 700 });

  return (
    <section id="top" className="relative pt-[120px] pb-24 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
        <div className="fade-up">
          <div className="inline-flex items-center gap-2 bg-white/70 border border-[var(--cream-3)] rounded-full px-4 py-1.5 text-[13px] text-[var(--ink)]/80">
            <span className="w-2 h-2 rounded-full bg-[var(--orange)] pulse-dot" />
            The Human Risk Intelligence Engine
          </div>

          {/* AI typewriter headline */}
          <h1 className="font-serif-display text-[52px] sm:text-[64px] lg:text-[76px] leading-[0.98] mt-6 tracking-tight">
            The only platform that{' '}
            <span className="text-[var(--orange)] italic">
              {display}
              {!done && <span className="typewriter-cursor" />}
            </span>
          </h1>

          <p className="mt-8 text-[18px] leading-relaxed text-[var(--ink)]/75 max-w-[540px]">
            Existing systems protect accounts. Vasorin protects the <em className="italic">human decision</em> — across calls, browsers, payments and devices — the moment a scammer tries to manipulate it.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              onClick={() => openWaitlist('Family')}
              className="inline-flex items-center gap-2 bg-[var(--orange)] hover:bg-[var(--orange-2)] text-white rounded-full px-6 py-[14px] text-[15px] font-medium transition-colors"
            >
              Protect my family<ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#banks"
              className="inline-flex items-center gap-2 bg-white border border-[var(--cream-3)] text-[var(--ink)] hover:border-[var(--ink)] rounded-full px-6 py-[14px] text-[15px] font-medium transition-colors"
            >
              For banks and insurers<Building2 className="w-4 h-4" />
            </a>
          </div>
          <div className="mt-8 flex items-center gap-2 text-[13px] text-[var(--ink)]/60">
            <Lock className="w-4 h-4" />On-device AI. Zero raw audio leaves the phone.
          </div>
        </div>

        <div className="relative fade-up">
          <div className="rounded-[28px] overflow-hidden aspect-[4/3] shadow-[0_30px_80px_-30px_rgba(12,20,36,0.35)] bg-[var(--cream-3)]">
            <img src={IMAGES.hero} alt="People reviewing a call" className="w-full h-full object-cover" loading="eager" />
          </div>
          <div className="absolute -top-3 left-6 right-6 sm:left-10 sm:right-10 lg:left-8 lg:right-auto lg:w-[360px] bg-white rounded-2xl shadow-[0_18px_40px_-16px_rgba(12,20,36,0.25)] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--cream)] flex items-center justify-center"><PhoneCall className="w-5 h-5 text-[var(--orange)]" /></div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-[var(--ink)]/60">Incoming call</div>
              <div className="text-[15px] font-medium">Impersonation detected</div>
            </div>
            <div className="text-[11px] font-semibold tracking-wider text-[var(--orange)]">PAUSED</div>
          </div>
          <div className="absolute -bottom-4 right-4 sm:right-8 bg-white rounded-2xl shadow-[0_18px_40px_-16px_rgba(12,20,36,0.25)] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
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

// ─── DATA TICKER ───────────────────────────────────────────────────────────────
const DataTicker = () => {
  const items = [...DATA_SOURCES, ...DATA_SOURCES];
  return (
    <section className="bg-[var(--cream-2)] border-y border-[var(--cream-3)] py-8">
      <div className="text-center text-[12px] tracking-[0.22em] uppercase text-[var(--ink)]/55 mb-6">Built on data from</div>
      <div className="overflow-hidden no-scrollbar">
        <div className="flex gap-16 marquee-track whitespace-nowrap px-6" style={{ width: 'max-content' }}>
          {items.map((s, i) => <span key={i} className="font-serif-display text-[28px] text-[var(--ink)]/80">{s}</span>)}
        </div>
      </div>
    </section>
  );
};

// ─── PROBLEM ───────────────────────────────────────────────────────────────────
const Problem = () => (
  <section id="problem" className="py-28 bg-[var(--cream)]">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
      <div className="fade-up">
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">The $20B+ blind spot</div>
        <h2 className="font-serif-display text-[48px] sm:text-[64px] leading-[1] mt-5 tracking-tight">
          Every fraud loss flows through a <em className="italic text-[var(--orange)]">human</em> being manipulated.
        </h2>
        <p className="mt-8 text-[17px] leading-relaxed text-[var(--ink)]/75 max-w-[540px]">
          Banks protect accounts. Telcos protect networks. Card networks protect transactions. Nobody protects the person — which is why authorized-payment scams are now the <strong className="text-[var(--ink)]">largest fraud category on Earth</strong>.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 max-w-[480px]">
          <div className="bg-[#F7D9CF] rounded-2xl p-5">
            <div className="font-serif-display text-[40px] text-[var(--ink)]">+59%</div>
            <div className="text-[13px] text-[var(--ink)]/70 mt-1">YoY growth in elder fraud losses (FBI 2025)</div>
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
            <div className="flex items-center gap-2 text-[13px] text-white/70"><Activity className="w-4 h-4 text-[var(--orange)]" />Reported losses — last full year</div>
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
        <p className="mt-4 text-[12px] text-[var(--ink)]/55 text-center">Sources: FBI IC3 2025, UK Finance 2025, ACCC Scamwatch 2025, Europol, MHA/NCRP India 2024.</p>
      </div>
    </div>
  </section>
);

// ─── THREATS & RISKS ── headings removed, bullets removed, clean text list ─────
const ThreatsRisks = () => (
  <section className="py-20 bg-[var(--cream-2)]">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-6">

      {/* Outside threats — no heading, no icons, plain list */}
      <div className="bg-white rounded-[28px] p-10 shadow-[0_10px_40px_-20px_rgba(12,20,36,0.15)] fade-up">
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)] mb-6">Outside threats</div>
        <ul className="space-y-5">
          {OUTSIDE_THREATS.map(t => (
            <li key={t} className="text-[18px] font-medium text-[var(--ink)]/85 leading-snug">{t}</li>
          ))}
        </ul>
      </div>

      {/* Inside risks — no heading, no icons, plain list */}
      <div className="bg-[var(--ink)] text-white rounded-[28px] p-10 shadow-[0_10px_40px_-20px_rgba(12,20,36,0.35)] fade-up">
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)] mb-6">Inside risks</div>
        <ul className="space-y-5">
          {INSIDE_RISKS.map(t => (
            <li key={t} className="text-[18px] font-medium text-white/85 leading-snug">{t}</li>
          ))}
        </ul>
      </div>

    </div>
  </section>
);

// ─── ENGINE ────────────────────────────────────────────────────────────────────
const iconMap = { phone: PhoneCall, globe: Globe, activity: Activity, monitor: Monitor };

const Engine = () => (
  <section id="engine" className="py-28 bg-[var(--cream)]">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
      <div className="max-w-[880px] fade-up">
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">How the engine works</div>
        <h2 className="font-serif-display text-[48px] sm:text-[64px] leading-[1.02] mt-5 tracking-tight">
          Four sensors. One intelligence core. <em className="italic text-[var(--orange)]">Real-time intervention.</em>
        </h2>
        <p className="mt-6 text-[17px] leading-relaxed text-[var(--ink)]/75 max-w-[640px]">
          Vasorin stitches signals across channels to answer the question nobody else is asking: <strong className="text-[var(--ink)]">is this person being manipulated right now?</strong>
        </p>
      </div>
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SENSORS.map(s => {
          const Icon = iconMap[s.icon];
          return (
            <div key={s.name} className="bg-white rounded-2xl p-6 border border-[var(--cream-3)] hover:-translate-y-1 hover:shadow-[0_20px_60px_-30px_rgba(12,20,36,0.25)] transition-all duration-300 fade-up">
              <div className="w-11 h-11 rounded-xl bg-[var(--cream)] flex items-center justify-center"><Icon className="w-5 h-5 text-[var(--orange)]" /></div>
              <h4 className="font-serif-display text-[24px] mt-5">{s.name}</h4>
              <p className="text-[14px] text-[var(--ink)]/70 mt-3 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── INTERVENTION ──────────────────────────────────────────────────────────────
const Intervention = () => {
  const [dismissed, setDismissed] = useState(false);
  return (
    <section className="py-16 bg-[var(--cream)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="bg-[var(--ink)] text-white rounded-[32px] p-10 lg:p-14 grid lg:grid-cols-2 gap-12 items-center fade-up">
          <div>
            <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">The intervention layer</div>
            <h2 className="font-serif-display text-[44px] sm:text-[56px] leading-[1.02] mt-5 tracking-tight">
              The cooling-off second between <em className="italic text-[var(--orange)]">intent</em> and loss.
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-white/75 max-w-[520px]">
              When risk crosses threshold, Vasorin nudges, delays or pauses — asks the right question, loops in a trusted contact, and hands off to bank customer support with full context.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {INTERVENTION_FEATURES.map(f => (
                <span key={f} className="px-4 py-2 rounded-full border border-white/20 text-[13px] text-white/85">{f}</span>
              ))}
            </div>
          </div>
          <div className={`bg-[var(--cream)] text-[var(--ink)] rounded-2xl p-6 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)] transition-all duration-500 ${dismissed ? 'opacity-60 scale-[0.98]' : ''}`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-[var(--cream-3)] flex items-center justify-center"><Shield className="w-5 h-5 text-[var(--orange)]" /></div>
              <div className="flex-1">
                <div className="text-[12px] text-[var(--ink)]/60">Vasorin Alert — just now</div>
                <div className="font-serif-display text-[22px] mt-0.5">Manipulation risk — HIGH</div>
              </div>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--ink)]/80">
              We paused your transfer of <strong>$4,200 to ACC 7821</strong>. The caller used urgency language and requested remote access. <strong>Priya (daughter)</strong> has been notified.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => { window.toast?.success('Loop with family sent'); setDismissed(true); }} className="bg-[var(--orange)] hover:bg-[var(--orange-2)] text-white rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors">Review with family</button>
              <button onClick={() => { window.toast?.default('Transfer released', { description: 'Marked safe. Risk score logged.' }); setDismissed(true); }} className="bg-white border border-[var(--cream-3)] text-[var(--ink)] rounded-full px-5 py-2.5 text-[14px] font-medium hover:border-[var(--ink)] transition-colors">I am safe</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── FAMILIES ──────────────────────────────────────────────────────────────────
const Families = () => {
  const { openWaitlist } = useWaitlist();
  return (
    <section id="families" className="py-28 bg-[var(--cream)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
        <div className="rounded-[28px] overflow-hidden aspect-square shadow-[0_30px_80px_-30px_rgba(12,20,36,0.35)] fade-up">
          <img src={IMAGES.family} alt="Family together" className="w-full h-full object-cover" />
        </div>
        <div className="fade-up">
          <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">For families</div>
          <h2 className="font-serif-display text-[48px] sm:text-[60px] leading-[1] mt-5 tracking-tight">Peace of mind for the people you love most.</h2>
          <p className="mt-6 text-[17px] leading-relaxed text-[var(--ink)]/75 max-w-[520px]">
            A gentle, always-on guardian for parents and partners — on the phone, in the browser, in the banking app. No spying. No recording. Just intervention when it matters.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            {FAMILY_FEATURES.map(f => (
              <div key={f} className="flex items-center gap-3 bg-white rounded-full pl-3 pr-5 py-2.5 border border-[var(--cream-3)]">
                <span className="w-6 h-6 rounded-full bg-[var(--cream)] flex items-center justify-center"><Check className="w-3.5 h-3.5 text-[var(--orange)]" strokeWidth={3} /></span>
                <span className="text-[14px]">{f}</span>
              </div>
            ))}
          </div>
          <button onClick={() => openWaitlist('Family')} className="mt-10 inline-flex items-center gap-2 bg-[var(--orange)] hover:bg-[var(--orange-2)] text-white rounded-full px-6 py-[14px] text-[15px] font-medium transition-colors">
            Join the family waitlist<ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

// ─── BANKS ─────────────────────────────────────────────────────────────────────
const Banks = () => {
  const { openWaitlist } = useWaitlist();
  return (
    <section id="banks" className="py-20 bg-[var(--cream)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="fade-up mb-10">
          <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">For banks, insurers and telcos</div>
          <h2 className="font-serif-display text-[48px] sm:text-[60px] leading-[1] mt-5 tracking-tight max-w-[900px]">
            The protection layer your fraud stack is <em className="italic text-[var(--orange)]">missing.</em>
          </h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-[var(--ink)] text-white rounded-[28px] p-10 fade-up">
            <p className="text-[17px] leading-relaxed text-white/80 max-w-[640px]">
              APP reimbursement rules made authorized fraud your P&L problem. Vasorin is the only engine built across calls, browsers, devices and payment intent — deployed as API, SDK, feed or full white-label.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {BANKS_FEATURES.map(f => (
                <span key={f} className="px-4 py-2 rounded-full border border-white/20 text-[13px] text-white/90">{f}</span>
              ))}
            </div>
            <button onClick={() => openWaitlist('Bank / Insurer')} className="mt-10 inline-flex items-center gap-2 bg-[var(--orange)] hover:bg-[var(--orange-2)] text-white rounded-full px-6 py-[14px] text-[15px] font-medium transition-colors">
              Request a design partner slot<ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-5 fade-up">
            <div className="bg-[var(--cream-2)] rounded-2xl p-6 border border-[var(--cream-3)]">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center"><Activity className="w-5 h-5 text-[var(--orange)]" /></div>
              <div className="font-serif-display text-[22px] mt-4">Intelligence API</div>
              <p className="text-[13px] text-[var(--ink)]/70 mt-2">Real-time human-state risk scores into your existing fraud stack.</p>
            </div>
            <div className="bg-[var(--cream-2)] rounded-2xl p-6 border border-[var(--cream-3)]">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center"><Monitor className="w-5 h-5 text-[var(--orange)]" /></div>
              <div className="font-serif-display text-[22px] mt-4">White-label SDK</div>
              <p className="text-[13px] text-[var(--ink)]/70 mt-2">Ship a branded guardian inside your banking app in weeks.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── TESTIMONIALS ──────────────────────────────────────────────────────────────
const Testimonials = () => (
  <section className="py-28 bg-[var(--cream-2)]">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
      <div className="max-w-[760px] fade-up">
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">Early signal</div>
        <h2 className="font-serif-display text-[44px] sm:text-[56px] leading-[1.02] mt-5 tracking-tight">
          What banks, insurers and <em className="italic text-[var(--orange)]">families</em> are saying.
        </h2>
      </div>
      <div className="mt-14 grid md:grid-cols-2 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="bg-white border border-[var(--cream-3)] rounded-[24px] p-8 fade-up hover:-translate-y-1 transition-transform duration-300">
            <Quote className="w-6 h-6 text-[var(--orange)]" />
            <p className="mt-5 font-serif-display text-[22px] leading-[1.3]">"{t.quote}"</p>
            <div className="mt-6 text-[13px] text-[var(--ink)]/60 uppercase tracking-wider">{t.author}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── FAQ ───────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="faq" className="py-28 bg-[var(--cream)]">
      <div className="max-w-[900px] mx-auto px-6 lg:px-10 text-center">
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)] fade-up">FAQ</div>
        <h2 className="font-serif-display text-[48px] sm:text-[60px] leading-[1] mt-4 fade-up">Questions worth asking.</h2>
        <div className="mt-14 bg-white rounded-[24px] shadow-[0_10px_40px_-20px_rgba(12,20,36,0.15)] text-left fade-up overflow-hidden">
          {FAQS.map((f, i) => {
            const open = openIdx === i;
            return (
              <div key={f.q} className={i !== 0 ? 'border-t border-[var(--cream-3)]' : ''}>
                <button onClick={() => setOpenIdx(open ? -1 : i)} className="w-full flex items-center justify-between gap-6 px-8 py-6 text-left">
                  <span className="font-serif-display text-[22px] sm:text-[24px]">{f.q}</span>
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-[var(--orange)] text-white' : 'bg-[var(--cream)] text-[var(--orange)]'}`}>
                    {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="px-8 pb-7 text-[16px] leading-relaxed text-[var(--ink)]/75 max-w-[760px]">{f.a}</p>
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

// ─── FINAL CTA ─────────────────────────────────────────────────────────────────
const FinalCTA = () => {
  const { openWaitlist } = useWaitlist();
  return (
    <section className="pb-24 pt-4 bg-[var(--cream)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="bg-[var(--ink)] text-white rounded-[32px] p-12 lg:p-20 relative overflow-hidden fade-up">
          <div className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full bg-[var(--orange)]/15 blur-3xl pointer-events-none" />
          <h2 className="font-serif-display text-[52px] sm:text-[72px] leading-[1] tracking-tight max-w-[900px] relative">
            Protect the human. <em className="italic text-[var(--orange)]">Stop the scam.</em> Before money moves.
          </h2>
          <p className="mt-8 text-[17px] text-white/75 max-w-[560px] relative">
            Join the Vasorin early-access program — for families, and for the banks and insurers ready to deploy the human risk layer.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 relative">
            <button onClick={() => openWaitlist('Family')} className="inline-flex items-center gap-2 bg-[var(--orange)] hover:bg-[var(--orange-2)] text-white rounded-full px-6 py-[14px] text-[15px] font-medium transition-colors">
              Get early access<ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => openWaitlist('Bank / Insurer')} className="inline-flex items-center gap-2 bg-transparent border border-white/30 hover:border-white text-white rounded-full px-6 py-[14px] text-[15px] font-medium transition-colors">
              Talk to our team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── FOOTER ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="bg-[var(--cream)] border-t border-[var(--cream-3)] pt-16 pb-10">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--ink)] flex items-center justify-center"><Shield className="w-4 h-4 text-[var(--orange)]" /></div>
          <span className="font-serif-display text-[22px]">Vasorin<span className="text-[var(--orange)]">.AI</span></span>
        </div>
        <p className="mt-4 text-[14px] text-[var(--ink)]/70 max-w-[260px]">The Human Risk Intelligence Engine. Protecting the human decision layer across calls, browsers, payments and devices.</p>
      </div>
      {Object.entries(FOOTER_LINKS).map(([title, links]) => (
        <div key={title}>
          <div className="text-[13px] uppercase tracking-wider text-[var(--ink)]/50 mb-4">{title}</div>
          <ul className="space-y-2.5">
            {links.map(l => <li key={l}><a href="#" className="text-[15px] text-[var(--ink)]/85 hover:text-[var(--orange)] transition-colors">{l}</a></li>)}
          </ul>
        </div>
      ))}
    </div>
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mt-12 pt-6 border-t border-[var(--cream-3)] flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-[var(--ink)]/55">
      <div>© {new Date().getFullYear()} Vasorin AI. All rights reserved.</div>
      <div>Built with privacy by design — on-device AI.</div>
    </div>
  </footer>
);

// ─── WAITLIST PILL ─────────────────────────────────────────────────────────────
const WaitlistPill = () => {
  const { openWaitlist, open } = useWaitlist();
  const [count, setCount] = useState(2);
  useEffect(() => { setCount(getWaitlistCount()); }, [open]);
  return (
    <button onClick={() => openWaitlist('Family')} className="fixed bottom-5 left-5 z-30 bg-white border border-[var(--cream-3)] rounded-full pl-2 pr-4 py-2 flex items-center gap-2 shadow-[0_10px_30px_-10px_rgba(12,20,36,0.2)] hover:shadow-[0_15px_40px_-10px_rgba(12,20,36,0.28)] transition-shadow">
      <span className="w-7 h-7 rounded-full bg-[var(--orange)] text-white text-[13px] font-semibold flex items-center justify-center">{count}</span>
      <span className="text-[13px] text-[var(--ink)]/80">already on the waitlist</span>
    </button>
  );
};

// ─── WAITLIST MODAL ────────────────────────────────────────────────────────────
const PERSONAS = ['Family', 'Bank / Insurer', 'Other'];

const WaitlistModal = () => {
  const { open, persona, setPersona, closeWaitlist } = useWaitlist();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!open) { setEmail(''); setName(''); } }, [open]);
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') closeWaitlist(); };
    if (open) document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [open, closeWaitlist]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  if (!open) return null;

  const handleSubmit = e => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { window.toast?.error('Please enter a valid email'); return; }
    setSubmitting(true);
    setTimeout(() => {
      submitWaitlist({ persona, email, name });
      setSubmitting(false);
      closeWaitlist();
      window.toast?.success("You're on the list", { description: `We'll reach out shortly — ${persona}` });
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={closeWaitlist} />
      <div className="relative bg-[var(--cream-2)] rounded-[24px] w-full max-w-[480px] p-8 shadow-[0_30px_80px_-20px_rgba(12,20,36,0.5)] border border-[var(--cream-3)]">
        <button onClick={closeWaitlist} aria-label="Close" className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-[var(--cream-3)] flex items-center justify-center transition-colors"><X className="w-5 h-5" /></button>
        <div className="text-[12px] font-medium tracking-[0.22em] uppercase text-[var(--orange)]">Early access</div>
        <h3 className="font-serif-display text-[34px] leading-[1.05] mt-3 text-[var(--ink)]">Get Vasorin before everyone else.</h3>
        <p className="mt-3 text-[14px] text-[var(--ink)]/70">Tell us who you are and we'll reach out with the right product.</p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {PERSONAS.map(p => (
            <button key={p} type="button" onClick={() => setPersona(p)}
              className={`rounded-full py-2.5 text-[13px] font-medium transition-all border ${persona === p ? 'bg-[var(--ink)] text-white border-[var(--ink)]' : 'bg-white text-[var(--ink)] border-[var(--cream-3)] hover:border-[var(--ink)]/40'}`}>
              {p}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@work.com" className="w-full bg-white rounded-full px-5 py-3 border border-[var(--cream-3)] focus:border-[var(--orange)] outline-none text-[15px] text-[var(--ink)]" required />
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full name (optional)" className="w-full bg-white rounded-full px-5 py-3 border border-[var(--cream-3)] focus:border-[var(--orange)] outline-none text-[15px] text-[var(--ink)]" />
          <button type="submit" disabled={submitting} className="w-full bg-[var(--orange)] hover:bg-[var(--orange-2)] disabled:opacity-60 text-white rounded-full py-3.5 text-[15px] font-medium flex items-center justify-center gap-2 transition-colors">
            {submitting ? 'Joining...' : 'Join the waitlist'}<ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <p className="mt-4 text-[12px] text-[var(--ink)]/55 text-center">No spam. Unsubscribe anytime. On-device privacy by design.</p>
      </div>
    </div>
  );
};

// ─── REVEAL HOOK ───────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  useReveal();
  return (
    <ToastProvider>
      <WaitlistProvider>
        <div className="App bg-[var(--cream)] text-[var(--ink)] min-h-screen">
          <style>{globalStyles}</style>
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
  );
}
