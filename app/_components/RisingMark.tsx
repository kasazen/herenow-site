type Props = {
  className?: string;
  variant?: "default" | "wide";
};

/**
 * The rising-curve mark — the brand's "horizon at dawn." A single thin line
 * that rises gently left-to-right, suggesting compounding. Sibling to the
 * green grid mark; used at section transitions and page-foot signatures.
 *
 * The whole brand argument compressed into one gesture: something rising,
 * quietly, over a long horizon.
 */
export default function RisingMark({ className, variant = "default" }: Props) {
  const width = variant === "wide" ? 320 : 200;
  return (
    <svg
      className={className}
      width={width}
      height={Math.round(width * 0.06)}
      viewBox="0 0 200 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path
        d="M2 10 Q 60 9.6 100 6.4 T 198 1.4"
        opacity="0.85"
      />
    </svg>
  );
}
