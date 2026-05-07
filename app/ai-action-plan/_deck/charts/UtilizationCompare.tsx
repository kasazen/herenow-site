/**
 * UtilizationCompare — §ii Finding 3. Field labor utilization on small-job
 * tickets (58%) versus planned-maintenance routes (81%). Two horizontal bars
 * with productive vs unproductive split visible in each.
 */
export default function UtilizationCompare() {
  const xZero = 60;
  const xFull = 380;
  const barH = 38;
  const totalWidth = xFull - xZero;

  const widthFor = (pct: number) => (pct / 100) * totalWidth;

  return (
    <svg viewBox="0 0 460 260" role="img" aria-labelledby="util-t util-d" preserveAspectRatio="xMidYMid meet">
      <title id="util-t">Field labor utilization: 58% on small jobs vs 81% on routes</title>
      <desc id="util-d">
        Service tickets under four billable hours run at 58 percent productive utilization. The same
        technicians on planned-maintenance routes run at 81 percent.
      </desc>

      {/* Axis */}
      <g fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95">
        <text x={xZero} y="40" textAnchor="middle">0%</text>
        <text x={xZero + widthFor(50)} y="40" textAnchor="middle">50%</text>
        <text x={xFull} y="40" textAnchor="middle">100%</text>
      </g>

      {/* Bar 1: Small jobs at 58% */}
      <g transform="translate(0, 70)">
        <text x={xZero - 12} y={barH / 2 + 5} textAnchor="end" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="13" fill="#14141a">
          Small jobs
        </text>
        <text x={xZero - 12} y={barH / 2 + 20} textAnchor="end" fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95">
          {"<"} 4 billable hrs
        </text>
        {/* Track */}
        <rect x={xZero} y="0" width={totalWidth} height={barH} fill="#f3f2ec" />
        {/* Productive */}
        <rect x={xZero} y="0" width={widthFor(58)} height={barH} fill="#d8ecdf" />
        {/* Mark line at 58% */}
        <line x1={xZero + widthFor(58)} y1="-4" x2={xZero + widthFor(58)} y2={barH + 4} stroke="#15803d" strokeWidth="2" />
        <text x={xZero + widthFor(58) + 8} y={barH / 2 + 5} fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="16" fill="#15803d">
          58%
        </text>
      </g>

      {/* Bar 2: Routes at 81% */}
      <g transform="translate(0, 150)">
        <text x={xZero - 12} y={barH / 2 + 5} textAnchor="end" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="13" fill="#14141a">
          Planned routes
        </text>
        <text x={xZero - 12} y={barH / 2 + 20} textAnchor="end" fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95">
          Maintenance
        </text>
        <rect x={xZero} y="0" width={totalWidth} height={barH} fill="#f3f2ec" />
        <rect x={xZero} y="0" width={widthFor(81)} height={barH} fill="#d8ecdf" />
        <line x1={xZero + widthFor(81)} y1="-4" x2={xZero + widthFor(81)} y2={barH + 4} stroke="#15803d" strokeWidth="2" />
        <text x={xZero + widthFor(81) + 8} y={barH / 2 + 5} fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="16" fill="#15803d">
          81%
        </text>
      </g>

      {/* The gap callout */}
      <g transform="translate(60, 230)">
        <line x1="0" y1="0" x2="320" y2="0" stroke="#d4d1c4" strokeWidth="0.8" />
        <text x="0" y="18" fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95" letterSpacing="2">
          GAP
        </text>
        <text x="320" y="18" textAnchor="end" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="14" fill="#14141a">
          23 points · dispatch + parts staging
        </text>
      </g>
    </svg>
  );
}
