/**
 * CurvedCarousel — True 3D Rotary Turntable Cylinder Carousel
 * Cards are positioned around a 3D cylinder (rotateY per slot).
 * The cylinder auto-rotates on its Y-axis like a turntable.
 * A golden glowing orbit arc sits underneath for depth.
 * Matches the reference image visual exactly.
 */

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';

const CARD_W_DESK = 230;
const CARD_H_DESK = 300;
const CARD_W_MOB  = 160;
const CARD_H_MOB  = 210;
const AUTO_SPEED  = 0.28;  // Original speed
const INERTIA_DEC = 0.92;
const DRAG_FACTOR = 0.25;  // mouse px -> deg

/* ─── Individual Card ────────────────────────────────────── */
function OrbitCard({ item, slotAngle, radius, cardW, cardH, globalAngle }) {
  const [hov, setHov] = useState(false);

  const isEmblem = typeof item === 'object' && item.isEmblem;
  const imgSrc   = typeof item === 'string' ? item : item.src;
  const title    = typeof item === 'object' ? item.title    : null;
  const category = typeof item === 'object' ? item.category : null;
  const badge    = typeof item === 'object' ? item.badge    : null;

  const worldAngle = slotAngle + globalAngle;
  const sinA = Math.sin(worldAngle);
  const cosA = Math.cos(worldAngle);

  const depth   = (cosA + 1) / 2;
  const opacity = Math.max(0.05, 0.2 + depth * 0.8);
  const scale   = Math.max(0.5, 0.65 + depth * 0.35);
  const zIdx    = Math.round(depth * 100);
  const hidden  = cosA < -0.15; // Hide a bit earlier to keep it compact

  const tx   = sinA * radius;
  const tz   = cosA * radius;
  const rotY = -(worldAngle * 180) / Math.PI;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: cardW,
        height: cardH,
        marginLeft: -cardW / 2,
        marginTop: -cardH / 2,
        borderRadius: 28,
        overflow: 'hidden',
        transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${rotY}deg) scale(${hov ? scale * 1.04 : scale})`,
        opacity: hidden ? 0 : opacity,
        zIndex: hidden ? -1 : zIdx,
        boxShadow: hov
          ? '0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,201,40,0.3)'
          : `0 ${10 + depth * 20}px ${20 + depth * 40}px rgba(0,0,0,${(0.2 + depth * 0.2).toFixed(2)})`,
        cursor: hidden ? 'default' : 'pointer',
        pointerEvents: hidden ? 'none' : 'auto',
        background: isEmblem ? '#0C0B0A' : '#18161E',
        border: hov
          ? '1px solid rgba(255,201,40,0.45)'
          : `1px solid rgba(255,255,255,${(0.04 + depth * 0.1).toFixed(2)})`,
        transition: 'box-shadow 0.35s ease, border 0.35s ease',
        userSelect: 'none',
        willChange: 'transform, opacity',
      }}
    >
      {/* ── Emblem Card ── */}
      {isEmblem ? (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 42%, #1F1C14 0%, #0C0B0A 70%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', width: '78%', aspectRatio: '1',
            borderRadius: '50%',
            border: '1px dashed rgba(255,201,40,0.28)',
            animation: 'cObjSpin 28s linear infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: '50%', aspectRatio: '1',
            borderRadius: '50%',
            border: '1px solid rgba(255,201,40,0.18)',
            animation: 'cObjSpin 16s linear infinite reverse',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: '50%', aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(255,201,40,0.18) 0%, transparent 70%)',
            filter: 'blur(22px)', pointerEvents: 'none',
          }} />
          <img src={imgSrc} alt="Yakunex" draggable={false} style={{
            width: '58%', maxHeight: '50%', objectFit: 'contain',
            filter: 'drop-shadow(0 6px 22px rgba(255,201,40,0.55))',
            transform: hov ? 'scale(1.1) rotate(-1.5deg)' : 'scale(1)',
            transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
            zIndex: 2, pointerEvents: 'none',
          }} />
          <div style={{ marginTop: '1.2rem', textAlign: 'center', zIndex: 3 }}>
            <div style={{ color: '#FFC928', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Yakunex Technologies
            </div>
            <div style={{ color: 'rgba(245,245,245,0.6)', fontSize: '0.68rem', fontWeight: 300, letterSpacing: '0.06em', marginTop: 3 }}>
              Neural Core
            </div>
          </div>
        </div>
      ) : (
        <img src={imgSrc} alt={title || ''} draggable={false} loading="lazy" style={{
          width: '100%', height: '100%', objectFit: 'cover',
          pointerEvents: 'none', userSelect: 'none',
          transform: hov ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.75s cubic-bezier(0.16,1,0.3,1)',
        }} />
      )}

      {/* Badge */}
      {badge && (
        <div style={{
          position: 'absolute', top: '1.1rem', left: '1.1rem', zIndex: 4,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(11,13,16,0.78)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.14)',
          color: '#F5F5F5', fontSize: '0.7rem', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          padding: '0.3rem 0.7rem', borderRadius: 999,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FFC928', boxShadow: '0 0 6px rgba(255,201,40,0.8)', flexShrink: 0 }} />
          {badge}
        </div>
      )}

      {/* Bottom overlay */}
      {!isEmblem && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(11,13,16,0.96) 0%, rgba(11,13,16,0.5) 38%, transparent 68%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '1.4rem', zIndex: 3, pointerEvents: 'none',
        }}>
          {category && (
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#FFC928', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
              {category}
            </span>
          )}
          {title && (
            <h3 style={{ fontSize: 'clamp(1rem,2vw,1.22rem)', fontWeight: 400, color: '#F5F5F5', letterSpacing: '-0.025em', lineHeight: 1.22, margin: 0 }}>
              {title}
            </h3>
          )}
        </div>
      )}

      {/* Gloss */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.07) 0%, transparent 100%)',
        borderRadius: '22px 22px 0 0', zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Hover ring */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 28,
        border: hov ? '1.5px solid rgba(255,201,40,0.5)' : '1px solid rgba(255,255,255,0.08)',
        transition: 'border 0.3s ease', zIndex: 5, pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function CurvedCarousel({ items = [], images = [], bg = 'transparent' }) {
  const sourceList = useMemo(() => {
    if (items && items.length > 0) return items;
    if (images && images.length > 0) return images;
    return [];
  }, [items, images]);

  const N = sourceList.length;

  const [cardW, setCardW] = useState(CARD_W_DESK);
  const [cardH, setCardH] = useState(CARD_H_DESK);
  const [radius, setRadius] = useState(540);

  useEffect(() => {
    const onResize = () => {
      const mob = window.innerWidth < 640;
      setCardW(mob ? CARD_W_MOB : CARD_W_DESK);
      setCardH(mob ? CARD_H_MOB : CARD_H_DESK);
      setRadius(mob ? 230 : 420); 
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const slotAngles = useMemo(() =>
    Array.from({ length: N }, (_, i) => (i / N) * 2 * Math.PI),
    [N]
  );

  const angleRef   = useRef(0);
  const isDragging = useRef(false);
  const lastX      = useRef(0);
  const vel        = useRef(0);
  const rafId      = useRef(null);
  const stageRef   = useRef(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (!alive) return;
      if (!isDragging.current) {
        angleRef.current -= (AUTO_SPEED * Math.PI) / 180;
        vel.current *= INERTIA_DEC;
        if (Math.abs(vel.current) > 0.0004) angleRef.current += vel.current;
      }
      forceUpdate(n => n + 1);
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(rafId.current); };
  }, []);

  const onPointerDown = useCallback((e) => {
    isDragging.current = true;
    lastX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    vel.current = 0;
    if (stageRef.current) stageRef.current.style.cursor = 'grabbing';
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const dx = cx - lastX.current;
    lastX.current = cx;
    vel.current = (-dx * DRAG_FACTOR * Math.PI) / 180;
    angleRef.current += vel.current;
  }, []);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (stageRef.current) stageRef.current.style.cursor = 'grab';
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const opts = { passive: true };
    el.addEventListener('touchstart', onPointerDown, opts);
    el.addEventListener('touchmove',  onPointerMove, opts);
    el.addEventListener('touchend',   onPointerUp,   opts);
    return () => {
      el.removeEventListener('touchstart', onPointerDown);
      el.removeEventListener('touchmove',  onPointerMove);
      el.removeEventListener('touchend',   onPointerUp);
    };
  }, [onPointerDown, onPointerMove, onPointerUp]);

  const stageH = cardH + 90;
  if (N === 0) return null;

  return (
    <div style={{ background: bg, width: '100%', position: 'relative', padding: '24px 20px 52px', userSelect: 'none', overflow: 'hidden' }}>

      <style>{`
        @keyframes cObjSpin { to { transform: rotate(360deg); } }
        @keyframes cRingPulse { 0%,100% { opacity:0.55; } 50% { opacity:1; } }
      `}</style>

      {/* 3D Stage */}
      <div
        ref={stageRef}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        style={{
          position: 'relative',
          width: '100%',
          height: stageH,
          perspective: '1000px', // Slightly higher to make it feel more compact and less wide
          perspectiveOrigin: '50% 50%',
          cursor: 'grab',
          overflow: 'visible',
        }}
      >
        <div style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: 0, height: 0,
          transformStyle: 'preserve-3d',
        }}>
          {slotAngles.map((slotAngle, i) => (
            <OrbitCard
              key={i}
              item={sourceList[i]}
              slotAngle={slotAngle}
              radius={radius}
              cardW={cardW}
              cardH={cardH}
              globalAngle={angleRef.current}
            />
          ))}
        </div>
      </div>

      {/* Golden Orbit Arc Ring */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70%',
        maxWidth: 700,
        height: 2,
        pointerEvents: 'none',
        zIndex: 1,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, transparent 0%, rgba(255,201,40,0.12) 12%, rgba(255,201,40,0.65) 32%, rgba(255,201,40,0.95) 50%, rgba(255,201,40,0.65) 68%, rgba(255,201,40,0.12) 88%, transparent 100%)',
          borderRadius: 2,
          animation: 'cRingPulse 3s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '8%', right: '8%',
          height: 14, transform: 'translateY(-50%)',
          background: 'radial-gradient(ellipse at center, rgba(255,201,40,0.32) 0%, transparent 70%)',
          filter: 'blur(5px)', borderRadius: 999,
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 7, height: 7, borderRadius: '50%',
          background: '#FFC928',
          boxShadow: '0 0 16px 5px rgba(255,201,40,0.75)',
        }} />
      </div>

      {/* Dot Indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 6, position: 'relative', zIndex: 2 }}>
        {sourceList.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const target = -slotAngles[i];
              let diff = target - angleRef.current;
              diff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
              vel.current = 0;
              const stepVal = diff / 40;
              let f = 0;
              const snap = () => { if (f++ < 40) { angleRef.current += stepVal; requestAnimationFrame(snap); } };
              snap();
            }}
            aria-label={`Go to slide ${i + 1}`}
            style={{ width: 6, height: 6, borderRadius: '50%', border: 'none', background: 'rgba(197,203,211,0.35)', cursor: 'pointer', padding: 0, transition: 'all 0.25s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FFC928'; e.currentTarget.style.transform = 'scale(1.7)'; e.currentTarget.style.boxShadow = '0 0 8px rgba(255,201,40,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197,203,211,0.35)'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        ))}
      </div>
    </div>
  );
}
