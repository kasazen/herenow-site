/**
 * Timeline — §iii. The compression. The same engagement three years ago took
 * four months of consultant time. AI compresses it to nine business days.
 */
export default function Timeline() {
  return (
    <svg viewBox="0 0 720 280" role="img" aria-labelledby="time-t time-d" preserveAspectRatio="xMidYMid meet">
      <title id="time-t">Nine days, not four months</title>
      <desc id="time-d">
        Three years ago this engagement would have taken four months of consultant time and a meaningful
        multiple of the fee. AI compresses the rate-limiting volume of reading into nine business days.
      </desc>

      {/* Old way bar (4 months = 80 working days) */}
      <g transform="translate(80, 70)">
        <text x="0" y="-12" fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95" letterSpacing="2">
          THE OLD WAY
        </text>
        <text x="0" y="6" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="14" fill="#14141a">
          4 months · consultants reading the corpus by hand
        </text>
        <rect x="0" y="20" width="560" height="14" fill="#f3f2ec" />
        <rect x="0" y="20" width="560" height="14" fill="none" stroke="#d4d1c4" strokeWidth="1" />
        <text x="572" y="32" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="14" fill="#8e8e95">
          ~80 working days
        </text>
      </g>

      {/* AI way bar (9 days, scaled to same axis) */}
      <g transform="translate(80, 160)">
        <text x="0" y="-12" fontFamily="Inter, sans-serif" fontSize="10" fill="#15803d" letterSpacing="2">
          WITH AI
        </text>
        <text x="0" y="6" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="14" fill="#14141a">
          9 days · AI parses the corpus, partners weigh the bets
        </text>
        <rect x="0" y="20" width="560" height="14" fill="#f3f2ec" />
        <rect x="0" y="20" width="63" height="14" fill="#15803d" />
        <text x="75" y="32" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="14" fill="#15803d">
          9 days
        </text>
      </g>

      {/* Compression callout */}
      <g transform="translate(80, 240)">
        <line x1="0" y1="0" x2="560" y2="0" stroke="#d4d1c4" strokeWidth="0.8" />
        <text x="0" y="18" fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95" letterSpacing="2">
          COMPRESSION
        </text>
        <text x="560" y="18" textAnchor="end" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="16" fill="#15803d">
          ~9× faster · same depth
        </text>
      </g>
    </svg>
  );
}
