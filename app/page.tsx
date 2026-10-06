import Image from "next/image";
import Link from "next/link";
import { Clock3, LockKeyhole } from "lucide-react";
import SurveyForm from "./components/SurveyForm";

export default function Home() {
  return (
    <main className="site-shell">
      <div className="court-lines" aria-hidden="true" />
      <header className="survey-header">
        <div className="brand-lockup">
          <Image src="/joi-logo.png" alt="Jenny Orchard Invitational Tournament" width={92} height={92} priority />
          <div><span className="eyebrow">Junior JOI · 2026</span><p>Tournament feedback</p></div>
        </div>
        <div className="time-chip"><Clock3 size={16} /> About 5 minutes</div>
      </header>
      <section className="hero">
        <div className="hero-copy">
          <span className="section-tag">Help us raise the game</span>
          <h1>Your experience shapes the next Junior JOI.</h1>
          <p>Thank you for being part of the tournament. Tell us what worked, what could be sharper, and where we should focus next. Responses are reviewed by the tournament organisers.</p>
          <div className="hero-note"><span>01</span><p>Quick ratings</p><span>02</span><p>Two short comments</p></div>
        </div>
        <div className="hero-ball-wrap" aria-hidden="true">
          <div className="hero-ball"><i className="ball-line line-one" /><i className="ball-line line-two" /><i className="ball-line line-three" /></div>
          <span>JUNIOR JOI · 2026</span>
        </div>
      </section>
      <SurveyForm />
      <footer className="site-footer"><p>Junior JOI 2026 · Thank you for helping us improve.</p><Link href="/admin"><LockKeyhole size={14} /> Organiser access</Link></footer>
    </main>
  );
}
