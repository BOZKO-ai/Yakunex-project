import { useEffect, useRef, useState } from "react";
import "./Preloader.css";

const DURATION = 4800;
const MAX_WAIT = 8000; // Safety timeout to prevent getting stuck

// [className, delay, points]
const SHAPES = [
  ["g", 1.0, "400,32 500,128 468,352 400,420"],
  ["f", 1.1, "508,132 608,80 556,262 458,392"],
  ["f", 1.2, "618,200 706,180 660,285 570,322"],
  ["g", 1.3, "660,292 712,300 700,375 625,368"],
  ["eye", 1.35, "450,432 545,380 650,372 604,452 515,466"],
  ["g", 1.45, "610,462 700,430 696,515 590,535"],
  ["f", 1.5, "548,478 600,462 690,520 566,700 470,612"],
  ["g", 1.6, "566,610 612,572 610,660 575,700"],
  ["g", 1.65, "402,424 440,505 478,528 440,562 402,582"],
  ["f", 1.7, "402,600 540,622 556,665 402,668"],
  ["g", 1.8, "412,682 552,676 566,726 470,742 412,742"],
];
const TRACES = [
  "M400,40 V410", "M458,168 V232 L440,252 V335", "M430,100 V190 L446,206 V285",
  "M400,290 L420,310 V385", "M668,306 L690,328 H706", "M640,338 H690 L700,352",
  "M620,472 H660 L675,490 H692", "M612,504 L640,514 H680", "M422,470 V520",
  "M432,690 V738", "M472,688 V740", "M512,690 L528,708 V736",
];
const NODES = [[446,288,5],[440,338,5],[706,328,5],[692,490,5],[680,514,5],[422,540,6],[432,738,5],[528,736,5]];

function MaskHalf() {
  return (
    <>
      {SHAPES.map(([cls, d, pts], i) => (
        <polygon key={i} className={cls} style={{ "--yx-d": `${d}s` }} points={pts} />
      ))}
      {TRACES.map((d, i) => (
        <g key={i}>
          <path className="tr" pathLength="1" d={d} />
          <path className="pulse" pathLength="1" d={d} />
        </g>
      ))}
      <circle className="ring" cx="458" cy="155" r="13" />
      {NODES.map(([x, y, r], i) => <circle key={i} className="node" cx={x} cy={y} r={r} />)}
    </>
  );
}

export default function Preloader({ onFinish }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const loaded = useRef(document.readyState === "complete");

  // show every full-page reload
  useEffect(() => {
    let isFinished = false;
    const onLoad = () => {
      loaded.current = true;
    };

    // Check if already loaded
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    document.body.style.overflow = "hidden";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduced ? 800 : DURATION;
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const t0 = performance.now();
    let raf, t1, t2, t3;

    // Safety timeout: force loaded to true after MAX_WAIT
    t3 = setTimeout(() => {
      if (!loaded.current) {
        console.warn("Preloader: Load event timed out. Forcing completion.");
        loaded.current = true;
      }
    }, MAX_WAIT);

    const tick = (now) => {
      if (isFinished) return;
      
      const elapsed = now - t0;
      const t = Math.min(elapsed / dur, 1);
      const v = ease(t);

      // If we reached the end of animation but page is not loaded, hold at 99%
      if (t === 1 && !loaded.current) {
        setPct(0.99);
        raf = requestAnimationFrame(tick);
      } else if (t < 1) {
        setPct(v);
        raf = requestAnimationFrame(tick);
      } else {
        // Animation done AND page loaded (or timed out)
        setPct(1);
        isFinished = true;
        clearTimeout(t3);
        
        t1 = setTimeout(() => {
          setDone(true);
          t2 = setTimeout(() => {
            document.body.style.overflow = "";
            onFinish?.();
          }, 1000);
        }, 450);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      isFinished = true;
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={`loader run${done ? " done" : ""}`} role="status" aria-label="Loading Yakunex Technology">
      <div className="curt l" /><div className="curt r" />
      <div className="stage">
        <div style={{ position: "relative" }}>
          <div className="halo" />
          <svg className="logo" viewBox="60 0 680 770" aria-hidden="true">
            <path className="out" pathLength="1" d="M400,10 L505,124 L610,72 L630,190 L726,170 L704,300 L716,440 L690,540 L600,716 L470,752 L400,748 L330,752 L200,716 L110,540 L84,440 L96,300 L74,170 L170,190 L190,72 L295,124 Z" />
            <g><MaskHalf /></g>
            <g transform="translate(800 0) scale(-1 1)"><MaskHalf /></g>
            <circle className="ring" cx="400" cy="160" r="13" />
          </svg>
        </div>
        <h2 className="name" aria-label="Yakunex">
          {"Yakunex".split("").map((c, i) => (
            <span key={i} style={{ "--yx-i": i }} aria-hidden="true">{c}</span>
          ))}
        </h2>
        <p className="sub">Technology (Pvt) Ltd</p>
        <div className="meter">
          <div className="track"><div className="fill" style={{ transform: `scaleX(${pct})` }} /></div>
          <span className="pct">{Math.round(pct * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
