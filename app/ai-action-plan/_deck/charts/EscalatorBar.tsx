/**
 * EscalatorBar — §ii Finding 1. 61 of 93 maintenance contracts had unexercised
 * rate-card escalator clauses at the last anniversary cycle.
 *
 * Shows a 93-square grid where 61 are filled (missed) and 32 are outlined (exercised).
 */
export default function EscalatorBar() {
  // 93 squares laid out 12 wide × 8 tall (96 cells, 3 unused at end)
  const cols = 12;
  const total = 93;
  const missed = 61;
  const cellSize = 18;
  const gap = 4;
  const startX = 30;
  const startY = 20;

  return (
    <svg viewBox="0 0 320 260" role="img" aria-labelledby="esc-t esc-d" preserveAspectRatio="xMidYMid meet">
      <title id="esc-t">Sixty-one of ninety-three contracts had unexercised escalators</title>
      <desc id="esc-d">
        Each square is one of the ninety-three active commercial maintenance agreements. Filled squares
        show the sixty-one that had unexercised rate-card escalator clauses at last anniversary.
      </desc>

      {Array.from({ length: total }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cellSize + gap);
        const y = startY + row * (cellSize + gap);
        const isMissed = i < missed;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            fill={isMissed ? "#15803d" : "transparent"}
            stroke={isMissed ? "none" : "#d4d1c4"}
            strokeWidth="1"
            rx="1"
          />
        );
      })}

      {/* Legend */}
      <g transform="translate(30, 215)">
        <rect x="0" y="0" width="14" height="14" fill="#15803d" rx="1" />
        <text x="22" y="11" fontFamily="Inter, sans-serif" fontSize="11" fill="#14141a">
          Missed at anniversary · 61
        </text>
      </g>
      <g transform="translate(30, 235)">
        <rect x="0" y="0" width="14" height="14" fill="transparent" stroke="#d4d1c4" rx="1" />
        <text x="22" y="11" fontFamily="Inter, sans-serif" fontSize="11" fill="#14141a">
          Exercised on time · 32
        </text>
      </g>
    </svg>
  );
}
