// src/hooks/useInfiniteScroll.ts
import { useRef, useCallback } from "react";

export function useInfiniteScroll(callback: () => void) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      if (node) {
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              callback();
            }
          },
          { threshold: 1.0 }
        );
        observerRef.current.observe(node);
      }

      bottomRef.current = node;
    },
    [callback]
  );

  return setRef;
}
