"use client";

import { useEffect, useState } from "react";
import "@/styles/mac-header.css";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function getNextSunday1030(): Date {
  const now = new Date();
  const next = new Date(now);
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const daysUntilSunday = (7 - dayOfWeek) % 7;

  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(10, 30, 0, 0);

  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 7);
  }

  return next;
}

function calcTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 7, hours: 0, minutes: 0, seconds: 0 };

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / (24 * 3600)),
    hours: Math.floor((totalSeconds % (24 * 3600)) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

interface MacHeaderProps {
  showTimer?: boolean;
  buttonHref?: string;
  buttonText?: string;
}

export default function MacHeader({
  showTimer = true,
  buttonHref = "/spec-log-info",
  buttonText = "spec-log",
}: MacHeaderProps) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calcTimeLeft> | null>(null);

  useEffect(() => {
    function tick() {
      setTimeLeft(calcTimeLeft(getNextSunday1030()));
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="mac-header-bar">
      {/* macOS traffic light buttons */}
      <div className="mac-header-dots">
        <span className="mac-header-dot-red" />
        <span className="mac-header-dot-yellow" />
        <span className="mac-header-dot-green" />
      </div>

      {/* Timer — se muestra solo en cliente para evitar hydration mismatch */}
      {showTimer ? (
        <span className="mac-header-timer">
          {timeLeft
            ? `· próximo mail · (${pad(timeLeft.days)}-${pad(timeLeft.hours)}-${pad(timeLeft.minutes)}-${pad(timeLeft.seconds)})`
            : "· próximo mail · (--:--:--:--)"}
        </span>
      ) : (
        <div className="flex-1" />
      )}

      {/* Right button */}
      <a
        href={buttonHref}
        target={buttonHref.startsWith("http") ? "_blank" : undefined}
        rel={buttonHref.startsWith("http") ? "noopener noreferrer" : undefined}
        className="mac-header-btn"
      >
        <span className="mac-header-btn-braces">{`{ }`}</span>{" "}
        <span className="mac-header-btn-text">{buttonText}</span>
      </a>
    </header>
  );
}
