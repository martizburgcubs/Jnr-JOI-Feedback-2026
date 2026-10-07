"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, BarChart3, Download, FileText, LogOut, RefreshCw, ShieldCheck } from "lucide-react";
import { AREA_OPTIONS, RatingField, RATING_FIELDS } from "@/app/lib/survey";

type Row = {
  id: string; createdAt: string; school: string; division: string;
  communication: number; infoPack: number; gameFormat: number; scheduling: number; officiating: number;
  facilities: number; organisation: number; hosting: number; accommodation: number; meals: number; overall: number;
  schedulePace: string; strengths: string; priorityArea: string; highlight: string; improvement: string; returnIntent: string; comments: string;
};

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((result, value) => ({ ...result, [value]: (result[value] || 0) + 1 }), {});
}

export default function AdminDashboard() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/data", { cache: "no-store" });
      if (response.status === 401) { setLocked(true); setRows(null); return; }
      if (!response.ok) throw new Error("Could not load responses.");
      const result = await response.json() as { responses: Row[] };
      setRows(result.responses); setLocked(false);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load responses."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ passcode: form.get("passcode") }) });
    if (!response.ok) {
      const result = await response.json().catch(() => ({})) as { error?: string };
      setError(result.error || "Incorrect passcode. Please try again.");
      return;
    }
    await load();
  }

  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); setLocked(true); setRows(null); }

  if (locked) return <main className="admin-login"><div className="login-card"><Image src="/joi-logo.png" alt="Junior JOI" width={104} height={104} priority /><span className="section-tag">Organiser dashboard</span><h1>Feedback results</h1><p>Enter the organiser passcode to view responses and export reports.</p><form onSubmit={login}><label className="input-field"><span>Passcode</span><input name="passcode" type="password" required autoFocus placeholder="Enter passcode" /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" type="submit"><ShieldCheck size={18} /> Open dashboard</button></form><Link href="/"><ArrowLeft size={15} /> Back to survey</Link></div></main>;

  if (loading || !rows) return <main className="admin-login"><div className="loading-mark"><RefreshCw className="spin" /><p>Loading feedback…</p></div></main>;

  return <Dashboard rows={rows} error={error} refresh={load} logout={logout} />;
}

function Dashboard({ rows, error, refresh, logout }: { rows: Row[]; error: string; refresh: () => void; logout: () => void }) {
  const averages = useMemo(() => Object.fromEntries(RATING_FIELDS.map(([key]) => {
    const rated = rows.map((row) => row[key as RatingField]).filter((value) => value > 0);
    return [key, rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : 0];
  })) as Record<RatingField, number>, [rows]);
  const strengths = useMemo(() => countBy(rows.flatMap((row) => { try { return JSON.parse(row.strengths) as string[]; } catch { return []; } })), [rows]);
  const priorities = useMemo(() => countBy(rows.map((row) => row.priorityArea)), [rows]);
  const schedule = useMemo(() => countBy(rows.map((row) => row.schedulePace)), [rows]);
  const returnPositive = rows.length ? Math.round(rows.filter((row) => ["Definitely", "Probably"].includes(row.returnIntent)).length / rows.length * 100) : 0;
  const overall = averages.overall || 0;

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div className="brand-lockup"><Image src="/joi-logo.png" alt="Junior JOI" width={68} height={68} /><div><span className="eyebrow">Junior JOI · 2026</span><p>Feedback dashboard</p></div></div>
        <div className="dashboard-actions"><button onClick={refresh}><RefreshCw size={16} /> Refresh</button><a href="/api/admin/export"><Download size={16} /> Export CSV</a><button onClick={() => window.print()}><FileText size={16} /> Save PDF</button><button onClick={logout} className="quiet"><LogOut size={16} /> Log out</button></div>
      </header>
      <section className="report-title"><div><span className="section-tag">Live tournament report</span><h1>What participants are telling us</h1><p>Junior JOI 2026 · Generated {new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</p></div><div className="response-stamp"><strong>{rows.length}</strong><span>{rows.length === 1 ? "response" : "responses"}</span></div></section>
      {error && <p className="form-error">{error}</p>}
      {!rows.length ? <section className="empty-state"><BarChart3 size={42} /><h2>No responses yet</h2><p>Share the public survey link. Results will appear here as soon as the first response is submitted.</p><Link className="primary-button" href="/">Open survey</Link></section> : <>
        <section className="metric-grid"><article className="metric-feature"><span>Overall experience</span><strong>{overall.toFixed(1)}<small>/5</small></strong><div className="score-line"><i style={{ width: `${overall / 5 * 100}%` }} /></div></article><article><span>Would return</span><strong>{returnPositive}%</strong><p>Definitely or probably</p></article><article><span>Schools represented</span><strong>{new Set(rows.map((row) => row.school.toLowerCase())).size}</strong><p>Unique school names</p></article><article><span>Latest response</span><strong className="date-metric">{new Date(rows[0].createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</strong><p>{new Date(rows[0].createdAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}</p></article></section>
        <section className="report-grid"><article className="report-card wide"><div className="card-heading"><div><span className="mini-label">Average rating</span><h2>Performance by area</h2></div><span className="scale-note">out of 5</span></div><div className="bar-list">{RATING_FIELDS.map(([key, label]) => <div className="bar-row" key={key}><span>{label}</span><div><i style={{ width: `${averages[key] / 5 * 100}%` }} /></div><strong>{averages[key] ? averages[key].toFixed(1) : "—"}</strong></div>)}</div></article>
          <article className="report-card"><div className="card-heading"><div><span className="mini-label">Most selected</span><h2>What worked well</h2></div></div><RankedList data={strengths} total={rows.length} order={[...AREA_OPTIONS]} /></article>
          <article className="report-card"><div className="card-heading"><div><span className="mini-label">Priority</span><h2>Needs improvement</h2></div></div><RankedList data={priorities} total={rows.length} order={[...AREA_OPTIONS, "None — keep it as is"]} coral /></article>
          <article className="report-card"><div className="card-heading"><div><span className="mini-label">Tournament flow</span><h2>How the schedule felt</h2></div></div><RankedList data={schedule} total={rows.length} order={["Well balanced", "Slightly compressed", "Too compressed", "Too spread out"]} /></article>
        </section>
        <section className="report-card comments-card"><div className="card-heading"><div><span className="mini-label">Written feedback</span><h2>Highlights & recommendations</h2></div><span className="scale-note">{rows.filter((row) => row.highlight || row.improvement || row.comments).length} with comments</span></div><div className="comment-list">{rows.filter((row) => row.highlight || row.improvement || row.comments).map((row) => <article key={row.id}><div className="comment-meta"><strong>{row.school}</strong><span>{row.division}</span></div>{row.highlight && <blockquote><b>Highlight</b>{row.highlight}</blockquote>}{row.improvement && <blockquote><b>Most important improvement</b>{row.improvement}</blockquote>}{row.comments && <blockquote><b>Additional comment</b>{row.comments}</blockquote>}</article>)}</div></section>
        <section className="report-card response-table-card"><div className="card-heading"><div><span className="mini-label">Response register</span><h2>All submissions</h2></div></div><div className="table-scroll"><table><thead><tr><th>Date</th><th>School</th><th>Division</th><th>Overall</th><th>Return?</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{new Date(row.createdAt).toLocaleDateString("en-ZA")}</td><td>{row.school}</td><td>{row.division}</td><td>{row.overall}/5</td><td>{row.returnIntent}</td></tr>)}</tbody></table></div></section>
      </>}
      <footer className="report-footer"><p>Junior JOI 2026 Tournament Feedback</p><span>Confidential organiser report</span></footer>
    </main>
  );
}

function RankedList({ data, total, order, coral = false }: { data: Record<string, number>; total: number; order: string[]; coral?: boolean }) {
  const ranked = order.filter((label) => data[label]).sort((a, b) => (data[b] || 0) - (data[a] || 0));
  if (!ranked.length) return <p className="no-data">No data available yet.</p>;
  return <div className={`ranked-list ${coral ? "coral" : ""}`}>{ranked.map((label) => <div key={label}><span>{label}</span><strong>{data[label]}</strong><div><i style={{ width: `${data[label] / total * 100}%` }} /></div></div>)}</div>;
}
