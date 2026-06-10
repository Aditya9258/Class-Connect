import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// ─── tunables ────────────────────────────────────────────────────────────────
const MAX_POINTS   = 28;   // history length
const LERP_CURSOR  = 0.14; // how fast the dot chases the mouse (rAF lerp)
const LERP_RING    = 0.10; // ring lag
const TRAIL_COLOR  = '212, 175, 55';   // gold RGB (theme accent)
const LINE_WIDTH   = 3;               // base stroke width
const GLOW_BLUR    = 18;              // canvas shadow blur
const FADE_ALPHA   = 0.18;            // per-frame canvas clear opacity (trail fade speed)
// ─────────────────────────────────────────────────────────────────────────────

interface Vec2 { x: number; y: number }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function dist(a: Vec2, b: Vec2) { return Math.hypot(b.x - a.x, b.y - a.y); }

export default function CursorTrail() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const dotRef     = useRef<HTMLDivElement>(null);
  const ringRef    = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.cursor = 'none';

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    const dot    = dotRef.current!;
    const ring   = ringRef.current!;

    // resize canvas to fill viewport
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // state
    const raw:    Vec2 = { x: -300, y: -300 };  // real mouse
    const dotPos: Vec2 = { x: -300, y: -300 };  // lerped dot
    const ringPos:Vec2 = { x: -300, y: -300 };  // lerped ring
    const history: Vec2[] = [];

    let prevSpeed  = 0;
    let frame: number;

    // ── mouse tracking ────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      raw.x = e.clientX;
      raw.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    // ── hover on interactive elements ─────────────────────────────────────
    const enterHover = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const text = el.getAttribute('data-cursor') || '';
      if (labelRef.current) {
        labelRef.current.textContent = text;
        labelRef.current.style.opacity = text ? '1' : '0';
      }
      gsap.to(ring, {
        width: 64, height: 64,
        borderColor: `rgb(${TRAIL_COLOR})`,
        backgroundColor: `rgba(${TRAIL_COLOR},0.06)`,
        duration: 0.45, ease: 'elastic.out(1, 0.6)',
      });
      gsap.to(dot, { scale: 0, duration: 0.2, ease: 'power2.in' });
    };
    const leaveHover = () => {
      if (labelRef.current) labelRef.current.style.opacity = '0';
      gsap.to(ring, {
        width: 36, height: 36,
        borderColor: `rgba(${TRAIL_COLOR}, 0.7)`,
        backgroundColor: 'transparent',
        duration: 0.4, ease: 'power3.out',
      });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    };

    const attachHover = () => {
      document.querySelectorAll<HTMLElement>(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor]'
      ).forEach(el => {
        el.addEventListener('mouseenter', enterHover);
        el.addEventListener('mouseleave', leaveHover);
      });
    };
    attachHover();

    // ── draw a smooth catmull-rom-like spline through history ─────────────
    const drawTrail = () => {
      if (history.length < 2) return;

      // velocity for line-width breathing
      const speed = dist(history[history.length - 1], history[0]);
      const smoothSpeed = lerp(prevSpeed, speed, 0.15);
      prevSpeed = smoothSpeed;
      const widthMult = Math.min(1 + smoothSpeed * 0.018, 3.2);

      ctx.lineCap    = 'round';
      ctx.lineJoin   = 'round';
      ctx.shadowBlur = GLOW_BLUR;
      ctx.shadowColor = `rgba(${TRAIL_COLOR}, 0.6)`;

      // gradient: head → tail
      const head = history[history.length - 1];
      const tail = history[0];
      const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      grad.addColorStop(0,   `rgba(${TRAIL_COLOR}, 0)`);
      grad.addColorStop(0.4, `rgba(${TRAIL_COLOR}, 0.12)`);
      grad.addColorStop(1,   `rgba(${TRAIL_COLOR}, 0.85)`);

      ctx.beginPath();
      ctx.moveTo(history[0].x, history[0].y);

      for (let i = 1; i < history.length - 1; i++) {
        const mx = (history[i].x + history[i + 1].x) / 2;
        const my = (history[i].y + history[i + 1].y) / 2;
        ctx.quadraticCurveTo(history[i].x, history[i].y, mx, my);
      }
      const last = history[history.length - 1];
      ctx.lineTo(last.x, last.y);

      ctx.strokeStyle = grad;
      ctx.lineWidth   = LINE_WIDTH * widthMult;
      ctx.stroke();

      // second, thinner bright core pass
      ctx.lineWidth   = (LINE_WIDTH * widthMult) * 0.28;
      const coreGrad  = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      coreGrad.addColorStop(0,   `rgba(255,255,255, 0)`);
      coreGrad.addColorStop(0.6, `rgba(255,255,255, 0.08)`);
      coreGrad.addColorStop(1,   `rgba(255,255,255, 0.55)`);
      ctx.strokeStyle = coreGrad;
      ctx.shadowBlur  = 4;
      ctx.shadowColor = 'rgba(255,255,255,0.4)';
      ctx.stroke();
    };

    // ── rAF loop ──────────────────────────────────────────────────────────
    const tick = () => {
      // fade canvas (creates the tail-fade effect)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${FADE_ALPHA})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      // lerp dot & ring positions
      dotPos.x  = lerp(dotPos.x,  raw.x, LERP_CURSOR);
      dotPos.y  = lerp(dotPos.y,  raw.y, LERP_CURSOR);
      ringPos.x = lerp(ringPos.x, raw.x, LERP_RING);
      ringPos.y = lerp(ringPos.y, raw.y, LERP_RING);

      // push to history
      history.push({ x: dotPos.x, y: dotPos.y });
      if (history.length > MAX_POINTS) history.shift();

      drawTrail();

      // position DOM elements
      gsap.set(dot,  { x: dotPos.x,  y: dotPos.y,  xPercent: -50, yPercent: -50 });
      gsap.set(ring, { x: ringPos.x, y: ringPos.y, xPercent: -50, yPercent: -50 });
      if (labelRef.current) {
        gsap.set(labelRef.current, { x: ringPos.x + 26, y: ringPos.y - 10 });
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      document.documentElement.style.cursor = '';
      document.querySelectorAll<HTMLElement>(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor]'
      ).forEach(el => {
        el.removeEventListener('mouseenter', enterHover);
        el.removeEventListener('mouseleave', leaveHover);
      });
    };
  }, []);

  return (
    <>
      {/* Canvas trail layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9995,
        }}
      />

      {/* Sharp cursor dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: '50%',
          background: `rgb(${TRAIL_COLOR})`,
          boxShadow: `0 0 10px 2px rgba(${TRAIL_COLOR}, 0.6)`,
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />

      {/* Follower ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 36, height: 36,
          borderRadius: '50%',
          border: `1.5px solid rgba(${TRAIL_COLOR}, 0.7)`,
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(0px)',
          transition: 'backdrop-filter 0.3s',
        }}
      />

      {/* Optional hover label */}
      <div
        ref={labelRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: `rgb(${TRAIL_COLOR})`,
          transition: 'opacity 0.2s',
          whiteSpace: 'nowrap',
        }}
      />
    </>
  );
}
