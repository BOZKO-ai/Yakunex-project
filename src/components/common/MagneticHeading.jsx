/**
 * MagneticHeading — High-End Creative Agency Magnetic Text Interaction
 * --------------------------------------------------------------------
 * • Breaks text into words & individual characters with zero layout shifts
 * • Each individual character responds independently to the mouse cursor
 * • Smooth physics spring interpolation with quadratic magnetic falloff
 * • Natural spring-back to resting position when cursor moves away
 * • Pauses animation loop when idle (0% CPU usage)
 * • Automatically disabled for touchscreens and prefers-reduced-motion
 */

import { useRef, useEffect, useState, useMemo } from 'react';

export default function MagneticHeading({
  lines = [],
  className = '',
  tag: Tag = 'h1',
  radius = 120,      // Interaction radius around cursor in pixels
  intensity = 30,    // Maximum displacement distance in pixels
  style = {}
}) {
  const containerRef = useRef(null);
  const charRefs = useRef([]);
  const animFrameRef = useRef(null);
  const isLoopRunning = useRef(false);

  // Mouse coordinate tracker
  const mouseState = useRef({
    x: -9999,
    y: -9999,
    active: false,
  });

  // Track each character's live physics state
  const physicsData = useRef([]);

  // Check touch / reduced-motion accessibility
  const [canInteract, setCanInteract] = useState(true);

  useEffect(() => {
    const isTouch = window.matchMedia && !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) {
      setCanInteract(false);
    }
  }, []);

  // Split lines into words and characters
  const parsedLines = useMemo(() => {
    let globalCharIndex = 0;
    return lines.map((lineObj, lineIdx) => {
      const text = typeof lineObj === 'string' ? lineObj : lineObj.text;
      const lineClass = typeof lineObj === 'object' ? lineObj.className : '';
      const words = text.split(' ');

      const parsedWords = words.map((word, wordIdx) => {
        const chars = word.split('').map((char) => {
          const charIndex = globalCharIndex++;
          return { char, charIndex };
        });
        return { word, chars, wordIdx };
      });

      return { lineIdx, lineClass, words: parsedWords };
    });
  }, [lines]);

  // Total characters count
  const totalChars = useMemo(() => {
    return parsedLines.reduce((acc, line) => {
      return acc + line.words.reduce((wAcc, w) => wAcc + w.chars.length, 0);
    }, 0);
  }, [parsedLines]);

  // Initialize physics data for each character
  useEffect(() => {
    physicsData.current = Array.from({ length: totalChars }, () => ({
      currX: 0,
      currY: 0,
      currRot: 0,
      currScale: 1,
      targetX: 0,
      targetY: 0,
      targetRot: 0,
      targetScale: 1,
      active: false,
    }));
  }, [totalChars]);

  // Main 60-120fps physics loop
  const updatePhysics = () => {
    let hasMotion = false;
    const { x: mx, y: my, active: mouseActive } = mouseState.current;

    for (let i = 0; i < totalChars; i++) {
      const el = charRefs.current[i];
      const data = physicsData.current[i];
      if (!el || !data) continue;

      if (mouseActive) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < radius && dist > 0.001) {
          // Quadratic falloff for organic magnetic feel
          const factor = Math.pow((radius - dist) / radius, 1.8);
          const nx = dx / dist;
          const ny = dy / dist;

          // Repulsive magnetic displacement
          data.targetX = -nx * factor * intensity;
          data.targetY = -ny * factor * intensity;
          data.targetRot = -nx * factor * 14; // Subtle letter tilt
          data.targetScale = 1 + factor * 0.06;
          data.active = true;
        } else {
          data.targetX = 0;
          data.targetY = 0;
          data.targetRot = 0;
          data.targetScale = 1;
        }
      } else {
        data.targetX = 0;
        data.targetY = 0;
        data.targetRot = 0;
        data.targetScale = 1;
      }

      // Smooth spring interpolation (0.16 lerp factor)
      const SPRING = 0.16;
      data.currX += (data.targetX - data.currX) * SPRING;
      data.currY += (data.targetY - data.currY) * SPRING;
      data.currRot += (data.targetRot - data.currRot) * SPRING;
      data.currScale += (data.targetScale - data.currScale) * SPRING;

      // Apply transform with sub-pixel precision
      if (
        Math.abs(data.currX) > 0.03 ||
        Math.abs(data.currY) > 0.03 ||
        Math.abs(data.currRot) > 0.05 ||
        Math.abs(data.currScale - 1) > 0.005
      ) {
        el.style.transform = `translate3d(${data.currX.toFixed(2)}px, ${data.currY.toFixed(2)}px, 0) rotate(${data.currRot.toFixed(2)}deg) scale(${data.currScale.toFixed(3)})`;
        hasMotion = true;
      } else if (data.active) {
        el.style.transform = '';
        data.active = false;
      }
    }

    if (hasMotion || mouseActive) {
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    } else {
      isLoopRunning.current = false;
    }
  };

  // Start physics loop when needed
  const ensureLoopRunning = () => {
    if (!isLoopRunning.current && canInteract) {
      isLoopRunning.current = true;
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    }
  };

  // Mouse event listeners
  useEffect(() => {
    if (!canInteract) return;

    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const margin = 120; // Active aura around heading
      const inBounds =
        e.clientX >= rect.left - margin &&
        e.clientX <= rect.right + margin &&
        e.clientY >= rect.top - margin &&
        e.clientY <= rect.bottom + margin;

      if (inBounds) {
        mouseState.current.x = e.clientX;
        mouseState.current.y = e.clientY;
        mouseState.current.active = true;
        ensureLoopRunning();
      } else if (mouseState.current.active) {
        mouseState.current.active = false;
        ensureLoopRunning();
      }
    };

    const handlePointerLeave = () => {
      mouseState.current.active = false;
      ensureLoopRunning();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handlePointerLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [canInteract]);

  return (
    <Tag
      ref={containerRef}
      className={`magnetic-heading-wrap ${className}`}
      style={{
        position: 'relative',
        userSelect: 'none',
        cursor: 'default',
        ...style,
      }}
    >
      {parsedLines.map((line, lIdx) => (
        <span
          key={`line-${lIdx}`}
          className={`magnetic-line-block ${line.lineClass || ''}`}
          style={{ display: 'block' }}
        >
          {line.words.map((wordObj, wIdx) => (
            <span
              key={`word-${wIdx}`}
              className="magnetic-word-block"
              style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              {wordObj.chars.map(({ char, charIndex }) => (
                <span
                  key={`char-${charIndex}`}
                  ref={(el) => {
                    charRefs.current[charIndex] = el;
                  }}
                  className="magnetic-char"
                  style={{
                    display: 'inline-block',
                    willChange: canInteract ? 'transform' : 'auto',
                    transformOrigin: '50% 50%',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {char}
                </span>
              ))}
              {/* Space between words */}
              {wIdx < line.words.length - 1 && (
                <span
                  className="magnetic-space"
                  style={{ display: 'inline-block', width: '0.28em' }}
                >
                  &nbsp;
                </span>
              )}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
