/**
 * SoftwareSeatsTimeline — §ii Finding 4. Three platforms licensed at 134-staff
 * tier; current headcount is 108. Plus a $3,400/month orphaned subscription.
 */
export default function SoftwareSeatsTimeline() {
  return (
    <svg viewBox="0 0 460 260" role="img" aria-labelledby="seats-t seats-d" preserveAspectRatio="xMidYMid meet">
      <title id="seats-t">Software seats: licensed at 134 staff, currently 108</title>
      <desc id="seats-d">
        Three platforms — field service management, CRM add-on, estimating tool — were licensed at a
        134-staff tier in 2022. Current headcount is 108. Plus a $3,400 per month orphaned subscription
        that no executive could identify the owner of.
      </desc>

      {/* Headcount comparison */}
      <g transform="translate(60, 60)">
        <text x="0" y="-20" fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95" letterSpacing="2">
          HEADCOUNT
        </text>

        {/* 2022 row */}
        <text x="0" y="0" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="13" fill="#8e8e95">
          2022
        </text>
        <rect x="60" y="-12" width="268" height="20" fill="#d8ecdf" />
        <text x="335" y="2" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="14" fill="#15803d">
          134
        </text>

        {/* Today row */}
        <g transform="translate(0, 36)">
          <text x="0" y="0" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="13" fill="#14141a">
            Today
          </text>
          <rect x="60" y="-12" width="216" height="20" fill="#15803d" />
          <text x="283" y="2" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="14" fill="#15803d">
            108
          </text>
        </g>

        {/* Delta callout */}
        <g transform="translate(60, 80)">
          <line x1="216" y1="-10" x2="216" y2="-78" stroke="#d4d1c4" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="268" y1="-10" x2="268" y2="-78" stroke="#d4d1c4" strokeWidth="1" strokeDasharray="2 3" />
          <text x="242" y="6" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95" letterSpacing="2">
            26 SEATS OVERPAID
          </text>
        </g>
      </g>

      {/* Orphaned subscription callout */}
      <g transform="translate(60, 210)">
        <rect x="-8" y="-22" width="392" height="48" fill="#faf9f5" stroke="#d4d1c4" strokeWidth="1" rx="3" />
        <text x="4" y="-4" fontFamily="Inter, sans-serif" fontSize="10" fill="#8e8e95" letterSpacing="2">
          ORPHANED SUBSCRIPTION
        </text>
        <text x="4" y="18" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="14" fill="#14141a">
          $3,400/mo · charged to operations · no executive owner
        </text>
      </g>
    </svg>
  );
}
