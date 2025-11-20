import { cn } from "@/lib/utils";

type SvgThumbnailProps = {
  svg: string;
  variant?: "fill" | "contain";
  className?: string;
  ariaLabel?: string;
};

export function SvgThumbnail({
  svg,
  variant = "contain",
  className,
  ariaLabel = "SVG thumbnail preview",
}: SvgThumbnailProps) {
  const wrapperClass =
    variant === "fill" ? "svg-thumbnail-fill" : "svg-thumbnail-container";

  return (
    <div
      aria-label={ariaLabel}
      className={cn(wrapperClass, className)}
      dangerouslySetInnerHTML={{ __html: svg }}
      role="img"
    />
  );
}
