import Image, { type StaticImageData } from "next/image";

type Props = {
  src: StaticImageData | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
};

/**
 * Renders an editorial hero image with the unified brand treatment
 * (paper-bordered frame, subtle desaturation/contrast, warm overlay —
 * see .hero-image-frame in globals.css).
 *
 * Pass a statically imported image so dimensions are baked in at build
 * time and Next.js can generate responsive variants. If `src` is null
 * or undefined the slot collapses cleanly.
 */
export default function HeroImage({ src, alt, className, priority = true }: Props) {
  if (!src) return null;
  return (
    <figure className={`hero-image-frame ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        priority={priority}
        sizes="(max-width: 48rem) 100vw, 36rem"
        placeholder="blur"
      />
    </figure>
  );
}
