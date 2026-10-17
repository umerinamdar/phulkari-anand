import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import sealed from "@/assets/sealed-backdrop.jpg";
import hero from "@/assets/hero-backdrop.jpg";
import seal from "@/assets/wax-seal.png";
import paper from "@/assets/paper-texture.jpg";

const WEDDING = new Date("2027-02-14T10:00:00+05:30");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aarav & Anaya — 14 February 2027" },
      { name: "description", content: "You are warmly invited to the Anand Karaj of Aarav & Anaya at The Grand Pavilion." },
      { property: "og:title", content: "Aarav & Anaya — Wedding Invitation" },
      { property: "og:description", content: "Join us on 14 February 2027 at The Grand Pavilion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

const paperVar = { "--paper-img": `url(${paper})` } as CSSProperties;

function Divider() {
  return (
    <svg viewBox="0 0 320 28" className="mx-auto my-6 w-56 max-w-full" aria-hidden>
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="var(--highlight)" stopOpacity="0" />
          <stop offset=".5" stopColor="var(--highlight-bright)" />
          <stop offset="1" stopColor="var(--highlight)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 14H130M190 14H320" stroke="url(#g)" strokeWidth="1.2" />
      <g fill="none" stroke="var(--highlight)" strokeWidth="1.2">
        <path d="M160 2l12 12-12 12-12-12z" fill="var(--accent-soft)" fillOpacity=".35" />
        <path d="M160 8l6 6-6 6-6-6z" fill="var(--highlight)" />
        <path d="M146 14c-6-8-12-8-16 0 4 8 10 8 16 0M174 14c6-8 12-8 16 0-4 8-10 8-16 0" />
      </g>
      <circle cx="122" cy="14" r="2" fill="var(--highlight)" />
      <circle cx="198" cy="14" r="2" fill="var(--highlight)" />
    </svg>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 80 80" className={`pointer-events-none absolute h-14 w-14 sm:h-20 sm:w-20 ${className}`} aria-hidden>
      <g fill="none" stroke="var(--highlight)" strokeWidth="1.3">
        <path d="M4 76V20Q4 4 20 4h56" />
        <path d="M12 76V26q0-14 14-14h50" strokeOpacity=".6" />
        <path d="M20 20c10 0 16 6 16 16-10 0-16-6-16-16z" fill="var(--accent-soft)" fillOpacity=".3" />
        <path d="M36 20c6-4 12-4 16 0M20 36c-4 6-4 12 0 16" />
        <circle cx="20" cy="20" r="3" fill="var(--highlight)" />
      </g>
    </svg>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && el.classList.add("in"), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} className="reveal px-5 py-14 sm:py-20">
      <div className="relative mx-auto max-w-2xl rounded-sm border bg-surface/60 px-6 py-14 text-center shadow-[0_20px_50px_-30px_var(--shadow)] sm:px-14">
        <div className="pointer-events-none absolute inset-2 rounded-sm border border-highlight/40" />
        <Corner className="left-3 top-3" />
        <Corner className="right-3 top-3 -scale-x-100" />
        <Corner className="bottom-3 left-3 -scale-y-100" />
        <Corner className="bottom-3 right-3 -scale-100" />
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl font-medium italic text-foreground sm:text-5xl">{title}</h2>
        <div className="mx-auto mt-4 h-px w-24 bg-[image:var(--gold-gradient)]" />
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function useCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.max(0, WEDDING.getTime() - (now ?? WEDDING.getTime()));
  return [
    ["Days", Math.floor(d / 864e5)],
    ["Hours", Math.floor(d / 36e5) % 24],
    ["Minutes", Math.floor(d / 6e4) % 60],
    ["Seconds", Math.floor(d / 1e3) % 60],
  ] as const;
}

function Scratch() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const r = c.getBoundingClientRect();
    c.width = r.width * 2;
    c.height = r.height * 2;
    const g = ctx.createLinearGradient(0, 0, c.width, c.height);
    g.addColorStop(0, css.getPropertyValue("--scratch-foil"));
    g.addColorStop(0.5, css.getPropertyValue("--highlight-bright"));
    g.addColorStop(1, css.getPropertyValue("--scratch-foil"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = css.getPropertyValue("--scratch-ink");
    ctx.font = `600 ${c.height * 0.12}px Jost, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH TO REVEAL", c.width / 2, c.height / 2 + c.height * 0.04);
    let down = false;
    let n = 0;
    const scratch = (e: PointerEvent) => {
      if (!down) return;
      const b = c.getBoundingClientRect();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc((e.clientX - b.left) * 2, (e.clientY - b.top) * 2, 44, 0, Math.PI * 2);
      ctx.fill();
      if (++n > 40) setDone(true);
    };
    const on = () => (down = true);
    const off = () => (down = false);
    c.addEventListener("pointerdown", on);
    c.addEventListener("pointermove", scratch);
    window.addEventListener("pointerup", off);
    return () => {
      c.removeEventListener("pointerdown", on);
      c.removeEventListener("pointermove", scratch);
      window.removeEventListener("pointerup", off);
    };
  }, []);
  return (
    <div className="relative mx-auto h-32 w-full max-w-xs overflow-hidden rounded-sm border bg-paper">
      <div className="flex h-full flex-col items-center justify-center">
        <p className="eyebrow">Save the date</p>
        <p className="mt-1 font-display text-3xl italic">14 · 02 · 2027</p>
      </div>
      <canvas
        ref={ref}
        aria-label="Scratch to reveal the date"
        className={`scratch-canvas absolute inset-0 h-full w-full transition-opacity duration-700 ${done ? "opacity-0" : ""}`}
      />
    </div>
  );
}

const EVENTS = [
  { name: "Ardaas & Kirtan", time: "2027-02-14T09:00:00+05:30", note: "Morning prayers in the courtyard" },
  { name: "Anand Karaj", time: "2027-02-14T10:00:00+05:30", note: "The four laavan, beneath the canopy" },
  { name: "Langar", time: "2027-02-14T13:00:00+05:30", note: "A shared meal for all" },
  { name: "Reception", time: "2027-02-14T19:30:00+05:30", note: "An evening of music and celebration" },
];
const fmtTime = (s: string) =>
  new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(s));

function Invitation() {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const count = useCountdown();
  const [rsvp, setRsvp] = useState(false);

  const openDoors = () => {
    if (open) return;
    setOpen(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => setGone(true), reduce ? 50 : 2300);
  };

  useEffect(() => {
    document.body.style.overflow = gone ? "" : "hidden";
  }, [gone]);

  return (
    <main style={paperVar} className="paper-ground min-h-screen">
      {/* Opening */}
      {!gone && (
        <div className={`stage fixed inset-0 z-50 overflow-hidden bg-foreground ${open ? "opened" : ""}`}>
          <div className="door door-l" style={{ backgroundImage: `url(${sealed})` }} />
          <div className="door door-r" style={{ backgroundImage: `url(${sealed})` }} />
          <div className="absolute inset-x-0 bottom-10 text-center">
            <p className={`eyebrow rise text-highlight transition-opacity ${open ? "opacity-0" : ""}`} style={{ color: "var(--paper-light)", animationDelay: ".6s" }}>
              Tap the seal to open
            </p>
          </div>
          <button
            onClick={openDoors}
            aria-label="Open the invitation"
            className="seal-btn absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center sm:h-40 sm:w-40"
          >
            <img src={seal} alt="" width={816} height={816} className="absolute inset-0 h-full w-full" />
            <span className="relative font-display text-2xl font-semibold italic gold-text sm:text-3xl">A&nbsp;&amp;&nbsp;A</span>
          </button>
        </div>
      )}

      {/* Hero */}
      <header className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <img src={hero} alt="" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--veil)_0%,transparent_60%)]" />
        {open && (
          <div className="relative px-6 text-center">
            <p className="eyebrow rise" style={{ animationDelay: "1.2s" }}>Ik Onkar · With the blessings of Waheguru</p>
            <h1 className="rise mt-6 font-display text-6xl font-medium leading-none text-foreground sm:text-8xl" style={{ animationDelay: "1.5s" }}>
              Aarav
              <span className="gold-text shimmer my-2 block text-4xl italic sm:text-6xl">&amp;</span>
              Anaya
            </h1>
            <div className="rise mx-auto mt-8 inline-block border border-highlight/70 bg-surface/80 px-8 py-4 shadow-[0_10px_30px_-12px_var(--shadow)] backdrop-blur-sm" style={{ animationDelay: "1.9s" }}>
              <p className="eyebrow">Sunday</p>
              <p className="mt-1 font-display text-2xl">14 February 2027</p>
              <p className="eyebrow mt-1 text-muted" style={{ color: "var(--muted)" }}>The Grand Pavilion</p>
            </div>
          </div>
        )}
      </header>

      <Section eyebrow="Together with their families" title="An Invitation">
        <p className="font-display text-xl leading-relaxed text-foreground/90 sm:text-2xl">
          request the honour of your presence at the Anand Karaj of their children, as two souls become one in the
          presence of Sri Guru Granth Sahib Ji.
        </p>
        <Divider />
        <Scratch />
      </Section>

      <Section eyebrow="Counting the days" title="Until We Meet">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {count.map(([l, v]) => (
            <div key={l} className="rounded-sm border bg-paper/70 py-4">
              <p className="font-display text-3xl tabular-nums sm:text-5xl">{String(v).padStart(2, "0")}</p>
              <p className="eyebrow mt-1 text-[0.55rem] sm:text-[0.65rem]">{l}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Sunday · 14 February 2027" title="The Day">
        <ol className="space-y-8">
          {EVENTS.map((e, i) => (
            <li key={e.name}>
              {i > 0 && <Divider />}
              <p className="eyebrow">{fmtTime(e.time)} IST</p>
              <h3 className="mt-2 font-display text-3xl">{e.name}</h3>
              <p className="mt-1 text-sm text-muted">{e.note}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Venue" title="The Grand Pavilion">
        <p className="text-muted">Address to be shared · India</p>
        <Divider />
        <a
          href="https://maps.google.com/?q=The+Grand+Pavilion"
          target="_blank"
          rel="noreferrer"
          className="eyebrow inline-block border border-highlight px-6 py-3 transition-colors hover:bg-tint"
        >
          Open in Maps
        </a>
      </Section>

      <Section eyebrow="Kindly reply by 14 January 2027" title="RSVP">
        {rsvp ? (
          <p className="font-display text-2xl italic">Thank you — we can't wait to celebrate with you.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setRsvp(true);
            }}
            className="mx-auto max-w-sm space-y-4 text-left"
          >
            <input required placeholder="Your name" className="w-full border-b bg-transparent px-1 py-3 font-display text-xl outline-none placeholder:text-muted focus:border-accent" />
            <select className="w-full border-b bg-transparent px-1 py-3 font-sans outline-none focus:border-accent">
              <option>Joyfully attending</option>
              <option>Regretfully declining</option>
            </select>
            <input type="number" min={1} max={10} defaultValue={1} aria-label="Guests" className="w-full border-b bg-transparent px-1 py-3 outline-none focus:border-accent" />
            <button className="eyebrow mt-4 w-full bg-accent py-4 text-surface shadow-[0_10px_24px_-12px_var(--accent)] transition hover:brightness-110" style={{ color: "var(--surface)" }}>
              Send reply
            </button>
          </form>
        )}
      </Section>

      <footer className="px-6 pb-16 pt-4 text-center">
        <Divider />
        <p className="font-display text-3xl italic gold-text">Aarav &amp; Anaya</p>
        <p className="eyebrow mt-2">14 · 02 · 2027</p>
      </footer>
    </main>
  );
}
