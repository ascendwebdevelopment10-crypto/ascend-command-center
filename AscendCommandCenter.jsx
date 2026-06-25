import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard, Gauge, ShieldCheck, Users, FileText, Settings as SettingsIcon,
  AlertTriangle, TrendingUp, Plus, Sparkles, Copy, Check, Trash2, X, ArrowUpRight,
  Loader2, Building2, ClipboardList
} from "lucide-react";

/* ----------------------------- design system ----------------------------- */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');

.ac-root *{box-sizing:border-box;margin:0;padding:0}
.ac-root{
  --base:#0B1220; --panel:#121C2E; --panel2:#19243A; --raise:#202E48;
  --line:#26324D; --line2:#33415F;
  --ink:#EAF0FB; --dim:#8B9AB9; --faint:#5C6B8A;
  --gold:#F2B544; --gold-deep:#C8881F;
  --teal:#4FD1C5; --green:#56D8A2; --coral:#FF6F6F; --coral-deep:#C9484E;
  font-family:'Inter',system-ui,sans-serif;
  background:var(--base); color:var(--ink);
  min-height:100vh; display:flex; line-height:1.5;
  -webkit-font-smoothing:antialiased;
}
.ac-root::selection{background:var(--gold);color:var(--base)}
.mono{font-family:'JetBrains Mono',monospace;font-variant-numeric:tabular-nums}
.disp{font-family:'Space Grotesk',sans-serif}

/* nav rail */
.rail{width:236px;flex-shrink:0;background:var(--panel);border-right:1px solid var(--line);
  display:flex;flex-direction:column;padding:22px 14px;position:sticky;top:0;height:100vh}
.brand{display:flex;align-items:center;gap:11px;padding:4px 8px 22px}
.brand-mark{width:34px;height:34px;border-radius:9px;flex-shrink:0;position:relative;overflow:hidden;
  background:linear-gradient(150deg,var(--gold) 0%,var(--gold-deep) 100%)}
.brand-mark svg{position:absolute;inset:0}
.brand-name{font-family:'Space Grotesk';font-weight:700;font-size:16px;letter-spacing:-.01em;line-height:1.1}
.brand-sub{font-size:10.5px;color:var(--faint);letter-spacing:.08em;text-transform:uppercase;font-weight:600}
.nav-label{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);
  font-weight:600;padding:14px 10px 7px}
.nav-item{display:flex;align-items:center;gap:11px;padding:9px 10px;border-radius:9px;cursor:pointer;
  color:var(--dim);font-size:13.5px;font-weight:500;border:1px solid transparent;transition:all .14s;width:100%;
  background:none;text-align:left;font-family:inherit}
.nav-item:hover{color:var(--ink);background:var(--panel2)}
.nav-item.on{color:var(--ink);background:var(--panel2);border-color:var(--line2)}
.nav-item.on svg{color:var(--gold)}
.nav-badge{margin-left:auto;background:var(--coral);color:#fff;font-size:10.5px;font-weight:700;
  min-width:19px;height:19px;border-radius:6px;display:flex;align-items:center;justify-content:center;padding:0 5px}
.rail-foot{margin-top:auto;padding:10px;font-size:11px;color:var(--faint);line-height:1.5}

/* main */
.main{flex:1;min-width:0;display:flex;flex-direction:column}
.topbar{display:flex;align-items:center;gap:16px;padding:20px 32px;border-bottom:1px solid var(--line);
  position:sticky;top:0;background:rgba(11,18,32,.85);backdrop-filter:blur(8px);z-index:5}
.topbar h1{font-family:'Space Grotesk';font-size:21px;font-weight:600;letter-spacing:-.015em}
.topbar p{font-size:12.5px;color:var(--dim);margin-top:1px}
.pill{margin-left:auto;display:flex;align-items:center;gap:7px;font-size:12px;color:var(--dim);
  background:var(--panel);border:1px solid var(--line);padding:7px 12px;border-radius:20px;font-weight:500}
.pill .dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 0 3px rgba(86,216,162,.18)}
.content{padding:28px 32px 60px;max-width:1180px;width:100%}

/* metrics */
.grid{display:grid;gap:16px}
.g4{grid-template-columns:repeat(4,1fr)}
.g3{grid-template-columns:repeat(3,1fr)}
.g2{grid-template-columns:1.4fr 1fr}
@media(max-width:980px){.g4{grid-template-columns:repeat(2,1fr)}.g3,.g2{grid-template-columns:1fr}}
.metric{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px 18px 16px;position:relative;overflow:hidden}
.metric .cap{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--dim);font-weight:600;display:flex;align-items:center;gap:6px}
.metric .val{font-family:'JetBrains Mono';font-size:30px;font-weight:600;margin-top:11px;letter-spacing:-.02em}
.metric .sub{font-size:12px;color:var(--faint);margin-top:3px}
.metric .accent{position:absolute;right:-20px;top:-20px;width:80px;height:80px;border-radius:50%;
  background:radial-gradient(circle,rgba(242,181,68,.12),transparent 70%)}
.metric.alert .val{color:var(--coral)}
.metric.good .val{color:var(--green)}
.metric.gold .val{color:var(--gold)}

/* panels */
.panel{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:22px}
.panel-h{display:flex;align-items:center;gap:10px;margin-bottom:18px}
.panel-h h2{font-family:'Space Grotesk';font-size:15px;font-weight:600}
.panel-h .ic{width:30px;height:30px;border-radius:8px;background:var(--panel2);display:flex;
  align-items:center;justify-content:center;color:var(--gold);flex-shrink:0}
.panel-h .act{margin-left:auto}

/* buttons */
.btn{display:inline-flex;align-items:center;gap:7px;font-family:inherit;font-size:13px;font-weight:600;
  border-radius:9px;padding:9px 14px;cursor:pointer;border:1px solid var(--line2);background:var(--panel2);
  color:var(--ink);transition:all .14s}
.btn:hover{background:var(--raise);border-color:var(--faint)}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn.gold{background:linear-gradient(150deg,var(--gold),var(--gold-deep));border:none;color:#2A1C04}
.btn.gold:hover{filter:brightness(1.06)}
.btn.ghost{background:none;border-color:var(--line)}
.btn.sm{padding:6px 10px;font-size:12px}
.btn.danger{color:var(--coral);border-color:transparent;background:none}
.btn.danger:hover{background:rgba(255,111,111,.1)}

/* lists / rows */
.row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--line)}
.row:last-child{border-bottom:none}
.row .name{font-weight:600;font-size:14px}
.row .meta{font-size:12px;color:var(--dim);margin-top:2px}
.row .right{margin-left:auto;text-align:right;display:flex;align-items:center;gap:10px}
.avatar{width:38px;height:38px;border-radius:10px;background:var(--panel2);border:1px solid var(--line2);
  display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk';font-weight:700;
  font-size:14px;color:var(--gold);flex-shrink:0}

/* tags */
.tag{font-size:11px;font-weight:600;padding:3px 9px;border-radius:6px;letter-spacing:.02em;white-space:nowrap}
.tag.onboarding{background:rgba(79,209,197,.14);color:var(--teal)}
.tag.active{background:rgba(86,216,162,.14);color:var(--green)}
.tag.at-risk{background:rgba(255,111,111,.14);color:var(--coral)}
.tag.renewing{background:rgba(242,181,68,.14);color:var(--gold)}
.tag.low{background:rgba(86,216,162,.14);color:var(--green)}
.tag.medium{background:rgba(242,181,68,.14);color:var(--gold)}
.tag.high{background:rgba(255,111,111,.14);color:var(--coral)}
.tag.svc{background:var(--panel2);color:var(--dim);border:1px solid var(--line)}

/* forms */
.field{margin-bottom:15px}
.field label{display:block;font-size:12px;font-weight:600;color:var(--dim);margin-bottom:6px}
.input,.textarea,.select{width:100%;font-family:inherit;font-size:13.5px;color:var(--ink);
  background:var(--base);border:1px solid var(--line2);border-radius:9px;padding:10px 12px;transition:border .14s}
.input:focus,.textarea:focus,.select:focus{outline:none;border-color:var(--gold)}
.textarea{resize:vertical;min-height:96px;line-height:1.6}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{font-size:12.5px;font-weight:500;padding:8px 12px;border-radius:8px;cursor:pointer;
  border:1px solid var(--line2);background:var(--base);color:var(--dim);transition:all .12s;user-select:none}
.chip.sel{background:rgba(242,181,68,.13);border-color:var(--gold);color:var(--gold)}

/* scope guard result */
.flag{display:flex;gap:11px;padding:13px;border-radius:10px;background:var(--base);border:1px solid var(--line);margin-bottom:10px}
.flag .fic{color:var(--coral);flex-shrink:0;margin-top:1px}
.flag .ftitle{font-weight:600;font-size:13.5px;margin-bottom:3px}
.flag .fbody{font-size:12.5px;color:var(--dim);line-height:1.55}
.flag .ffix{font-size:12.5px;color:var(--teal);margin-top:5px}
.brief{background:var(--base);border:1px solid var(--line);border-radius:12px;padding:20px;margin-top:4px}
.brief h4{font-family:'Space Grotesk';font-size:13px;letter-spacing:.05em;text-transform:uppercase;
  color:var(--gold);margin:16px 0 8px;font-weight:600}
.brief h4:first-child{margin-top:0}
.brief p{font-size:13.5px;line-height:1.65}
.brief ul{list-style:none;margin-top:4px}
.brief li{font-size:13px;line-height:1.6;padding-left:18px;position:relative;color:var(--ink);margin-bottom:4px}
.brief li::before{content:'';position:absolute;left:3px;top:8px;width:5px;height:5px;border-radius:50%;background:var(--gold)}
.brief li.out::before{background:var(--coral)}

/* empty */
.empty{text-align:center;padding:48px 24px;color:var(--dim)}
.empty .eic{width:52px;height:52px;border-radius:14px;background:var(--panel2);display:inline-flex;
  align-items:center;justify-content:center;color:var(--faint);margin-bottom:14px}
.empty h3{font-family:'Space Grotesk';font-size:16px;color:var(--ink);margin-bottom:6px;font-weight:600}
.empty p{font-size:13px;max-width:340px;margin:0 auto 16px;line-height:1.6}

/* bars */
.bar{height:8px;border-radius:5px;background:var(--panel2);overflow:hidden}
.bar > span{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,var(--gold-deep),var(--gold))}

/* modal */
.scrim{position:fixed;inset:0;background:rgba(6,10,18,.66);backdrop-filter:blur(3px);z-index:40;
  display:flex;align-items:flex-start;justify-content:center;padding:50px 20px;overflow:auto}
.modal{background:var(--panel);border:1px solid var(--line2);border-radius:16px;width:100%;max-width:560px;
  padding:26px}
.modal-h{display:flex;align-items:center;margin-bottom:20px}
.modal-h h3{font-family:'Space Grotesk';font-size:18px;font-weight:600}
.modal-h .x{margin-left:auto;cursor:pointer;color:var(--dim);background:none;border:none;padding:4px}
.modal-h .x:hover{color:var(--ink)}

.callout{display:flex;gap:11px;background:rgba(242,181,68,.07);border:1px solid rgba(242,181,68,.25);
  border-radius:11px;padding:14px 16px;font-size:13px;line-height:1.6;color:var(--ink)}
.callout svg{color:var(--gold);flex-shrink:0;margin-top:1px}
.sec-gap{margin-top:22px}
.note{font-size:12px;color:var(--faint);margin-top:7px;line-height:1.5}
.aiload{display:flex;align-items:center;gap:10px;color:var(--gold);font-size:13px;font-weight:500;padding:14px 0}
.aiload svg{animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
`;

const SERVICES = ["SEO Website", "Web / App Build", "Ad Management", "GBP Management"];
const STORE_KEY = "ascend:state:v1";
const fmt = (n) => "$" + Number(n || 0).toLocaleString("en-US");

/* ------------------------------- AI helper -------------------------------- */
async function askClaude(system, user) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  const data = await res.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  return text;
}
function parseJSON(text) {
  const clean = (text || "").replace(/```json/gi, "").replace(/```/g, "").trim();
  const s = clean.indexOf("{");
  const e = clean.lastIndexOf("}");
  return JSON.parse(s >= 0 ? clean.slice(s, e + 1) : clean);
}

/* ------------------------------- storage ---------------------------------- */
const blank = { deals: [], clients: [], weeks: [], settings: { membership: 0 } };
async function loadState() {
  try {
    const r = await window.storage.get(STORE_KEY);
    return r ? JSON.parse(r.value) : blank;
  } catch { return blank; }
}
async function saveState(state) {
  try { await window.storage.set(STORE_KEY, JSON.stringify(state)); } catch (e) { /* offline-safe */ }
}

const uid = () => Math.random().toString(36).slice(2, 9);

/* ================================ APP ===================================== */
export default function App() {
  const [view, setView] = useState("home");
  const [data, setData] = useState(blank);
  const [ready, setReady] = useState(false);

  useEffect(() => { loadState().then((s) => { setData(s); setReady(true); }); }, []);
  const commit = (next) => { setData(next); saveState(next); };

  /* derived */
  const m = useMemo(() => {
    const booked = data.weeks.reduce((a, w) => a + (+w.booked || 0), 0);
    const closed = data.weeks.reduce((a, w) => a + (+w.closed || 0), 0);
    const revenue = data.weeks.reduce((a, w) => a + (+w.dealValue || 0), 0);
    const cost = data.weeks.reduce((a, w) => a + (+w.membershipCost || 0), 0);
    const awaiting = data.deals.filter((d) => d.status === "awaiting-scope").length;
    const atRisk = data.clients.filter((c) => c.status === "at-risk").length;
    const renewing = data.clients.filter((c) => c.status === "renewing").length;
    const mrr = data.clients.reduce((a, c) => a + (+c.mrr || 0), 0);
    return {
      booked, closed, revenue, cost,
      closeRate: booked ? Math.round((closed / booked) * 100) : 0,
      roi: cost ? Math.round(((revenue - cost) / cost) * 100) : 0,
      awaiting, atRisk, renewing, mrr,
    };
  }, [data]);

  const navAwaiting = data.deals.filter((d) => d.status === "awaiting-scope").length;

  const NAV = [
    { id: "home", label: "Command Center", icon: LayoutDashboard },
    { id: "agency", label: "Agency Scorecard", icon: Gauge },
    { id: "intake", label: "Scope Guard", icon: ShieldCheck, badge: navAwaiting },
    { id: "clients", label: "Clients", icon: Users },
    { id: "briefs", label: "Handoff Briefs", icon: FileText },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];
  const head = {
    home: ["Command Center", "Your week across the agency, deals, and clients"],
    agency: ["Agency Scorecard", "Is the membership paying for itself?"],
    intake: ["Scope Guard", "Catch overselling before it reaches Mahdy"],
    clients: ["Clients", "Own every account from signature to renewal"],
    briefs: ["Handoff Briefs", "Clean scopes, ready to send to Mahdy"],
    settings: ["Settings", "Configure your operation"],
  };

  return (
    <div className="ac-root">
      <style>{CSS}</style>

      <nav className="rail">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 34 34" fill="none">
              <path d="M7 24 L17 11 L21 17 L27 9" stroke="#2A1C04" strokeWidth="2.4"
                strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="27" cy="9" r="2.3" fill="#2A1C04" />
            </svg>
          </div>
          <div>
            <div className="brand-name">Ascend</div>
            <div className="brand-sub">Sales Ops</div>
          </div>
        </div>
        <div className="nav-label">Operate</div>
        {NAV.map((n) => (
          <button key={n.id} className={"nav-item" + (view === n.id ? " on" : "")} onClick={() => setView(n.id)}>
            <n.icon size={17} />
            {n.label}
            {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
          </button>
        ))}
        <div className="rail-foot">
          Head of Sales workspace.<br />Built for the agency launch.
        </div>
      </nav>

      <div className="main">
        <header className="topbar">
          <div>
            <h1>{head[view][0]}</h1>
            <p>{head[view][1]}</p>
          </div>
          <div className="pill"><span className="dot" /> Agency live</div>
        </header>
        <div className="content">
          {!ready ? (
            <div className="aiload"><Loader2 size={18} /> Loading your workspace…</div>
          ) : (
            <>
              {view === "home" && <Home m={m} data={data} go={setView} />}
              {view === "agency" && <Agency data={data} commit={commit} m={m} />}
              {view === "intake" && <Intake data={data} commit={commit} />}
              {view === "clients" && <Clients data={data} commit={commit} />}
              {view === "briefs" && <Briefs data={data} />}
              {view === "settings" && <SettingsView data={data} commit={commit} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- HOME ------------------------------------- */
function Home({ m, data, go }) {
  const queue = data.deals.filter((d) => d.status === "awaiting-scope");
  const watch = data.clients.filter((c) => c.status === "at-risk" || c.status === "renewing");
  return (
    <>
      <div className="grid g4">
        <Metric cap="Calls Closed" icon={TrendingUp} val={m.closed} sub={`${m.booked} booked · ${m.closeRate}% close rate`} />
        <Metric cap="Revenue Closed" icon={ArrowUpRight} val={fmt(m.revenue)} sub="via the agency" tone="gold" />
        <Metric cap="Membership ROI" icon={Gauge} val={m.cost ? m.roi + "%" : "—"} sub={m.cost ? `on ${fmt(m.cost)} spend` : "log a week first"} tone={m.roi >= 0 ? "good" : "alert"} />
        <Metric cap="Recurring MRR" icon={Building2} val={fmt(m.mrr)} sub={`${data.clients.length} clients`} />
      </div>

      <div className="grid g2 sec-gap">
        <div className="panel">
          <div className="panel-h">
            <div className="ic"><ShieldCheck size={16} /></div>
            <h2>Deals awaiting your scope</h2>
            {queue.length > 0 && <button className="btn sm ghost act" onClick={() => go("intake")}>Open Scope Guard</button>}
          </div>
          {queue.length === 0 ? (
            <div className="empty">
              <div className="eic"><Check size={22} /></div>
              <h3>Nothing waiting</h3>
              <p>When the agency closes a deal, log it in Scope Guard so it reaches Mahdy clean.</p>
              <button className="btn gold" onClick={() => go("intake")}><Plus size={15} /> Log a closed deal</button>
            </div>
          ) : queue.map((d) => (
            <div className="row" key={d.id}>
              <div className="avatar">{d.client.slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="name">{d.client}</div>
                <div className="meta">{d.services.join(" · ")} · {fmt(d.price)}</div>
              </div>
              <div className="right">
                <span className="tag medium">Needs scope</span>
                <button className="btn sm gold" onClick={() => go("intake")}>Review</button>
              </div>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-h">
            <div className="ic"><AlertTriangle size={16} /></div>
            <h2>On your watch</h2>
          </div>
          {watch.length === 0 ? (
            <div className="empty">
              <div className="eic"><Users size={22} /></div>
              <h3>All steady</h3>
              <p>At-risk and renewing clients show here. This is the revenue only you own.</p>
            </div>
          ) : watch.map((c) => (
            <div className="row" key={c.id}>
              <div>
                <div className="name">{c.name}</div>
                <div className="meta">{fmt(c.mrr)}/mo</div>
              </div>
              <div className="right"><span className={"tag " + c.status}>{c.status}</span></div>
            </div>
          ))}
        </div>
      </div>

      {data.deals.length === 0 && data.clients.length === 0 && data.weeks.length === 0 && (
        <div className="callout sec-gap">
          <Sparkles size={17} />
          <div>
            This is empty because the agency hasn't started yet — that's the point. Want to see it working before then?
            Open <b>Settings</b> and load a sample week so you can walk Mahdy and Aidan through it.
          </div>
        </div>
      )}
    </>
  );
}

function Metric({ cap, val, sub, icon: Icon, tone }) {
  return (
    <div className={"metric" + (tone ? " " + tone : "")}>
      <div className="accent" />
      <div className="cap">{Icon && <Icon size={13} />}{cap}</div>
      <div className="val">{val}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}

/* ------------------------------ AGENCY ------------------------------------ */
function Agency({ data, commit, m }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ weekLabel: "", booked: "", closed: "", dealValue: "", membershipCost: "" });
  const [read, setRead] = useState(null);
  const [loading, setLoading] = useState(false);

  const add = () => {
    if (!form.weekLabel) return;
    commit({ ...data, weeks: [{ id: uid(), ...form }, ...data.weeks] });
    setForm({ weekLabel: "", booked: "", closed: "", dealValue: "", membershipCost: "" });
    setOpen(false);
  };

  const getRead = async () => {
    setLoading(true); setRead(null);
    try {
      const sys = "You are a sharp revenue operations advisor for Ascend Web Development, a recurring-services agency (SEO websites, web/app builds, ad management, GBP management). The head of sales pays a monthly membership to an outside agency that books and closes calls. Assess whether the membership is paying off and give direct, specific advice on what to raise with the agency. Reply ONLY with JSON: {\"verdict\":\"string one line\",\"working\":[\"...\"],\"concerns\":[\"...\"],\"raiseWithAgency\":[\"...\"]}. No markdown.";
      const usr = `Performance to date across ${data.weeks.length} week(s): ${m.booked} calls booked, ${m.closed} closed (${m.closeRate}% close rate), ${fmt(m.revenue)} revenue closed, ${fmt(m.cost)} membership cost, ${m.roi}% ROI. Recurring MRR under management: ${fmt(m.mrr)}.`;
      setRead(parseJSON(await askClaude(sys, usr)));
    } catch { setRead({ error: true }); }
    setLoading(false);
  };

  return (
    <>
      <div className="grid g3">
        <Metric cap="Close Rate" icon={Gauge} val={m.closeRate + "%"} sub={`${m.closed} of ${m.booked} booked`} tone="gold" />
        <Metric cap="Revenue / Cost" icon={TrendingUp} val={m.cost ? fmt(m.revenue) : "—"} sub={`against ${fmt(m.cost)} membership`} />
        <Metric cap="Net ROI" icon={ArrowUpRight} val={m.cost ? m.roi + "%" : "—"} sub={m.roi >= 0 ? "membership in profit" : "membership underwater"} tone={m.roi >= 0 ? "good" : "alert"} />
      </div>

      <div className="panel sec-gap">
        <div className="panel-h">
          <div className="ic"><ClipboardList size={16} /></div>
          <h2>Weekly log</h2>
          <div className="act" style={{ display: "flex", gap: 8 }}>
            {data.weeks.length > 0 && (
              <button className="btn sm ghost" onClick={getRead} disabled={loading}>
                <Sparkles size={14} /> AI weekly read
              </button>
            )}
            <button className="btn sm gold" onClick={() => setOpen(true)}><Plus size={14} /> Log week</button>
          </div>
        </div>

        {loading && <div className="aiload"><Loader2 size={16} /> Reading the agency's numbers…</div>}
        {read && !read.error && (
          <div className="brief" style={{ marginBottom: 18 }}>
            <h4>Verdict</h4><p>{read.verdict}</p>
            {read.working?.length > 0 && (<><h4>What's working</h4><ul>{read.working.map((x, i) => <li key={i}>{x}</li>)}</ul></>)}
            {read.concerns?.length > 0 && (<><h4>Concerns</h4><ul>{read.concerns.map((x, i) => <li key={i} className="out">{x}</li>)}</ul></>)}
            {read.raiseWithAgency?.length > 0 && (<><h4>Raise with the agency</h4><ul>{read.raiseWithAgency.map((x, i) => <li key={i}>{x}</li>)}</ul></>)}
          </div>
        )}
        {read?.error && <div className="callout" style={{ marginBottom: 16 }}><AlertTriangle size={16} />Couldn't reach the AI read just now. Try again in a moment.</div>}

        {data.weeks.length === 0 ? (
          <div className="empty">
            <div className="eic"><Gauge size={22} /></div>
            <h3>No weeks logged</h3>
            <p>Each week, record what the agency delivered. This is your evidence of whether the membership earns its keep.</p>
          </div>
        ) : data.weeks.map((w) => {
          const cr = w.booked ? Math.round((w.closed / w.booked) * 100) : 0;
          return (
            <div className="row" key={w.id}>
              <div style={{ minWidth: 110 }}>
                <div className="name">{w.weekLabel}</div>
                <div className="meta">{w.closed}/{w.booked} closed</div>
              </div>
              <div style={{ flex: 1, maxWidth: 200 }}>
                <div className="bar"><span style={{ width: cr + "%" }} /></div>
                <div className="meta" style={{ marginTop: 5 }}>{cr}% close rate</div>
              </div>
              <div className="right">
                <div>
                  <div className="name mono">{fmt(w.dealValue)}</div>
                  <div className="meta">cost {fmt(w.membershipCost)}</div>
                </div>
                <button className="btn sm danger" onClick={() => commit({ ...data, weeks: data.weeks.filter((x) => x.id !== w.id) })}><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <Modal title="Log agency week" onClose={() => setOpen(false)}>
          <Field label="Week"><input className="input" placeholder="e.g. Jun 30 – Jul 4" value={form.weekLabel} onChange={(e) => setForm({ ...form, weekLabel: e.target.value })} /></Field>
          <div className="grid g2" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Calls booked"><input className="input mono" type="number" value={form.booked} onChange={(e) => setForm({ ...form, booked: e.target.value })} /></Field>
            <Field label="Calls closed"><input className="input mono" type="number" value={form.closed} onChange={(e) => setForm({ ...form, closed: e.target.value })} /></Field>
            <Field label="Revenue closed ($)"><input className="input mono" type="number" value={form.dealValue} onChange={(e) => setForm({ ...form, dealValue: e.target.value })} /></Field>
            <Field label="Membership cost ($)"><input className="input mono" type="number" value={form.membershipCost} onChange={(e) => setForm({ ...form, membershipCost: e.target.value })} /></Field>
          </div>
          <button className="btn gold" style={{ width: "100%", justifyContent: "center", marginTop: 6 }} onClick={add}>Save week</button>
        </Modal>
      )}
    </>
  );
}

/* ------------------------------ INTAKE ------------------------------------ */
function Intake({ data, commit }) {
  const [form, setForm] = useState({ client: "", services: [], price: "", promised: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const queue = data.deals.filter((d) => d.status === "awaiting-scope");

  const toggle = (s) => setForm((f) => ({ ...f, services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s] }));

  const run = async () => {
    if (!form.client || form.services.length === 0) return;
    setLoading(true); setResult(null);
    try {
      const sys = `You are the scope-validation layer for Ascend Web Development. The head of sales reviews every deal an outside closing agency lands BEFORE it goes to Mahdy (fulfillment). Closers are paid on signatures, so they oversell. Your job: catch mismatches between what was promised and what Ascend's services (${SERVICES.join(", ")}) can realistically deliver, then write a clean handoff brief for Mahdy. Be concrete and skeptical. Reply ONLY with JSON, no markdown:
{"riskLevel":"low|medium|high","flags":[{"issue":"short","why":"why it's a problem","fix":"what to do"}],"scopeBrief":{"summary":"1-2 sentences for Mahdy","deliverables":["..."],"outOfScope":["things to confirm are NOT included"],"timeline":"realistic estimate","expectationsToReset":["things to clarify with the client before work starts"]},"questionsForClient":["..."]}`;
      const usr = `Client: ${form.client}\nServices sold: ${form.services.join(", ")}\nPrice: ${fmt(form.price)}\nWhat the closer told the client on the call:\n"""${form.promised}"""`;
      setResult(parseJSON(await askClaude(sys, usr)));
    } catch { setResult({ error: true }); }
    setLoading(false);
  };

  const handoff = () => {
    const deal = { id: uid(), client: form.client, services: form.services, price: +form.price || 0, promised: form.promised, status: "handed-off", risk: result, createdAt: Date.now() };
    const client = { id: uid(), name: form.client, services: form.services, status: "onboarding", mrr: form.services.some((s) => s.includes("Management")) ? Math.round((+form.price || 0)) : 0, renewalDate: "", upsell: null };
    commit({ ...data, deals: [deal, ...data.deals.filter((d) => d.status !== "awaiting-scope" || d.client !== form.client)], clients: [client, ...data.clients] });
    setForm({ client: "", services: [], price: "", promised: "" }); setResult(null);
  };

  return (
    <div className="grid g2" style={{ alignItems: "start" }}>
      <div className="panel">
        <div className="panel-h"><div className="ic"><ShieldCheck size={16} /></div><h2>Review a closed deal</h2></div>
        <div className="callout" style={{ marginBottom: 18 }}>
          <ShieldCheck size={16} />
          <div>Paste what the closer promised. The check flags overselling and writes Mahdy a clean scope — so you, not the call-center, define what gets built.</div>
        </div>
        <Field label="Client name"><input className="input" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Acme Plumbing" /></Field>
        <Field label="Services sold">
          <div className="chips">{SERVICES.map((s) => <span key={s} className={"chip" + (form.services.includes(s) ? " sel" : "")} onClick={() => toggle(s)}>{s}</span>)}</div>
        </Field>
        <Field label="Deal price ($)"><input className="input mono" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="3500" /></Field>
        <Field label="What was promised on the call">
          <textarea className="textarea" value={form.promised} onChange={(e) => setForm({ ...form, promised: e.target.value })} placeholder="e.g. Told them the new site would rank #1 on Google in two weeks and include unlimited revisions…" />
        </Field>
        <button className="btn gold" style={{ width: "100%", justifyContent: "center" }} onClick={run} disabled={loading || !form.client || form.services.length === 0}>
          {loading ? <><Loader2 size={15} className="spin" /> Checking…</> : <><Sparkles size={15} /> Run Scope Guard</>}
        </button>
      </div>

      <div className="panel">
        {!result && !loading && (
          <div className="empty">
            <div className="eic"><FileText size={22} /></div>
            <h3>The brief shows here</h3>
            <p>Run the check and you'll get risk flags plus a handoff-ready scope for Mahdy.</p>
          </div>
        )}
        {loading && <div className="aiload"><Loader2 size={16} /> Reading what was promised, checking it against your services…</div>}
        {result?.error && <div className="callout"><AlertTriangle size={16} />Couldn't run the check just now. Try again in a moment.</div>}
        {result && !result.error && (
          <>
            <div className="panel-h">
              <h2>Scope review</h2>
              <span className={"tag " + result.riskLevel + " act"}>{result.riskLevel} risk</span>
            </div>
            {result.flags?.length > 0 && result.flags.map((f, i) => (
              <div className="flag" key={i}>
                <AlertTriangle size={16} className="fic" />
                <div>
                  <div className="ftitle">{f.issue}</div>
                  <div className="fbody">{f.why}</div>
                  <div className="ffix">→ {f.fix}</div>
                </div>
              </div>
            ))}
            <div className="brief">
              <h4>For Mahdy</h4><p>{result.scopeBrief?.summary}</p>
              {result.scopeBrief?.deliverables?.length > 0 && (<><h4>Deliverables</h4><ul>{result.scopeBrief.deliverables.map((x, i) => <li key={i}>{x}</li>)}</ul></>)}
              {result.scopeBrief?.outOfScope?.length > 0 && (<><h4>NOT included</h4><ul>{result.scopeBrief.outOfScope.map((x, i) => <li key={i} className="out">{x}</li>)}</ul></>)}
              {result.scopeBrief?.timeline && (<><h4>Timeline</h4><p>{result.scopeBrief.timeline}</p></>)}
              {result.scopeBrief?.expectationsToReset?.length > 0 && (<><h4>Reset with client</h4><ul>{result.scopeBrief.expectationsToReset.map((x, i) => <li key={i}>{x}</li>)}</ul></>)}
              {result.questionsForClient?.length > 0 && (<><h4>Questions for the client</h4><ul>{result.questionsForClient.map((x, i) => <li key={i}>{x}</li>)}</ul></>)}
            </div>
            <button className="btn gold" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={handoff}>
              <Check size={15} /> Save & hand off to Mahdy
            </button>
          </>
        )}
      </div>

      {queue.length > 0 && (
        <div className="panel" style={{ gridColumn: "1 / -1" }}>
          <div className="panel-h"><h2>Awaiting scope ({queue.length})</h2></div>
          {queue.map((d) => (
            <div className="row" key={d.id}>
              <div className="avatar">{d.client.slice(0, 2).toUpperCase()}</div>
              <div><div className="name">{d.client}</div><div className="meta">{d.services.join(" · ")} · {fmt(d.price)}</div></div>
              <div className="right"><button className="btn sm danger" onClick={() => commit({ ...data, deals: data.deals.filter((x) => x.id !== d.id) })}><Trash2 size={14} /></button></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ CLIENTS ----------------------------------- */
function Clients({ data, commit }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", services: [], status: "onboarding", mrr: "", renewalDate: "" });
  const [busy, setBusy] = useState(null);

  const toggle = (s) => setForm((f) => ({ ...f, services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s] }));
  const add = () => {
    if (!form.name) return;
    commit({ ...data, clients: [{ id: uid(), upsell: null, ...form, mrr: +form.mrr || 0 }, ...data.clients] });
    setForm({ name: "", services: [], status: "onboarding", mrr: "", renewalDate: "" }); setOpen(false);
  };
  const setStatus = (id, status) => commit({ ...data, clients: data.clients.map((c) => c.id === id ? { ...c, status } : c) });

  const findUpsell = async (c) => {
    setBusy(c.id);
    try {
      const missing = SERVICES.filter((s) => !c.services.includes(s));
      const sys = `You advise the head of sales at Ascend Web Development on expansion revenue. Suggest the single best next service to cross-sell this client from Ascend's catalog (${SERVICES.join(", ")}). Recurring services (Ad Management, GBP Management) are the priority because they compound MRR. Reply ONLY with JSON: {"service":"one of the catalog services they don't have","pitch":"one short sentence the head of sales could say","reason":"why it fits this client"}. No markdown.`;
      const usr = `Client: ${c.name}. Currently has: ${c.services.join(", ") || "nothing yet"}. Services they don't have: ${missing.join(", ") || "none"}.`;
      const up = parseJSON(await askClaude(sys, usr));
      commit({ ...data, clients: data.clients.map((x) => x.id === c.id ? { ...x, upsell: up } : x) });
    } catch { /* ignore */ }
    setBusy(null);
  };

  return (
    <>
      <div className="panel">
        <div className="panel-h">
          <div className="ic"><Users size={16} /></div>
          <h2>Accounts you own ({data.clients.length})</h2>
          <button className="btn sm gold act" onClick={() => setOpen(true)}><Plus size={14} /> Add client</button>
        </div>
        {data.clients.length === 0 ? (
          <div className="empty">
            <div className="eic"><Users size={22} /></div>
            <h3>No clients yet</h3>
            <p>Every deal you hand off lands here. This list is the relationship the agency can't own — and neither can a closer.</p>
            <button className="btn gold" onClick={() => setOpen(true)}><Plus size={15} /> Add a client</button>
          </div>
        ) : data.clients.map((c) => (
          <div key={c.id} style={{ borderBottom: "1px solid var(--line)", padding: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div className="avatar">{c.name.slice(0, 2).toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div className="name">{c.name}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                  {c.services.map((s) => <span key={s} className="tag svc">{s}</span>)}
                </div>
              </div>
              <div className="right" style={{ alignItems: "center" }}>
                {c.mrr > 0 && <span className="mono" style={{ fontSize: 13, color: "var(--gold)" }}>{fmt(c.mrr)}/mo</span>}
                <select className="select" style={{ width: "auto", padding: "5px 8px", fontSize: 12 }} value={c.status} onChange={(e) => setStatus(c.id, e.target.value)}>
                  <option value="onboarding">onboarding</option>
                  <option value="active">active</option>
                  <option value="at-risk">at-risk</option>
                  <option value="renewing">renewing</option>
                </select>
                <button className="btn sm ghost" onClick={() => findUpsell(c)} disabled={busy === c.id}>
                  {busy === c.id ? <Loader2 size={13} className="spin" /> : <Sparkles size={13} />} Upsell
                </button>
                <button className="btn sm danger" onClick={() => commit({ ...data, clients: data.clients.filter((x) => x.id !== c.id) })}><Trash2 size={14} /></button>
              </div>
            </div>
            {c.upsell && (
              <div className="callout" style={{ marginTop: 12 }}>
                <ArrowUpRight size={16} />
                <div><b>Add {c.upsell.service}.</b> {c.upsell.reason} <span style={{ color: "var(--teal)" }}>Say: "{c.upsell.pitch}"</span></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {open && (
        <Modal title="Add client" onClose={() => setOpen(false)}>
          <Field label="Name"><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Services">
            <div className="chips">{SERVICES.map((s) => <span key={s} className={"chip" + (form.services.includes(s) ? " sel" : "")} onClick={() => toggle(s)}>{s}</span>)}</div>
          </Field>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Status">
              <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="onboarding">onboarding</option><option value="active">active</option>
                <option value="at-risk">at-risk</option><option value="renewing">renewing</option>
              </select>
            </Field>
            <Field label="MRR ($/mo)"><input className="input mono" type="number" value={form.mrr} onChange={(e) => setForm({ ...form, mrr: e.target.value })} /></Field>
          </div>
          <button className="btn gold" style={{ width: "100%", justifyContent: "center", marginTop: 6 }} onClick={add}>Add client</button>
        </Modal>
      )}
    </>
  );
}

/* ------------------------------ BRIEFS ------------------------------------ */
function Briefs({ data }) {
  const [copied, setCopied] = useState(null);
  const briefed = data.deals.filter((d) => d.risk && d.risk.scopeBrief);

  const copy = (d) => {
    const b = d.risk.scopeBrief;
    const txt = `HANDOFF — ${d.client}\nServices: ${d.services.join(", ")} (${fmt(d.price)})\n\nSUMMARY\n${b.summary}\n\nDELIVERABLES\n${(b.deliverables || []).map((x) => "- " + x).join("\n")}\n\nNOT INCLUDED\n${(b.outOfScope || []).map((x) => "- " + x).join("\n")}\n\nTIMELINE\n${b.timeline || ""}\n\nRESET WITH CLIENT\n${(b.expectationsToReset || []).map((x) => "- " + x).join("\n")}`;
    navigator.clipboard?.writeText(txt);
    setCopied(d.id); setTimeout(() => setCopied(null), 1600);
  };

  if (briefed.length === 0) return (
    <div className="panel"><div className="empty">
      <div className="eic"><FileText size={22} /></div>
      <h3>No briefs yet</h3>
      <p>Every deal you run through Scope Guard becomes a clean, copy-ready brief for Mahdy. They'll show up here.</p>
    </div></div>
  );

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
      {briefed.map((d) => (
        <div className="panel" key={d.id}>
          <div className="panel-h">
            <div className="avatar">{d.client.slice(0, 2).toUpperCase()}</div>
            <div><h2>{d.client}</h2><div className="meta" style={{ fontSize: 12, color: "var(--dim)" }}>{d.services.join(" · ")} · {fmt(d.price)}</div></div>
            <span className={"tag " + d.risk.riskLevel} style={{ marginLeft: 10 }}>{d.risk.riskLevel} risk</span>
            <button className="btn sm ghost act" onClick={() => copy(d)}>
              {copied === d.id ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy for Mahdy</>}
            </button>
          </div>
          <div className="brief">
            <h4>Summary</h4><p>{d.risk.scopeBrief.summary}</p>
            {d.risk.scopeBrief.deliverables?.length > 0 && (<><h4>Deliverables</h4><ul>{d.risk.scopeBrief.deliverables.map((x, i) => <li key={i}>{x}</li>)}</ul></>)}
            {d.risk.scopeBrief.outOfScope?.length > 0 && (<><h4>Not included</h4><ul>{d.risk.scopeBrief.outOfScope.map((x, i) => <li key={i} className="out">{x}</li>)}</ul></>)}
            {d.risk.scopeBrief.timeline && (<><h4>Timeline</h4><p>{d.risk.scopeBrief.timeline}</p></>)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ SETTINGS ---------------------------------- */
function SettingsView({ data, commit }) {
  const loadDemo = () => {
    commit({
      settings: { membership: 2500 },
      weeks: [
        { id: uid(), weekLabel: "Jun 16 – 20", booked: 14, closed: 4, dealValue: 11200, membershipCost: 2500 },
        { id: uid(), weekLabel: "Jun 23 – 27", booked: 18, closed: 6, dealValue: 16800, membershipCost: 2500 },
      ],
      clients: [
        { id: uid(), name: "Northside Dental", services: ["SEO Website", "GBP Management"], status: "onboarding", mrr: 600, renewalDate: "", upsell: null },
        { id: uid(), name: "Apex Roofing", services: ["Ad Management"], status: "at-risk", mrr: 1500, renewalDate: "", upsell: null },
        { id: uid(), name: "Bloom Cafe", services: ["SEO Website", "Ad Management", "GBP Management"], status: "renewing", mrr: 1900, renewalDate: "", upsell: null },
      ],
      deals: [
        { id: uid(), client: "Riverside Law", services: ["SEO Website", "Ad Management"], price: 5800, promised: "Closer told them they'd be ranking #1 within a month and that ad spend was included in the price.", status: "awaiting-scope", risk: null, createdAt: Date.now() },
      ],
    });
  };
  const reset = () => { if (confirm("Clear all data? This can't be undone.")) commit(blank); };

  return (
    <>
      <div className="panel">
        <div className="panel-h"><div className="ic"><SettingsIcon size={16} /></div><h2>Workspace</h2></div>
        <div className="callout" style={{ marginBottom: 18 }}>
          <Sparkles size={16} />
          <div>Your data is saved automatically and stays here between sessions. Nothing is shared.</div>
        </div>
        <Field label="Monthly agency membership ($)">
          <input className="input mono" type="number" value={data.settings.membership || ""} onChange={(e) => commit({ ...data, settings: { ...data.settings, membership: +e.target.value || 0 } })} placeholder="2500" />
          <div className="note">Used as the default cost when you log a new agency week.</div>
        </Field>
      </div>

      <div className="panel sec-gap">
        <div className="panel-h"><div className="ic"><ClipboardList size={16} /></div><h2>Demo mode</h2></div>
        <p style={{ fontSize: 13.5, color: "var(--dim)", lineHeight: 1.6, marginBottom: 16 }}>
          Want to walk Mahdy and Aidan through it before the agency starts? Load a sample week, a few clients, and a deal sitting in Scope Guard so every screen has something to show. Clear it anytime.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn gold" onClick={loadDemo}><Sparkles size={15} /> Load sample data</button>
          <button className="btn danger" onClick={reset}><Trash2 size={15} /> Clear everything</button>
        </div>
      </div>
    </>
  );
}

/* ------------------------------- shared ----------------------------------- */
function Field({ label, children }) {
  return <div className="field"><label>{label}</label>{children}</div>;
}
function Modal({ title, onClose, children }) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-h"><h3>{title}</h3><button className="x" onClick={onClose}><X size={20} /></button></div>
        {children}
      </div>
    </div>
  );
}
