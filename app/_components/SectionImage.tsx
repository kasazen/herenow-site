import Image, { type StaticImageData } from "next/image";

type Props = {
  src: StaticImageData;
  /** Empty alt for purely decorative section breaks. */
  alt?: string;
};

/**
 * SectionImage — full-bleed editorial section break.
 *
 * Different treatment from HeroImage: wider (100vw), shorter, no warm
 * overlay, no rounded border. Top + bottom edges are feathered into
 * the page background via mask-image gradients so the image reads as
 * a "break" between content blocks rather than another hero.
 */
export default function SectionImage({ src, alt = "" }: Props) {
  return (
    <div className="section-image-frame" aria-hidden={alt === "" ? true : undefined}>
      <Image
        src={src}
        alt={alt}
        sizes="100vw"
        placeholder="blur"
      />
    </div>
  );
}
