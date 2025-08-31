'use client';

import React, { useEffect, useMemo, useState } from 'react';

type Stats = { count: number; sum: number; average: number; distribution: number[] };

export default function HeartRating({
  slug = 'contact-feedback',
  max = 10,
  className = '',
}: {
  slug?: string;
  max?: number;
  className?: string;
}) {
  const [stats, setStats] = useState<Stats>({
    count: 0,
    sum: 0,
    average: 0,
    distribution: Array(11).fill(0),
  });
  const [value, setValue] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const groupId = useMemo(() => 'hrt-' + String(slug), [slug]);
  const filled = hover ?? value ?? 0; // câte să fie colorate (preview vs selectat)

  // Ia statistica + votul local
  useEffect(() => {
    let ignore = false;

    fetch('/api/rating?slug=' + encodeURIComponent(String(slug)))
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (!ignore) setStats(data);
      })
      .catch(() => {});

    const saved = localStorage.getItem('rated:' + String(slug));
    if (saved) setValue(Number(saved));

    return () => {
      ignore = true;
    };
  }, [slug]);

  async function submitVote(v: number) {
    setValue(v);
    localStorage.setItem('rated:' + String(slug), String(v));
    try {
      const res = await fetch('/api/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, value: v }),
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch {
      // ignore
    }
  }

  // navigare din tastatură (pe tot grupul)
  function onGroupKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min((value ?? 0) + 1 || 1, max);
      submitVote(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prev = Math.max((value ?? 0) - 1 || 1, 1);
      submitVote(prev);
    } else if (e.key === 'Home') {
      e.preventDefault();
      submitVote(1);
    } else if (e.key === 'End') {
      e.preventDefault();
      submitVote(max);
    }
  }

  return (
    <div className={'hrt-wrap ' + (className || '')}>
      <div
        id={groupId}
        className="hrt-group"
        role="group"
        aria-label="Acordă o notă (1-10)"
        tabIndex={0}
        onKeyDown={onGroupKeyDown}
      >
        {/* 1..10 stânga → dreapta */}
        {Array.from({ length: max }).map((_, i) => {
          const val = i + 1;
          const active = val <= filled;
          return (
            <button
              key={groupId + '-' + val}
              type="button"
              className="hrt-btn"
              data-active={active ? 'true' : 'false'}
              aria-label={val + ' din 10'}
              title={val + '/10'}
              onMouseEnter={() => setHover(val)}
              onMouseLeave={() => setHover(null)}
              onClick={() => submitVote(val)}
            >
              <svg viewBox="0 0 24 24" className="hrt-icon" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          );
        })}
      </div>

      <div className="hrt-legend" aria-live="polite">
        <span className="hrt-avg">{stats.average.toFixed(1)}</span>
        <span className="hrt-sep">/10</span>
        <span className="hrt-count">({stats.count} vot{stats.count === 1 ? '' : 'uri'})</span>
      </div>

      {/* CSS scoped – neutralizează orice reguli globale, fără inline styles */}
      <style jsx>{`
        .hrt-wrap {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .hrt-group {
          display: flex;
          gap: 6px;
          outline: none;
        }
        .hrt-group:focus-visible {
          outline: 2px solid hsl(var(--ring));
          outline-offset: 4px;
          border-radius: 10px;
        }

        .hrt-btn {
          all: unset;
          display: inline-grid;
          place-items: center;
          cursor: pointer;
          border-radius: 6px;
        }
        .hrt-btn:focus-visible {
          outline: 2px solid hsl(var(--ring));
          outline-offset: 2px;
        }

        .hrt-icon {
          width: 28px;
          height: 28px;
          transition: transform 0.18s ease, filter 0.2s ease;
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.06));
        }
        .hrt-btn:hover .hrt-icon {
          transform: scale(1.06);
          filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
        }

        /* implicit: gri */
        .hrt-icon path {
          fill: hsl(var(--muted-foreground));
        }
        /* activ: colorăm primele N (poți schimba var(--hrt-active)) */
        .hrt-btn[data-active='true'] .hrt-icon path {
          fill: var(--hrt-active, hsl(var(--primary)));
        }

        .hrt-legend { font-size: 0.95rem; color: hsl(var(--muted-foreground)); }
        .hrt-avg { color: hsl(var(--foreground)); font-weight: 700; margin-right: 4px; }
      `}</style>
    </div>
  );
}