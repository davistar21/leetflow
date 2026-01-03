"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarkdownImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  node?: unknown;
}

export default function MarkdownImage({
  src,
  alt,
  node: _node,
  ...props
}: MarkdownImageProps) {
  if (!src) return null;

  const caption = alt || "";

  return (
    <div className="my-8">
      <img
        src={src}
        alt={caption}
        className={cn(
          "max-w-full h-auto rounded-lg shadow-md mx-auto border border-border/50",
          props.className
        )}
      />
      {caption && (
        <p className="text-center text-sm text-muted-foreground mt-2 opacity-80">
          {caption}
        </p>
      )}
    </div>
  );
}
