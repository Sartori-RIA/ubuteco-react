import Image from "next/image";

type ProductDetailImageProps = {
  src: string;
  alt: string;
};

/** Full-size product image for show pages (API serves up to 1200px). */
export function ProductDetailImage({src, alt}: ProductDetailImageProps) {
  return (
    <div className="relative aspect-[5/4] w-full min-h-[280px] max-w-xl overflow-hidden rounded-xl bg-gray-50">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 560px"
        unoptimized
        priority
      />
    </div>
  );
}
