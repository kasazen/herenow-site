/**
 * DonutMargin — §i. 71% of operating margin from service vs 29% from install.
 * Editorial-clean register: thin stroke band, accent for service, muted for
 * install, large italic centered figure.
 */
export default function DonutMargin() {
  // r=80, circumference = 2πr ≈ 502.65
  const C = 502.65;
  const servicePct = 0.71;

  return (
    <svg viewBox="0 0 360 280" role="img" aria-labelledby="donut-t donut-d" preserveAspectRatio="xMidYMid meet">
      <title id="donut-t">Service vs install share of operating margin</title>
      <desc id="donut-d">71% of operating margin came from recurring service and maintenance; 29% from new install.</desc>

      {/* Donut */}
      <g transform="translate(140, 140)">
        {/* Track */}
        <circle r="80" fill="none" stroke="#e6e3d8" strokeWidth="28" />
        {/* Service arc — drawn 71% starting from top */}
        <circle
          r="80"
          fill="none"
          stroke="#15803d"
          strokeWidth="28"
          strokeDasharray={`${C * servicePct} ${C * (1 - servicePct)}`}
          strokeDashoffset="0"
          transform="rotate(-90)"
        />
        {/* Center label */}
        <text x="0" y="-2" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="56" fill="#14141a" letterSpacing="-1">
          71%
        </text>
        <text x="0" y="22" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="#4f4f57" letterSpacing="2">
          FROM SERVICE
        </text>
      </g>

      {/* Right-side legend */}
      <g transform="translate(250, 100)">
        <line x1="0" y1="-6" x2="20" y2="-6" stroke="#15803d" strokeWidth="3" />
        <text x="0" y="14" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="15" fill="#15803d">
          Service · 71%
        </text>
        <text x="0" y="32" fontFamily="Inter, sans-serif" fontSize="11" fill="#4f4f57">
          Recurring maintenance
        </text>
        <text x="0" y="46" fontFamily="Inter, sans-serif" fontSize="11" fill="#4f4f57">
          + repair
        </text>
      </g>

      <g transform="translate(250, 175)">
        <line x1="0" y1="-6" x2="20" y2="-6" stroke="#d4d1c4" strokeWidth="3" />
        <text x="0" y="14" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="15" fill="#4f4f57">
          Install · 29%
        </text>
        <text x="0" y="32" fontFamily="Inter, sans-serif" fontSize="11" fill="#8e8e95">
          New construction
        </text>
        <text x="0" y="46" fontFamily="Inter, sans-serif" fontSize="11" fill="#8e8e95">
          + retrofit
        </text>
      </g>
    </svg>
  );
}
