type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

/**
 * Forward+up arrow — the brand's whoosh. Replaces the Unicode → wherever a
 * state change is implied. The slope rises slightly from left to right; the
 * curve is the compounding gesture. currentColor lets it inherit from the
 * surrounding type.
 */
export default function ForwardArrow({ className, size = "md" }: Props) {
  const dim = size === "sm" ? { w: 18, h: 9 } : size === "lg" ? { w: 32, h: 16 } : { w: 26, h: 13 };
  return (
    <svg
      className={className}
      width={dim.w}
      height={dim.h}
      viewBox="0 0 26 13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1.5 10 Q 9 9.5 14.5 6 T 24 1.5" />
      <path d="M19 1 L 24 1.5 L 23.2 6.5" />
    </svg>
  );
}
