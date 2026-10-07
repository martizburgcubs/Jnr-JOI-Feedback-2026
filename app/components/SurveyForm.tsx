"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Check, CheckCircle2, RotateCcw } from "lucide-react";
import { AREA_OPTIONS, DIVISION_OPTIONS, RatingField, RATING_FIELDS, ratingLabels } from "@/app/lib/survey";

const emptyRatings = Object.fromEntries(RATING_FIELDS.map(([key]) => [key, null])) as Record<RatingField, number | null>;

function FieldHeading({ number, title, hint }: { number: string; title: string; hint?: string }) {
  return <div className="field-heading"><span>{number}</span><div><h2>{title}</h2>{hint && <p>{hint}</p>}</div></div>;
}

export default function SurveyForm() {
  const [ratings, setRatings] = useState(emptyRatings);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [ratingError, setRatingError] = useState(false);
  const completedRatings = useMemo(() => Object.values(ratings).filter((value) => value !== null).length, [ratings]);

  function toggleStrength(value: string) {
    setStrengths((current) => current.includes(value) ? current.filter((item) => item !== value) : current.length < 3 ? [...current, value] : current);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (completedRatings !== RATING_FIELDS.length) {
      setRatingError(true);
      document.getElementById("ratings")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!strengths.length) { setError("Please select at least one thing Junior JOI did well."); return; }
    const form = new FormData(event.currentTarget);
    const payload = {
      school: form.get("school"), division: form.get("division"), ratings,
      schedulePace: form.get("schedulePace"), strengths, priorityArea: form.get("priorityArea"),
      highlight: form.get("highlight"), improvement: form.get("improvement"), returnIntent: form.get("returnIntent"),
      comments: form.get("comments"), website: form.get("website"),
    };
    setStatus("sending");
    try {
      const response = await fetch("/api/responses", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Submission failed");
      setStatus("done"); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caught) {
      setStatus("idle"); setError(caught instanceof Error ? caught.message : "We could not save your response. Please try again.");
    }
  }

  if (status === "done") return <section className="survey-card thank-you"><div className="success-icon"><CheckCircle2 size={34} /></div><span className="section-tag">Response received</span><h2>Thank you for helping Junior JOI improve.</h2><p>Your feedback has been saved and will be reviewed by the tournament organisers.</p><button type="button" className="text-button" onClick={() => window.location.reload()}><RotateCcw size={16} /> Submit another response</button></section>;

  return (
    <form className="survey-card" onSubmit={submit}>
      <section className="form-section">
        <FieldHeading number="01" title="About your experience" hint="This helps us understand the context of your feedback." />
        <div className="field-grid two">
          <label className="input-field"><span>School <b>*</b></span><input name="school" placeholder="Enter your school" required minLength={2} maxLength={120} /></label>
          <label className="input-field"><span>Division <b>*</b></span><select name="division" required defaultValue=""><option value="" disabled>Select division</option>{DIVISION_OPTIONS.map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
      </section>
      <section className="form-section" id="ratings">
        <FieldHeading number="02" title="Rate the tournament" hint="Choose one answer per row." />
        <div className="rating-progress"><span>{completedRatings} of {RATING_FIELDS.length} rated</span><div><i style={{ width: `${completedRatings / RATING_FIELDS.length * 100}%` }} /></div></div>
        <div className="rating-table">
          <div className="rating-head"><span>Area</span>{[1,2,3,4,5].map((value) => <span key={value}><b>{value}</b><small>{ratingLabels[value]}</small></span>)}</div>
          {RATING_FIELDS.map(([key, label]) => <fieldset className="rating-row" key={key}><legend>{label}</legend><div>{[1,2,3,4,5].map((value) => <label key={value} title={ratingLabels[value]} className={ratings[key] === value ? "selected" : ""}><input type="radio" name={key} value={value} checked={ratings[key] === value} onChange={() => { setRatings((current) => ({ ...current, [key]: value })); setRatingError(false); }} /><span>{value}<small>{ratingLabels[value]}</small></span></label>)}</div></fieldset>)}
        </div>
        {ratingError && <p className="inline-error">Please rate every area.</p>}
      </section>
      <section className="form-section">
        <FieldHeading number="03" title="A few quick choices" />
        <div className="choice-block"><h3>How did the schedule feel? <b>*</b></h3><div className="pill-options">{["Too compressed", "Slightly compressed", "Well balanced", "Too spread out"].map((value) => <label key={value}><input required type="radio" name="schedulePace" value={value} /><span>{value}</span></label>)}</div></div>
        <div className="choice-block"><h3>What did Junior JOI do well? <b>*</b></h3><p>Select up to three.</p><div className="pill-options checks">{AREA_OPTIONS.map((value) => <label key={value} className={strengths.includes(value) ? "chosen" : ""}><input type="checkbox" checked={strengths.includes(value)} onChange={() => toggleStrength(value)} disabled={!strengths.includes(value) && strengths.length >= 3} /><span><Check size={14} />{value}</span></label>)}</div></div>
        <div className="choice-block"><h3>Which one area needs the most improvement? <b>*</b></h3><div className="field-grid"><label className="input-field"><select name="priorityArea" required defaultValue=""><option value="" disabled>Select one area</option>{AREA_OPTIONS.map((value) => <option key={value}>{value}</option>)}<option>None — keep it as is</option></select></label></div></div>
        <div className="choice-block"><h3>Would your school participate again? <b>*</b></h3><div className="pill-options">{["Definitely", "Probably", "Unsure", "Probably not", "Definitely not"].map((value) => <label key={value}><input required type="radio" name="returnIntent" value={value} /><span>{value}</span></label>)}</div></div>
      </section>
      <section className="form-section">
        <FieldHeading number="04" title="In your own words" hint="Short answers are perfect." />
        <div className="field-grid two">
          <label className="input-field"><span>What was the tournament highlight? <b>*</b></span><textarea name="highlight" required minLength={1} maxLength={500} rows={4} placeholder="A moment, experience or detail that stood out…" /></label>
          <label className="input-field"><span>What is the one most important improvement? <b>*</b></span><textarea name="improvement" required minLength={1} maxLength={500} rows={4} placeholder="The change that would make the biggest difference…" /></label>
        </div>
        <label className="input-field full"><span>Anything else you would like us to know? <b>*</b></span><textarea name="comments" required minLength={1} maxLength={800} rows={4} placeholder="Enter your comments, or type None" /></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </section>
      <div className="submit-zone"><div><strong>Ready to send?</strong><p>You will not be able to edit your response after submitting.</p></div><button className="primary-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : <>Submit feedback <ArrowRight size={18} /></>}</button></div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
