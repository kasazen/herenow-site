/**
 * RoadmapTable — §iv. Three moves to make first, ranked by impact + effort.
 * A horizontal table-style chart with capture range, build timeline, and tag.
 */
export default function RoadmapTable() {
  const moves = [
    {
      n: "01",
      title: "Anniversary review agent",
      tag: "AI agent · 2–4 wks",
      capture: "$1.4M – $1.8M",
      captureLabel: "annual",
      effort: 28, // visual width %
      effortLabel: "Low effort · existing escalator clauses",
      tagBg: "#15803d",
      tagFg: "#faf9f5",
    },
    {
      n: "02",
      title: "Consolidate parts to two distributors",
      tag: "Workflow · 6–8 wks",
      capture: "$520K – $740K",
      captureLabel: "annual",
      effort: 56,
      effortLabel: "Medium · technician resistance is real",
      tagBg: "#f3f2ec",
      tagFg: "#4f4f57",
    },
    {
      n: "03",
      title: "Proposal generator for the senior estimator",
      tag: "AI software · 4–6 wks",
      capture: "+8–12%",
      captureLabel: "revenue lift",
      effort: 42,
      effortLabel: "Medium · demonstrates AI inside the operation",
      tagBg: "#d8ecdf",
      tagFg: "#15803d",
    },
  ];

  return (
    <svg viewBox="0 0 880 380" role="img" aria-labelledby="rm-t rm-d" preserveAspectRatio="xMidYMid meet">
      <title id="rm-t">Three moves to make first, ranked</title>
      <desc id="rm-d">
        First: anniversary review agent, AI agent, $1.4 to 1.8 million annual capture. Second:
        consolidate parts purchasing to two preferred distributors, workflow change, $520 to 740
        thousand annual capture. Third: proposal generator for the senior estimator, AI software, 8 to
        12 percent revenue lift.
      </desc>

      {/* Column headers */}
      <g transform="translate(0, 30)" fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95" letterSpacing="2">
        <text x="80">RANK · BUILD</text>
        <text x="500">CAPTURE</text>
        <text x="660">EFFORT</text>
      </g>
      <line x1="0" y1="42" x2="880" y2="42" stroke="#d4d1c4" strokeWidth="0.8" />

      {/* Rows */}
      {moves.map((m, i) => {
        const y = 70 + i * 100;
        return (
          <g key={m.n}>
            {/* Rank */}
            <text
              x="20"
              y={y + 6}
              fontFamily="Fraunces, Georgia, serif"
              fontStyle="italic"
              fontSize="32"
              fill="#15803d"
            >
              {m.n}
            </text>

            {/* Title */}
            <text
              x="80"
              y={y - 4}
              fontFamily="Fraunces, Georgia, serif"
              fontSize="18"
              fill="#14141a"
              letterSpacing="-0.4"
            >
              {m.title}
            </text>

            {/* Tag pill */}
            <g transform={`translate(80, ${y + 12})`}>
              <rect x="0" y="0" width={m.tag.length * 6.5 + 16} height="20" rx="10" fill={m.tagBg} />
              <text
                x="8"
                y="14"
                fontFamily="Inter, sans-serif"
                fontSize="10"
                fill={m.tagFg}
                letterSpacing="1"
                fontWeight="600"
              >
                {m.tag.toUpperCase()}
              </text>
            </g>

            {/* Capture */}
            <text
              x="500"
              y={y}
              fontFamily="Fraunces, Georgia, serif"
              fontStyle="italic"
              fontSize="20"
              fill="#15803d"
            >
              {m.capture}
            </text>
            <text
              x="500"
              y={y + 18}
              fontFamily="Inter, sans-serif"
              fontSize="10"
              fill="#8e8e95"
              letterSpacing="1"
            >
              {m.captureLabel.toUpperCase()}
            </text>

            {/* Effort bar */}
            <g transform={`translate(660, ${y - 8})`}>
              <rect x="0" y="0" width="180" height="10" fill="#f3f2ec" rx="2" />
              <rect x="0" y="0" width={m.effort * 1.8} height="10" fill="#15803d" rx="2" />
              <text
                x="0"
                y="28"
                fontFamily="Inter, sans-serif"
                fontSize="11"
                fill="#4f4f57"
              >
                {m.effortLabel}
              </text>
            </g>

            {/* Row separator */}
            {i < moves.length - 1 ? (
              <line x1="0" y1={y + 50} x2="880" y2={y + 50} stroke="#e6e3d8" strokeWidth="0.5" />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
