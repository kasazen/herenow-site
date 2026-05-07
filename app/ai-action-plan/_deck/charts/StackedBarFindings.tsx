/**
 * StackedBarFindings — §ii. Four pools of margin shown as horizontal range bars.
 * Each bar shows the low–high range with marks at endpoints, x-axis at top.
 * Total summary shown beneath.
 */
export default function StackedBarFindings() {
  // X scale: 0 at x=180, $2M at x=580 → 200 px per $1M
  const xFor = (m: number) => 180 + m * 200;

  const findings = [
    { label: "Escalators frozen since 2022", lo: 1.4, hi: 1.8, dollars: "$1.4–1.8M" },
    { label: "Parts buying fragmented", lo: 0.52, hi: 0.74, dollars: "$520–740K" },
    { label: "Field labor utilization gap", lo: 0.38, hi: 0.56, dollars: "$380–560K" },
    { label: "Software seats misaligned", lo: 0.14, hi: 0.19, dollars: "$140–190K" },
  ];

  const rowY = (i: number) => 70 + i * 50;

  return (
    <svg viewBox="0 0 720 320" role="img" aria-labelledby="findings-t findings-d" preserveAspectRatio="xMidYMid meet">
      <title id="findings-t">Four pools of margin totaling $2.4M to $3.3M annual</title>
      <desc id="findings-d">
        Escalators frozen since 2022: $1.4M to $1.8M. Parts buying fragmented: $520K to $740K. Field
        labor utilization gap: $380K to $560K. Software seats misaligned: $140K to $190K.
      </desc>

      {/* X-axis ticks */}
      <g fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95">
        <text x="180" y="38" textAnchor="middle">$0</text>
        <text x="280" y="38" textAnchor="middle">$500K</text>
        <text x="380" y="38" textAnchor="middle">$1M</text>
        <text x="480" y="38" textAnchor="middle">$1.5M</text>
        <text x="580" y="38" textAnchor="middle">$2M</text>
      </g>

      {/* Vertical guide lines */}
      <g stroke="#e6e3d8" strokeWidth="0.8">
        <line x1="180" y1="48" x2="180" y2="280" />
        <line x1="280" y1="48" x2="280" y2="280" />
        <line x1="380" y1="48" x2="380" y2="280" />
        <line x1="480" y1="48" x2="480" y2="280" />
        <line x1="580" y1="48" x2="580" y2="280" />
      </g>

      {/* Rows */}
      {findings.map((f, i) => {
        const y = rowY(i);
        const x1 = xFor(f.lo);
        const x2 = xFor(f.hi);
        return (
          <g key={f.label}>
            {/* Label */}
            <text
              x="170"
              y={y + 5}
              textAnchor="end"
              fontFamily="Fraunces, Georgia, serif"
              fontStyle="italic"
              fontSize="13"
              fill="#14141a"
            >
              {f.label}
            </text>
            {/* Range bar */}
            <rect x={x1} y={y - 8} width={x2 - x1} height="16" fill="#d8ecdf" />
            {/* End marks */}
            <line x1={x1} y1={y - 12} x2={x1} y2={y + 12} stroke="#15803d" strokeWidth="2" />
            <line x1={x2} y1={y - 12} x2={x2} y2={y + 12} stroke="#15803d" strokeWidth="2" />
            {/* Dollar callout */}
            <text
              x={x2 + 12}
              y={y + 5}
              fontFamily="Fraunces, Georgia, serif"
              fontStyle="italic"
              fontSize="14"
              fill="#15803d"
            >
              {f.dollars}
            </text>
          </g>
        );
      })}

      {/* Total summary */}
      <g transform="translate(180, 305)">
        <line x1="0" y1="-12" x2="540" y2="-12" stroke="#d4d1c4" strokeWidth="0.8" />
        <text x="0" y="0" fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95" letterSpacing="2">
          TOTAL ANNUALIZED
        </text>
        <text x="540" y="0" textAnchor="end" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="16" fill="#14141a">
          $2.4M – $3.3M
        </text>
      </g>
    </svg>
  );
}
