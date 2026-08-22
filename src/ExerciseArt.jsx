/*
 * Illustration per exercise type — each depicts the gym machine used for
 * that exercise (weight-stack strength machines, cardio equipment), with a
 * small figure using it.
 *
 * Preferred source: drop an image file into public/exercise-art/<type>.<ext>
 * (e.g. public/exercise-art/running.png) and it will be picked up
 * automatically — no code change needed. Supported extensions are tried in
 * order (see IMAGE_EXTS below).
 *
 * Any exercise type without a matching file falls back to the hand-drawn
 * machine sketch defined below.
 */

import { useState, useEffect } from 'react'

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'svg']

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// Thinner secondary strokes: machine frame, cables, floor lines
const hint = { ...stroke, strokeWidth: 1.4, opacity: 0.5 }
// Cable line: thinnest, dashed feel via low opacity
const cable = { ...stroke, strokeWidth: 1.2, opacity: 0.4 }

// A weight-stack tower: frame, plate lines, top pulley, selector pin.
function stack(x = 47, pinLevel = 4) {
  const y = 6, w = 11, h = 44
  const plateYs = [1, 2, 3, 4, 5].map(i => y + (h / 6) * i)
  const pinY = y + (h / 6) * pinLevel
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="1" {...hint} />
      <path
        d={plateYs.map(py => `M${x} ${py} L${x + w} ${py}`).join(' ')}
        {...hint}
      />
      <path d={`M${x - 1} ${y - 3} L${x - 1} ${y + h + 3} M${x + w + 1} ${y - 3} L${x + w + 1} ${y + h + 3}`} {...hint} />
      <circle cx={x + w / 2} cy={y - 3} r="2.3" {...hint} />
      <path d={`M${x + w + 1} ${pinY} L${x + w + 4} ${pinY}`} {...hint} />
    </g>
  )
}

// A bench seat + backrest, side view, mounted on a short post.
function seat(x = 10, y = 46, w = 15) {
  return (
    <g>
      <path d={`M${x} ${y} L${x + w} ${y}`} {...hint} />
      <path d={`M${x} ${y} L${x} ${y - 13}`} {...hint} />
      <path d={`M${x + 1.5} ${y} L${x + 1.5} ${y + 6}`} {...hint} />
    </g>
  )
}


const ART = {
  // ── Cardio ──────────────────────────────────────────────
  running: (
    <>
      {/* treadmill deck */}
      <rect x="10" y="48" width="40" height="8" rx="2" {...hint} />
      <path d="M14 51 L18 51 M22 51 L26 51 M30 51 L34 51 M38 51 L42 51 M46 51 L48 51" {...hint} />
      <path d="M44 48 L48 34 M48 34 L52 34" {...hint} />
      {/* runner */}
      <circle cx="27" cy="15" r="4.6" {...stroke} />
      <path d="M25 20 L21 32" {...stroke} />
      <path d="M24 23 L33 20 L37 26" {...stroke} />
      <path d="M24 25 L16 29 L12 24" {...stroke} />
      <path d="M21 32 L28 39 L26 48" {...stroke} />
      <path d="M21 32 L14 41 L18 48" {...stroke} />
    </>
  ),

  bike: (
    <>
      {/* stationary bike: flywheel, frame, base rail, console */}
      <circle cx="42" cy="46" r="9" {...hint} />
      <path d="M42 37 L42 55 M33 46 L51 46 M35.5 40 L48.5 52 M48.5 40 L35.5 52" {...hint} />
      <path d="M16 56 L54 56" {...hint} />
      <path d="M16 56 L20 46 L42 46" {...hint} />
      <path d="M27 30 L30 30 M27 30 L24 40" {...hint} />
      <circle cx="30" cy="14" r="4.6" {...stroke} />
      <path d="M28 18 L24 30" {...stroke} />
      <path d="M25 21 L33 24 L33 33" {...stroke} />
      <path d="M24 30 L18 34 M24 30 L21 39" {...stroke} />
    </>
  ),

  rowing: (
    <>
      <path d="M4 54 L58 54" {...hint} />
      <path d="M8 54 L52 41" {...hint} />
      <circle cx="10" cy="51" r="4.5" {...hint} />
      <path d="M48 39 L52 41 L48 43" {...hint} />
      <circle cx="40" cy="24" r="4.6" {...stroke} />
      <path d="M37 28 L26 44" {...stroke} />
      <path d="M35 30 L21 33" {...stroke} />
      <path d="M20 28 L20 38" {...stroke} />
      <path d="M26 45 L14 47 L10 53" {...stroke} />
    </>
  ),

  elliptical: (
    <>
      <circle cx="14" cy="44" r="8" {...hint} />
      <path d="M16 45 L48 51" {...hint} />
      <path d="M48 51 L48 16 M45 18 L51 14" {...hint} />
      <path d="M18 45 L28 18 M22 47 L40 24" {...hint} />
      <circle cx="32" cy="16" r="4.6" {...stroke} />
      <path d="M32 21 L34 34" {...stroke} />
      <path d="M32 24 L42 20 M34 27 L27 31" {...stroke} />
      <path d="M34 34 L27 47 M34 34 L41 43" {...stroke} />
    </>
  ),

  // ── Core ────────────────────────────────────────────────
  abs: (
    <>
      {stack(47, 5)}
      <path d="M47 42 L35 42" {...cable} />
      {seat(9, 46, 14)}
      <circle cx="18" cy="20" r="4.4" {...stroke} />
      <path d="M18 24 L18 34" {...stroke} />
      <path d="M18 27 L28 32 L35 42" {...stroke} />
      <path d="M18 34 L13 46 M18 34 L23 45" {...stroke} />
    </>
  ),

  crunches: (
    <>
      {/* declined ab bench with foot roller */}
      <path d="M8 52 L38 40 L38 52 Z" {...hint} />
      <path d="M8 52 L8 56 M38 52 L38 56" {...hint} />
      <path d="M4 34 L4 42 M2 34 L8 34" {...hint} />
      <circle cx="18" cy="27" r="4.4" {...stroke} />
      <path d="M18 31 L24 41" {...stroke} />
      <path d="M24 41 L34 39" {...stroke} />
      <path d="M18 31 L9 36 L5 38" {...stroke} />
    </>
  ),

  squats: (
    <>
      <path d="M6 54 L58 54" {...hint} />
      <circle cx="27" cy="14" r="4.6" {...stroke} />
      <path d="M27 18 L27 33" {...stroke} />
      <path d="M27 33 L19 43 L18 54" {...stroke} />
      <path d="M27 33 L35 43 L36 54" {...stroke} />
      <path d="M27 22 L14 25 M27 22 L40 25" {...stroke} />
    </>
  ),

  zancadas: (
    <>
      <path d="M6 54 L58 54" {...hint} />
      <circle cx="24" cy="13" r="4.6" {...stroke} />
      <path d="M24 17 L26 30" {...stroke} />
      <path d="M26 30 L16 36 L12 54" {...stroke} />
      <path d="M26 30 L38 40 L44 54" {...stroke} />
      <path d="M25 20 L14 22 M25 20 L36 18" {...stroke} />
    </>
  ),

  plank: (
    <>
      {/* flat bench */}
      <rect x="6" y="46" width="40" height="4" rx="1" {...hint} />
      <path d="M10 50 L10 56 M42 50 L42 56" {...hint} />
      <circle cx="47" cy="27" r="4.4" {...stroke} />
      <path d="M43 30 L13 43" {...stroke} />
      <path d="M13 43 L10 46" {...stroke} />
      <path d="M43 30 L38 45 L48 47" {...stroke} />
      <path d="M25 37 L22 42" {...hint} />
    </>
  ),

  // ── Back ────────────────────────────────────────────────
  back: (
    <>
      {stack(47, 3)}
      <path d="M47 25 L36 25" {...cable} />
      <path d="M15 44 L15 30" {...hint} />
      <path d="M12 30 L18 30" {...hint} />
      <circle cx="12" cy="21" r="4.6" {...stroke} />
      <path d="M15 25 L15 40" {...stroke} />
      <path d="M15 27 L28 25 L36 25" {...stroke} />
      <path d="M15 40 L10 52 M15 40 L20 51" {...stroke} />
      <path d="M8 46 L20 46" {...hint} />
    </>
  ),

  lats: (
    <>
      {stack(47, 2)}
      <path d="M30 9 L47 7" {...cable} />
      <path d="M9 9 L31 9" {...stroke} />
      {seat(18, 46, 11)}
      <circle cx="20" cy="20" r="4.4" {...stroke} />
      <path d="M20 24 L20 39" {...stroke} />
      <path d="M20 26 L9 9 M20 26 L31 9" {...stroke} />
      <path d="M20 39 L15 51 M20 39 L24 50" {...stroke} />
    </>
  ),

  seatedrow: (
    <>
      {stack(47, 3)}
      <path d="M47 24 L36 24 M47 28 L36 28" {...cable} />
      {seat(9, 46, 15)}
      <circle cx="17" cy="20" r="4.4" {...stroke} />
      <path d="M17 24 L17 39" {...stroke} />
      <path d="M17 26 L27 24 L36 24 M17 28 L27 28 L36 28" {...stroke} />
      <path d="M17 39 L12 51 M17 39 L22 50" {...stroke} />
    </>
  ),

  // ── Chest / shoulders / arms ────────────────────────────
  chest: (
    <>
      {stack(47, 4)}
      <path d="M47 28 L33 28" {...cable} />
      {seat(10, 46, 15)}
      <circle cx="17" cy="21" r="4.6" {...stroke} />
      <path d="M17 25 L17 41" {...stroke} />
      <path d="M17 28 L27 28 L33 28" {...stroke} />
      <path d="M17 41 L12 52 M17 41 L22 51" {...stroke} />
    </>
  ),

  shoulders: (
    <>
      {stack(47, 2)}
      <path d="M47 8 L17 8 L17 17" {...cable} />
      {seat(9, 46, 15)}
      <circle cx="17" cy="27" r="4.4" {...stroke} />
      <path d="M17 31 L17 41" {...stroke} />
      <path d="M13 31 L10 17 M21 31 L24 17" {...stroke} />
      <path d="M10 17 L24 17" {...stroke} />
      <path d="M17 41 L12 52 M17 41 L22 51" {...stroke} />
    </>
  ),

  lateralraise: (
    <>
      {stack(9, 5)}
      <circle cx="34" cy="20" r="4.4" {...stroke} />
      <path d="M34 24 L34 40" {...stroke} />
      <path d="M34 27 L46 25" {...stroke} />
      <path d="M20 48 L46 25" {...cable} />
      <path d="M34 40 L29 51 M34 40 L39 51" {...stroke} />
    </>
  ),

  biceps: (
    <>
      {stack(47, 5)}
      <path d="M47 43 L38 43" {...cable} />
      <path d="M14 52 L14 40 M11 40 L17 40" {...hint} />
      <circle cx="14" cy="21" r="4.6" {...stroke} />
      <path d="M14 25 L15 40" {...stroke} />
      <path d="M15 40 L11 52 M15 40 L20 51" {...stroke} />
      <path d="M15 30 L26 34 L38 43" {...stroke} />
    </>
  ),

  triceps: (
    <>
      {stack(43, 1)}
      <path d="M43 8 L30 8 L30 30" {...cable} />
      <circle cx="20" cy="16" r="4.6" {...stroke} />
      <path d="M20 20 L21 38" {...stroke} />
      <path d="M21 38 L16 52 M21 38 L26 50" {...stroke} />
      <path d="M21 24 L28 22 L30 30" {...stroke} />
    </>
  ),

  forearms: (
    <>
      {stack(47, 5)}
      <path d="M47 44 L36 44" {...cable} />
      <path d="M8 46 L26 44" {...hint} />
      <path d="M8 46 L8 52 M26 44 L26 50" {...hint} />
      <circle cx="14" cy="30" r="4.4" {...stroke} />
      <path d="M14 34 L18 42" {...stroke} />
      <path d="M12 42 L24 43 L36 44" {...stroke} />
    </>
  ),

  // ── Lower body ──────────────────────────────────────────
  glutes: (
    <>
      {stack(47, 1)}
      <path d="M47 15 L38 15 L38 40" {...cable} />
      <path d="M8 55 L20 55" {...hint} />
      <circle cx="16" cy="18" r="4.6" {...stroke} />
      <path d="M15 22 L14 40" {...stroke} />
      <path d="M14 40 L9 52 M14 40 L20 50" {...stroke} />
      <path d="M14 25 L22 30" {...stroke} />
      <path d="M22 30 L34 34 L38 40" {...stroke} />
    </>
  ),

  hamstrings: (
    <>
      <rect x="8" y="44" width="34" height="4" rx="1" {...hint} />
      <path d="M10 48 L10 54 M40 48 L40 54" {...hint} />
      {stack(47, 5)}
      <path d="M47 43 L44 43 L44 38" {...cable} />
      <circle cx="14" cy="41" r="4.4" {...stroke} />
      <path d="M14 44 L30 44" {...stroke} />
      <path d="M30 44 L44 38" {...stroke} />
      <path d="M18 44 L22 48 M26 44 L29 47" {...hint} />
    </>
  ),

  quads: (
    <>
      {stack(47, 3)}
      <path d="M47 21 L44 21 L44 34" {...cable} />
      {seat(9, 46, 15)}
      <circle cx="16" cy="21" r="4.6" {...stroke} />
      <path d="M16 25 L16 40" {...stroke} />
      <path d="M16 40 L11 51 M16 40 L28 34" {...stroke} />
      <path d="M28 34 L37 34 L44 34" {...stroke} />
    </>
  ),

  calves: (
    <>
      {stack(47, 5)}
      <path d="M47 43 L40 43 L40 33" {...cable} />
      <rect x="10" y="48" width="18" height="5" rx="1" {...hint} />
      <path d="M12 33 L26 33 M12 33 L12 25 M26 33 L26 25" {...hint} />
      <circle cx="19" cy="19" r="4.6" {...stroke} />
      <path d="M19 23 L19 33" {...stroke} />
      <path d="M15 48 L19 33 M23 48 L19 33" {...stroke} />
      <path d="M14 48 L14 51 M24 48 L24 51" {...stroke} />
    </>
  ),
}

const FALLBACK = (
  <>
    {stack(46, 3)}
    <circle cx="20" cy="24" r="4.6" {...stroke} />
    <path d="M20 28 L20 44" {...stroke} />
    <path d="M20 44 L15 53 M20 44 L25 53" {...stroke} />
    <path d="M20 32 L34 30" {...stroke} />
  </>
)

export function ExerciseSketch({ type, className }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {ART[type] ?? FALLBACK}
    </svg>
  )
}

export default function ExerciseArt({ type, className }) {
  const [extIndex, setExtIndex] = useState(0)

  // Re-try from the first extension whenever the exercise type changes,
  // since a given instance of this component gets reused across renders.
  useEffect(() => setExtIndex(0), [type])

  if (extIndex >= IMAGE_EXTS.length) {
    return <ExerciseSketch type={type} className={className} />
  }

  return (
    <img
      key={type}
      src={`/exercise-art/${type}.${IMAGE_EXTS[extIndex]}`}
      alt=""
      className={className}
      role="presentation"
      aria-hidden="true"
      onError={() => setExtIndex(i => i + 1)}
    />
  )
}
