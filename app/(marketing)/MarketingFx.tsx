'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Reveal-on-scroll behaviour from the redesigned marketing pages.
 * Mirrors the inline <script> in the original HTML: an IntersectionObserver
 * adds `.in` to `.rv` elements as they enter the viewport, hero/products/results
 * intros fire staggered immediately, and a failsafe reveals everything after 1.6s.
 * Re-runs on every route change so it covers client-side navigation too.
 */
export default function MarketingFx() {
  const pathname = usePathname();

  useEffect(() => {
    const reveal = (el: Element) => el.classList.add('in');
    const items = Array.prototype.slice.call(
      document.querySelectorAll('.rv'),
    ) as Element[];

    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              reveal(e.target);
              io!.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1 },
      );
      items.forEach((el) => io!.observe(el));
    } else {
      items.forEach(reveal);
    }

    const staggerTimers: ReturnType<typeof setTimeout>[] = [];
    document
      .querySelectorAll(
        '.hero .rv,.products-hero .rv,.results-hero .rv,.ai-hero .rv',
      )
      .forEach((el, i) => {
        staggerTimers.push(setTimeout(() => reveal(el), 80 * i));
      });

    const failsafe = setTimeout(() => items.forEach(reveal), 1600);

    return () => {
      io?.disconnect();
      staggerTimers.forEach(clearTimeout);
      clearTimeout(failsafe);
    };
  }, [pathname]);

  return null;
}
