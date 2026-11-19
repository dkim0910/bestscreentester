"use client";

import { useEffect, useRef } from "react";

// Touch screens have no hover, so a card's hover preview would never show. This marks
// the card that is crossing the middle of the viewport with `data-centered`, and the
// card's CSS reveals the preview from that — one card at a time, as the user scrolls.
//
// Rendered as an empty child of the card rather than making the card itself a client
// component, which would ship every tool's full copy to the browser per card.
export default function RevealWhenCentered() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const card = marker.current?.parentElement;
    // Devices that can hover keep the hover behaviour and skip the observer entirely.
    if (!card || !window.matchMedia("(hover: none)").matches) return;

    // The root is squeezed to a line across the middle of the viewport, so only the
    // card that line passes through counts as intersecting.
    const observer = new IntersectionObserver(
      ([entry]) => card.toggleAttribute("data-centered", entry.isIntersecting),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    observer.observe(card);
    return () => {
      observer.disconnect();
      card.removeAttribute("data-centered");
    };
  }, []);

  return <span ref={marker} hidden />;
}
