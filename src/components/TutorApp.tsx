"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileText,
  Lightbulb,
  Maximize2,
  Paperclip,
  PenLine,
  Play,
  RotateCcw,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { createLesson, examples, followUpElement } from "@/lib/demo-lessons";
import type { BoardElement, Lesson } from "@/types/board";
import { Whiteboard } from "./Whiteboard";

type Attachment = { name: string; size: string };

export function TutorApp() {
  const [inquiry, setInquiry] = useState("");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [checkpointComplete, setCheckpointComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealAll, setRevealAll] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [followUps, setFollowUps] = useState<BoardElement[]>([]);
  const [revealMenu, setRevealMenu] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [plannerNotice, setPlannerNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const startLesson = useCallback(async (prompt: string) => {
    const nextPrompt = prompt.trim() || "Help me understand this inquiry visually.";
    setInquiry(nextPrompt);
    setCheckpointComplete(false);
    setSelectedAnswer(null);
    setRevealAll(false);
    setFollowUps([]);
    setPlannerNotice(null);
    setPlanning(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiry: nextPrompt, context: null }),
      });
      const payload = await response.json();
      if (response.ok && payload.lesson) {
        setLesson(payload.lesson as Lesson);
      } else if (payload.code === "AI_NOT_CONFIGURED") {
        setLesson(createLesson(nextPrompt));
        setPlannerNotice("AI planner is not configured here, so you are seeing a demonstration board.");
      } else {
        setPlannerNotice(payload.error ?? "The tutor could not create a board. Please try again.");
      }
    } catch {
      setPlannerNotice("The tutor could not reach the planner. Please try again.");
    } finally {
      setPlanning(false);
    }
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!inquiry.trim() && !attachment) return;
    startLesson(inquiry || `Explain the attached file: ${attachment?.name}`);
  }

  function handleFile(file?: File) {
    if (!file) return;
    const size = file.size > 1_000_000 ? `${(file.size / 1_000_000).toFixed(1)} MB` : `${Math.ceil(file.size / 1000)} KB`;
    setAttachment({ name: file.name, size });
  }

  function answerCheckpoint(index: number) {
    setSelectedAnswer(index);
    if (index === lesson?.checkpoint.answer) {
      window.setTimeout(() => setCheckpointComplete(true), 420);
    }
  }

  function submitFollowUp(event: FormEvent) {
    event.preventDefault();
    if (!followUp.trim()) return;
    setFollowUps((items) => [...items, followUpElement(followUp.trim(), items.length)]);
    setFollowUp("");
  }

  if (!lesson) {
    return (
      <main className="landing">
        <nav className="topbar landing-nav">
          <div className="brand"><span className="brand-mark"><PenLine size={18} /></span>visually</div>
          <div className="nav-note"><span className="status-dot" />AI board tutor</div>
        </nav>

        <section className="hero">
          <div className="eyebrow"><Sparkles size={14} /> A tutor that thinks on the board</div>
          <h1>Don’t just tell me.<br /><em>Show me.</em></h1>
          <p className="hero-copy">Bring a question, a problem, or a difficult idea. Your tutor will draw it out, check where you’re stuck, and help you see the next step.</p>

          <form className="inquiry-card" onSubmit={handleSubmit}>
            <div className="input-label"><span>What are you working through?</span><span className="optional">Add context if you have it</span></div>
            <textarea
              value={inquiry}
              onChange={(event) => setInquiry(event.target.value)}
              placeholder="Paste a problem, ask a question, or describe what isn’t clicking…"
              rows={4}
              autoFocus
            />
            {attachment && (
              <div className="attachment-chip"><FileText size={15} /><span>{attachment.name}</span><small>{attachment.size}</small><button type="button" onClick={() => setAttachment(null)} aria-label="Remove attachment"><X size={14} /></button></div>
            )}
            <div className="composer-actions">
              <input ref={fileRef} type="file" accept="image/*,.pdf,.txt,.md" hidden onChange={(event) => handleFile(event.target.files?.[0])} />
              <button className="attach-button" type="button" onClick={() => fileRef.current?.click()}><Paperclip size={17} /> Add image or PDF</button>
              <button className="primary-button" type="submit" disabled={planning || (!inquiry.trim() && !attachment)}>{planning ? "Planning board…" : "Open the board"} <ArrowRight size={17} /></button>
            </div>
            {plannerNotice && <p className="planner-notice" role="status">{plannerNotice}</p>}
          </form>

          <div className="try-row">
            <span>Try an example</span>
            {examples.map((example) => <button key={example.label} disabled={planning} onClick={() => startLesson(example.prompt)}>{example.label}</button>)}
          </div>
        </section>

        <section className="promise-row">
          <div><span>01</span><strong>Starts from your work</strong><p>Upload the problem and any context you already have.</p></div>
          <div><span>02</span><strong>Checks, then adapts</strong><p>Small visual prompts locate the actual point of confusion.</p></div>
          <div><span>03</span><strong>You control spoilers</strong><p>Ask for a nudge, one step, or the complete walkthrough.</p></div>
        </section>
      </main>
    );
  }

  const isCorrect = selectedAnswer === lesson.checkpoint.answer;

  return (
    <main className="workspace">
      <nav className="topbar workspace-nav">
        <button className="brand brand-button" onClick={() => { setLesson(null); setPlannerNotice(null); }}><span className="brand-mark"><PenLine size={18} /></span>visually</button>
        <div className="lesson-meta"><span>{lesson.subject}</span><strong>{lesson.title}</strong></div>
        <div className="workspace-actions">
          <button title="Restart lesson" disabled={planning} onClick={() => startLesson(inquiry)}><RotateCcw size={17} /></button>
          <button title="Full screen"><Maximize2 size={17} /></button>
          <div className="reveal-wrap">
            <button className="reveal-button" onClick={() => setRevealMenu((open) => !open)}><Lightbulb size={16} /> Help level <ChevronDown size={14} /></button>
            {revealMenu && (
              <div className="reveal-menu">
                <button onClick={() => setRevealMenu(false)}><span>Nudge me</span><small>Keep me thinking</small></button>
                <button onClick={() => { setCheckpointComplete(true); setRevealMenu(false); }}><span>Show next step</span><small>Reveal one move</small></button>
                <button onClick={() => { setRevealAll(true); setCheckpointComplete(true); setRevealMenu(false); }}><span>Show full solution</span><small>No more pauses</small></button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <section className="studio">
        <aside className="lesson-rail">
          <div className="rail-heading"><BookOpen size={16} /><span>Today’s board</span></div>
          <div className="rail-step active"><span>1</span><div><strong>See the structure</strong><small>In progress</small></div></div>
          <div className={`rail-step ${checkpointComplete ? "complete" : ""}`}><span>2</span><div><strong>Try a move</strong><small>{checkpointComplete ? "Complete" : "Quick check"}</small></div></div>
          <div className={`rail-step ${checkpointComplete ? "active" : "locked"}`}><span>3</span><div><strong>Connect the pieces</strong><small>Visual recap</small></div></div>
          <div className="rail-context"><Upload size={15} /><div><strong>Your inquiry</strong><p>{inquiry}</p>{attachment && <small>{attachment.name} · upload reading is coming next</small>}</div></div>
        </aside>

        <div className="board-stage">
          <div className="board-status"><span className={drawing ? "drawing live" : "drawing"} />{drawing ? "Tutor is drawing…" : "Board ready"}</div>
          <Whiteboard lesson={lesson} revealAll={revealAll} checkpointComplete={checkpointComplete} followUps={followUps} onDrawingChange={setDrawing} />
        </div>

        <aside className="interaction-panel">
          <div className="interaction-heading"><Sparkles size={16} /><span>Check in</span></div>
          {!checkpointComplete ? (
            <div className="checkpoint-card">
              <span className="mini-label">Before we continue</span>
              <h2>{lesson.checkpoint.question}</h2>
              <div className="answer-list">
                {lesson.checkpoint.options.map((option, index) => (
                  <button
                    key={option}
                    className={`${selectedAnswer === index ? "selected" : ""} ${selectedAnswer === index && isCorrect ? "correct" : ""} ${selectedAnswer === index && !isCorrect ? "incorrect" : ""}`}
                    onClick={() => answerCheckpoint(index)}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>{option}
                  </button>
                ))}
              </div>
              {selectedAnswer !== null && (
                <p className={`feedback ${isCorrect ? "correct-text" : ""}`}>{isCorrect ? lesson.checkpoint.explanation : "Not quite. Trace the quantities on the board once more—then try another option."}</p>
              )}
              <button className="skip-button" onClick={() => { setCheckpointComplete(true); setRevealAll(true); }}><Play size={14} /> Just show me</button>
            </div>
          ) : (
            <div className="checkpoint-card success-card">
              <span className="success-mark">✓</span>
              <span className="mini-label">Connection made</span>
              <h2>Nice. The board has the next move.</h2>
              <p>{lesson.checkpoint.explanation}</p>
            </div>
          )}

          <form className="follow-up-form" onSubmit={submitFollowUp}>
            <label htmlFor="follow-up">Ask about anything on the board</label>
            <div><input id="follow-up" value={followUp} onChange={(event) => setFollowUp(event.target.value)} placeholder="Why does that step work?" /><button aria-label="Ask follow-up" disabled={!followUp.trim()}><ArrowRight size={16} /></button></div>
            <small>In the demo, this adds a board note. Live AI follow-ups are the next planner capability.</small>
          </form>
        </aside>
      </section>
    </main>
  );
}
