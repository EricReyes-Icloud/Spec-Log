"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import "@/styles/end-log.css";

type Phase =
  | "IDLE"
  | "TYPING_PROMPT"
  | "TYPING_BODY_1"
  | "TYPING_BODY_2"
  | "TYPING_BODY_3"
  | "TYPING_CLOSING"
  | "COMPLETE";

/* ── Data model ── */

interface LineSeg {
  text: string;
  className: string;
}

/** A single typed line with its full text and character-by-character progress */
interface TypedLine {
  segments: LineSeg[];
}

/** A group of lines (paragraph) with metadata */
interface ParagraphGroup {
  lines: LineSeg[][];
  afterPauseMs: number;   // pause after entire paragraph is typed
  phase: Phase;            // which phase we're in while typing this
}

const PARAGRAPHS: ParagraphGroup[] = [
  {
    lines: [
      [
        { text: "spec-log", className: "endlog-prompt-green" },
        { text: ":", className: "endlog-prompt-white" },
        { text: "~", className: "endlog-prompt-blue" },
        { text: "$", className: "endlog-prompt-yellow" },
        { text: " Gracias por llegar hasta aqui.", className: "endlog-prompt-white" },
      ],
    ],
    afterPauseMs: 3000,
    phase: "TYPING_PROMPT",
  },
  {
    lines: [
      [
        { text: ">", className: "endlog-prompt-orange" },
        { text: " Si llegaste hasta este punto,", className: "endlog-prompt-white" },
      ],
      [{ text: "  probablemente te interesa algo más", className: "endlog-prompt-white" }],
      [{ text: "  que acumular tutoriales.", className: "endlog-prompt-white" }],
    ],
    afterPauseMs: 4000,
    phase: "TYPING_BODY_1",
  },
  {
    lines: [
      [{ text: "", className: "endlog-prompt-white" }],
    ],
    afterPauseMs: 0,
    phase: "TYPING_BODY_1",
  },
  {
    lines: [
      [
        { text: ">", className: "endlog-prompt-orange" },
        { text: " Quizás te interesa construir,", className: "endlog-prompt-white" },
      ],
      [{ text: "  aprender y documentar el proceso.", className: "endlog-prompt-white" }],
    ],
    afterPauseMs: 3500,
    phase: "TYPING_BODY_2",
  },
  {
    lines: [
      [{ text: "", className: "endlog-prompt-white" }],
    ],
    afterPauseMs: 0,
    phase: "TYPING_BODY_2",
  },
  {
    lines: [
      [
        { text: ">", className: "endlog-prompt-orange" },
        { text: " Eso es exactamente lo que", className: "endlog-prompt-white" },
      ],
      [{ text: "  encontrarás en", className: "endlog-prompt-white" },
       { text: " Spec Log", className: "endlog-prompt-orange" },
       { text: ".", className: "endlog-prompt-white" }
      ],
    ],
    afterPauseMs: 2000,
    phase: "TYPING_BODY_3",
  },
  {
    lines: [
      [{ text: "", className: "endlog-prompt-white" }],
    ],
    afterPauseMs: 0,
    phase: "TYPING_BODY_3",
  },
  {
    lines: [
      [
        { text: ">", className: "endlog-prompt-orange" },
        { text: " Solo se trata de tomar una pequeña desición:", className: "endlog-prompt-white" },
      ],
    ],
    afterPauseMs: 2500,
    phase: "TYPING_CLOSING",
  },
];

const TYPE_SPEED_MS = 50;

/* ── Component ── */

export default function EndLog() {
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [lines, setLines] = useState<TypedLine[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* ── Timer helpers ── */

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const wait = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  /* ── Build flat list of all lines with character-by-character info ── */

  const buildFlatLines = useCallback(() => {
    const flat: { segments: LineSeg[]; totalChars: number }[] = [];
    for (const group of PARAGRAPHS) {
      for (const segs of group.lines) {
        const total = segs.reduce((acc, s) => acc + s.text.length, 0);
        flat.push({ segments: segs, totalChars: total });
      }
    }
    return flat;
  }, []);

  /* ── Typewriter engine ── */

  const startTyping = useCallback(() => {
    const flatLines = buildFlatLines();
    let lineIdx = 0;
    // "spec-log:~$ " = 7+1+1+1+1 = 11 chars (prompt segments 0-3 + leading space in seg 4)
    const PROMPT_LENGTH = 11;

    // Pre-allocate lines: first line shows prompt + trailing space, rest are empty
    const initialized: TypedLine[] = flatLines.map((fl, idx) => {
      if (idx === 0) {
        return {
          segments: fl.segments.map((seg, sIdx) =>
            sIdx < 4
              ? { text: seg.text, className: seg.className }         // "spec-log", ":", "~", "$"
              : sIdx === 4
                ? { text: " ", className: seg.className }             // space after "$"
                : { text: "", className: seg.className },
          ),
        };
      }
      return {
        segments: fl.segments.map(() => ({ text: "", className: fl.segments[0]?.className || "endlog-prompt-white" })),
      };
    });
    setLines(initialized);

    // Show terminal IMMEDIATELY with prompt + space + cursor blinking
    setPhase("TYPING_PROMPT");
    setShowCursor(true);
    setIsTyping(false); // cursor blinks during initial delay

    // Start from PROMPT_LENGTH+1 so the first tick produces "G" (visible change)
    let charIdx = PROMPT_LENGTH + 1;

    const tick = () => {
      if (lineIdx >= flatLines.length) {
        // All lines done — complete
        setIsTyping(false);
        setPhase("COMPLETE");
        wait(() => {
          setShowCursor(false);
          wait(() => setShowButton(true), 1000);
        }, 1500);
        return;
      }

      const currentLine = flatLines[lineIdx];
      const currentSegs = currentLine.segments;

      // Update line in state
      setLines((prev) => {
        const copy = prev.map((l) => ({
          segments: l.segments.map((s) => ({ ...s })),
        }));

        if (!copy[lineIdx]) return copy;

        let remaining = charIdx;
        const newSegs: LineSeg[] = [];

        for (const seg of currentSegs) {
          if (remaining <= 0) {
            newSegs.push({ text: "", className: seg.className });
          } else if (remaining >= seg.text.length) {
            newSegs.push({ text: seg.text, className: seg.className });
            remaining -= seg.text.length;
          } else {
            newSegs.push({ text: seg.text.slice(0, remaining), className: seg.className });
            remaining = 0;
          }
        }

        copy[lineIdx] = { segments: newSegs };
        return copy;
      });

      charIdx++;

      if (charIdx > currentLine.totalChars) {
        // This line is complete — move to next
        charIdx = 0;
        lineIdx++;

        // Check if we finished a paragraph group
        let accLines = 0;
        let foundGroup: ParagraphGroup | null = null;

        for (const group of PARAGRAPHS) {
          accLines += group.lines.length;
          if (lineIdx < accLines) {
            // Still inside this group — no pause
            foundGroup = null;
            break;
          }
          if (lineIdx === accLines) {
            // Exactly at the boundary — this group is done
            foundGroup = group;
            break;
          }
        }

        if (foundGroup && lineIdx < flatLines.length) {
          // Paragraph done — pause (cursor blinks during pause)
          setIsTyping(false);
          setPhase(foundGroup.phase === "TYPING_CLOSING" ? "COMPLETE" : foundGroup.phase);
          wait(() => tick(), foundGroup.afterPauseMs);
        } else if (lineIdx >= flatLines.length) {
          // All done
          setIsTyping(false);
          setPhase("COMPLETE");
          wait(() => {
            setShowCursor(false);
            wait(() => setShowButton(true), 1000);
          }, 1500);
        } else {
          // Next line same paragraph — small inter-line delay (keep typing state)
          wait(() => tick(), 40);
        }
        return;
      }

      // Actively typing characters — cursor stays solid
      setIsTyping(true);
      wait(() => tick(), TYPE_SPEED_MS);
    };

    // Wait 5s so user sees prompt + cursor, then start typing
    wait(() => tick(), 5000);
  }, [buildFlatLines, wait]);

  /* ── IntersectionObserver ── */

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (prefersReduced) {
          // Show everything immediately
          const allLines: TypedLine[] = [];
          for (const group of PARAGRAPHS) {
            for (const segs of group.lines) {
              allLines.push({ segments: segs.map((s) => ({ ...s })) });
            }
          }
          setLines(allLines);
          setPhase("COMPLETE");
          setShowCursor(false);
          setShowButton(true);
          return;
        }

        // Start animation
        startTyping();
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearAll();
    };
  }, [startTyping, clearAll]);

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => clearAll();
  }, [clearAll]);

  /* ── Render ── */

  return (
    <section aria-label="Final" className="endlog-section">
      <p className="endlog-comment">{`< !--- end.log --- >`}</p>

      <div ref={containerRef} className="endlog-terminal">
        {/* Terminal header — Mac dots */}
        <div className="endlog-terminal-header">
          <span className="endlog-dot endlog-dot-red" />
          <span className="endlog-dot endlog-dot-yellow" />
          <span className="endlog-dot endlog-dot-green" />
        </div>

        {/* Terminal body */}
        <div className="endlog-body">
          {phase !== "IDLE" && (
            <>
              {(() => {
                // Last line that has any content → cursor goes here
                let activeLineIdx = 0;
                for (let i = lines.length - 1; i >= 0; i--) {
                  if (lines[i].segments.some((s) => s.text.length > 0)) {
                    activeLineIdx = i;
                    break;
                  }
                }
                return lines.map((line, i) => (
                  <span key={i} className="endlog-line">
                    {line.segments.map((seg, j) => (
                      <span key={j} className={seg.className}>
                        {seg.text}
                      </span>
                    ))}
                    {showCursor && i === activeLineIdx && (
                      <span className={`endlog-cursor${isTyping ? "" : " blink"}`}>█</span>
                    )}
                  </span>
                ));
              })()}
            </>
          )}
        </div>
      </div>

      {/* CTA button */}
      <button
        className={`endlog-btn${showButton ? " visible" : ""}`}
        onClick={() =>
          document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        ↑ Unirme a Spec Log
      </button>
    </section>
  );
}
