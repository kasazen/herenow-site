/**
 * DistributorSpread — §ii Finding 2. The same SKUs flowing in through 4 supply
 * houses at unit prices that vary 8–18%. Shows 4 distributors with relative
 * unit prices for the same SKU as a dot plot.
 */
export default function DistributorSpread() {
  // 4 distributors, sample SKU prices indexed to 100
  const distributors = [
    { name: "Distributor A", price: 100, owned: true, label: "Baseline" },
    { name: "Distributor B", price: 108, owned: true, label: "+8%" },
    { name: "Distributor C", price: 113, owned: false, label: "+13%" },
    { name: "Distributor D", price: 118, owned: false, label: "+18%" },
  ];

  const xFor = (price: number) => 90 + (price - 95) * 12; // 95 → 90, 120 → 390

  return (
    <svg viewBox="0 0 460 260" role="img" aria-labelledby="dist-t dist-d" preserveAspectRatio="xMidYMid meet">
      <title id="dist-t">Same SKU at four distributors: 8 to 18 percent price spread</title>
      <desc id="dist-d">
        The same parts SKUs flow through four distributors at unit prices that vary 8 to 18 percent.
        Two of the four are owned by the same parent and offer unified rebates.
      </desc>

      {/* X-axis ticks */}
      <g fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95">
        <text x={xFor(100)} y="218" textAnchor="middle">Baseline</text>
        <text x={xFor(110)} y="218" textAnchor="middle">+10%</text>
        <text x={xFor(120)} y="218" textAnchor="middle">+20%</text>
      </g>

      {/* Axis line */}
      <line x1="80" y1="200" x2="410" y2="200" stroke="#d4d1c4" strokeWidth="1" />
      <line x1={xFor(100)} y1="195" x2={xFor(100)} y2="205" stroke="#8e8e95" strokeWidth="1" />
      <line x1={xFor(110)} y1="195" x2={xFor(110)} y2="205" stroke="#8e8e95" strokeWidth="1" />
      <line x1={xFor(120)} y1="195" x2={xFor(120)} y2="205" stroke="#8e8e95" strokeWidth="1" />

      {/* Distributors */}
      {distributors.map((d, i) => {
        const y = 50 + i * 32;
        const x = xFor(d.price);
        return (
          <g key={d.name}>
            {/* Label */}
            <text x="70" y={y + 4} textAnchor="end" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="13" fill="#14141a">
              {d.name}
            </text>
            {/* Tie line from baseline */}
            <line x1={xFor(100)} y1={y} x2={x} y2={y} stroke="#e6e3d8" strokeWidth="1" />
            {/* Dot at price */}
            <circle cx={x} cy={y} r="6" fill="#15803d" />
            {/* Price label */}
            <text x={x + 14} y={y + 4} fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="13" fill="#15803d">
              {d.label}
            </text>
            {/* Same-parent indicator */}
            {d.owned ? (
              <text x={x + 60} y={y + 4} fontFamily="Inter, sans-serif" fontSize="9" fill="#8e8e95" letterSpacing="1">
                SAME PARENT
              </text>
            ) : null}
          </g>
        );
      })}

      {/* Joining bracket for the two owned distributors */}
      <g transform="translate(420, 50)">
        <path d="M 0 0 L 8 0 L 8 32 L 0 32" fill="none" stroke="#15803d" strokeWidth="1" />
        <text x="14" y="20" fontFamily="Inter, sans-serif" fontSize="10" fill="#15803d" letterSpacing="1">
          OWNED
        </text>
      </g>
    </svg>
  );
}
