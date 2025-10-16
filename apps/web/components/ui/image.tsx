import * as React from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

/**
 * Image component using GalaxyCo.ai Design System tokens
 * Enhanced Next.js Image with lazy loading, skeleton, and error states
 *
 * @example
 * <Image src="/photo.jpg" alt="Photo" width={400} height={300} />
 * <Image src="/avatar.jpg" alt="Avatar" aspectRatio="square" rounded="full" />
 * <Image src="/banner.jpg" alt="Banner" fit="cover" />
 */
const imageVariants = cva("overflow-hidden", {
  variants: {
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      default: "rounded",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    },
    fit: {
      contain: "object-contain",
      cover: "object-cover",
      fill: "object-fill",
      none: "object-none",
    },
  },
  defaultVariants: {
    rounded: "default",
    fit: "cover",
  },
});

export interface ImageProps
  extends Omit<NextImageProps, "onError" | "onLoad">,
    VariantProps<typeof imageVariants> {
  /**
   * Aspect ratio (for responsive sizing)
   */
  aspectRatio?: "square" | "video" | "portrait" | "landscape";

  /**
   * Show error state on load failure
   * @default true
   */
  showError?: boolean;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    { className, rounded, fit, aspectRatio, showError = true, alt, ...props },
    ref,
  ) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);

    const aspectRatioClasses = {
      square: "aspect-square",
      video: "aspect-video", // 16:9
      portrait: "aspect-[3/4]",
      landscape: "aspect-[4/3]",
    };

    const containerClasses = cn(
      imageVariants({ rounded, fit }),
      aspectRatio && aspectRatioClasses[aspectRatio],
      "relative bg-muted",
      className,
    );

    if (hasError && showError) {
      return (
        <div
          className={cn(
            containerClasses,
            "flex items-center justify-center text-muted-foreground",
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <ImageOff className="h-8 w-8" />
            <span className="text-xs">{alt || "Image failed to load"}</span>
          </div>
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}
        <NextImage
          ref={ref}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            fit === "contain" && "object-contain",
            fit === "cover" && "object-cover",
            fit === "fill" && "object-fill",
            fit === "none" && "object-none",
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          {...props}
        />
      </div>
    );
  },
);

Image.displayName = "Image";

export { Image, imageVariants };
