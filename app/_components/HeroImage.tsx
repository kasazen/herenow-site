"use client";

import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * Renders an editorial image only if it actually exists at `src` on the
 * server. Avoids broken-image fallbacks when the user has not yet dropped
 * a file at the matching path in /public/images. The check uses a HEAD
 * request once on mount; the slot collapses to nothing when the file is
 * missing, with no layout shift afterwards.
 */
export default function HeroImage({ src, alt, className }: Props) {
  const [state, setState] = useState<"checking" | "ok" | "missing">("checking");

  useEffect(() => {
    let cancelled = false;
    fetch(src, { method: "HEAD", cache: "no-store" })
      .then((r) => {
        if (cancelled) return;
        setState(r.ok ? "ok" : "missing");
      })
      .catch(() => {
        if (!cancelled) setState("missing");
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (state !== "ok") return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}
