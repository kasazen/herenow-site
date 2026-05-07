/**
 * MethodologyGrid — what we read during an engagement, category-only.
 * Six tiles with icon glyph + category label. Deliberately no specific
 * counts: the page argues from method, not from numerical claims.
 */
export default function MethodologyGrid() {
  const items = [
    { label: "Maintenance contracts", glyph: "doc" },
    { label: "Vendor invoices", glyph: "stack" },
    { label: "Dispatch + ticket logs", glyph: "calendar" },
    { label: "Software inventory", glyph: "grid" },
    { label: "Public site + policies", glyph: "globe" },
    { label: "Patterns surfaced", glyph: "spark" },
  ];

  return (
    <svg viewBox="0 0 880 280" role="img" aria-labelledby="meth-t meth-d" preserveAspectRatio="xMidYMid meet">
      <title id="meth-t">What we read in ten days</title>
      <desc id="meth-d">
        Across an engagement, AI parses every contract, vendor invoice, dispatch log, software
        license, and policy document; surfaces patterns; we weigh which ones matter.
      </desc>

      {items.map((item, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 20 + col * 290;
        const y = 20 + row * 125;
        return (
          <g key={item.label} transform={`translate(${x}, ${y})`}>
            {/* Card */}
            <rect x="0" y="0" width="270" height="105" fill="#faf9f5" stroke="#e6e3d8" strokeWidth="1" rx="6" />

            {/* Glyph */}
            <g transform="translate(24, 24)">{renderGlyph(item.glyph)}</g>

            {/* Label */}
            <text
              x="68"
              y="46"
              fontFamily="Fraunces, Georgia, serif"
              fontSize="16"
              fill="#14141a"
              letterSpacing="-0.3"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function renderGlyph(kind: string) {
  const stroke = "#15803d";
  const sw = "1.5";
  switch (kind) {
    case "doc":
      return (
        <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 1 L 18 1 L 24 7 L 24 30 L 2 30 Z" />
          <path d="M18 1 L 18 7 L 24 7" />
          <line x1="6" y1="14" x2="20" y2="14" />
          <line x1="6" y1="20" x2="20" y2="20" />
          <line x1="6" y1="26" x2="14" y2="26" />
        </g>
      );
    case "stack":
      return (
        <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="22" height="6" rx="1" />
          <rect x="2" y="12" width="22" height="6" rx="1" />
          <rect x="2" y="22" width="22" height="6" rx="1" />
        </g>
      );
    case "calendar":
      return (
        <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="22" height="24" rx="2" />
          <line x1="2" y1="11" x2="24" y2="11" />
          <line x1="8" y1="2" x2="8" y2="7" />
          <line x1="18" y1="2" x2="18" y2="7" />
          <circle cx="13" cy="19" r="1.2" fill={stroke} stroke="none" />
        </g>
      );
    case "grid":
      return (
        <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="9" height="9" rx="1" />
          <rect x="15" y="2" width="9" height="9" rx="1" />
          <rect x="2" y="15" width="9" height="9" rx="1" />
          <rect x="15" y="15" width="9" height="9" rx="1" />
        </g>
      );
    case "globe":
      return (
        <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13" cy="15" r="12" />
          <ellipse cx="13" cy="15" rx="6" ry="12" />
          <line x1="1" y1="15" x2="25" y2="15" />
        </g>
      );
    case "spark":
      return (
        <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 24 L 8 14 L 14 18 L 18 8 L 24 12" />
          <circle cx="18" cy="8" r="2" fill={stroke} />
        </g>
      );
    default:
      return null;
  }
}
