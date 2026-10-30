'use client';

import React, { useCallback, useEffect, useRef } from 'react';

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

interface ScrollExpandProps {
  src?: string;
  mediaType?: 'image' | 'video';
  poster?: string;
  alt?: string;
  title?: string;
  scrollHint?: string;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  useWindowScroll?: boolean;
  enabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollExpand({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 46,
  startHeight = 60,
  startRadius = 32,
  endRadius = 0,
  mediaZoom = 1.0, // 1.0 garantează zero tăiere a imaginii
  scrollDistance = 1.6,
  holdDistance = 0.8,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = true,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<any>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const propsRef = useRef<any>({});
  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled
  };

  const applyProgress = useCallback((p: number) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current;

    const e = smoothstep(0, 1, p);

    const w = c.startWidth + (100 - c.startWidth) * e;
    const h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

    if (titleRef.current) {
      const out = smoothstep(0.25, 0.7, p);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-25 * out}px, 0)`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.65, 1, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${15 * (1 - inn)}px, 0)`;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    const measure = () => {
      const c = propsRef.current;
      stageH = c.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;

      const w = root.clientWidth || stageH;
      stage.style.setProperty('--se-title-size', `${clamp(w * 0.065, 24, 76)}px`);
    };

    const readProgress = () => {
      const c = propsRef.current;
      if (!c.enabled) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      if (c.useWindowScroll) {
        const top = track.getBoundingClientRect().top;
        return clamp(-top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = propsRef.current;
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = useWindowScroll ? window : root;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  return (
    <>
      <style>{`
        .scroll-expand {
          position: relative;
          width: 100%;
        }
        .scroll-expand__track {
          position: relative;
          width: 100%;
        }
        .scroll-expand__stage {
          position: sticky;
          top: 0;
          width: 100%;
          overflow: hidden;
          background: #09090b;
        }
        .scroll-expand__frame {
          position: absolute;
          inset: 0;
          clip-path: inset(20% 27% 20% 27% round 32px);
          will-change: clip-path;
          background: #09090b;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .scroll-expand__backdrop-glow {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(50px);
          opacity: 0.35;
          transform: scale(1.15);
          pointer-events: none;
        }
        .scroll-expand__media {
          position: relative;
          max-width: 90%;
          max-height: 85%;
          width: auto;
          height: auto;
          object-fit: contain; /* PĂSTREAZĂ POZA 100% COMPLETĂ */
          will-change: transform;
          user-select: none;
          z-index: 2;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.8));
        }
        .scroll-expand__scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(to top, rgba(9, 9, 11, 0.95) 0%, rgba(9, 9, 11, 0.2) 50%, rgba(9, 9, 11, 0.7) 100%);
          opacity: 0;
          z-index: 3;
        }
        .scroll-expand__overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end; /* Poziționat elegant la bază */
          text-align: center;
          padding: 2.5rem 1.5rem;
          opacity: 0;
          will-change: opacity, transform;
          z-index: 4;
        }
        .scroll-expand__title {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0 6%;
          text-align: center;
          font-size: var(--se-title-size);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.1;
          color: #fff;
          text-shadow: 0 4px 35px rgba(0, 0, 0, 0.9);
          pointer-events: none;
          will-change: opacity, transform;
          z-index: 5;
        }
        .scroll-expand__hint {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 1.5rem;
          text-align: center;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.75);
          pointer-events: none;
          will-change: opacity, transform;
          z-index: 5;
        }
      `}</style>
      <div
        ref={rootRef}
        className={`scroll-expand ${className}`.trim()}
        style={style}
        {...rest}
      >
        <div ref={trackRef} className="scroll-expand__track">
          <div ref={stageRef} className="scroll-expand__stage">
            <div ref={frameRef} className="scroll-expand__frame">
              {/* Reflexie ambientală fină în fundal */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="scroll-expand__backdrop-glow" />
              
              {/* Poza completă ne-tăiată */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={mediaRef} className="scroll-expand__media" src={src} alt={alt} draggable={false} />
              
              <div ref={scrimRef} className="scroll-expand__scrim" />
              
              {children ? (
                <div ref={overlayRef} className="scroll-expand__overlay">
                  {children}
                </div>
              ) : null}
            </div>

            {title ? (
              <div ref={titleRef} className="scroll-expand__title">
                {title}
              </div>
            ) : null}

            {scrollHint ? (
              <div ref={hintRef} className="scroll-expand__hint">
                {scrollHint}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}