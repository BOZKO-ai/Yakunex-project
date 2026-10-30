import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Splits text content of an element into word-level clip-mask spans
 * for Weichie-style smooth masked text reveals.
 * Preserves the exact original text, whitespace, and accessibility.
 */
function prepareTextReveal(element) {
  if (!element || element.dataset.splitReady === 'true') return;

  // Protect hero title and protected areas
  if (element.closest('.hero') || element.closest('.nav-wrap')) return;

  const originalText = element.textContent.trim();
  if (!originalText) return;

  // Preserve accessibility
  element.setAttribute('aria-label', originalText);

  // Split words while preserving words and spaces
  const words = originalText.split(/\s+/);
  element.innerHTML = '';

  words.forEach((word, index) => {
    const maskSpan = document.createElement('span');
    maskSpan.className = 'weichie-word-mask';
    maskSpan.style.display = 'inline-block';
    maskSpan.style.overflow = 'hidden';
    maskSpan.style.verticalAlign = 'top';
    maskSpan.style.lineHeight = '1.18';
    maskSpan.style.paddingBottom = '0.06em';
    maskSpan.style.marginRight = index < words.length - 1 ? '0.28em' : '0';

    const innerSpan = document.createElement('span');
    innerSpan.className = 'weichie-word-inner';
    innerSpan.style.display = 'inline-block';
    innerSpan.style.willChange = 'transform, opacity';
    innerSpan.textContent = word;

    maskSpan.appendChild(innerSpan);
    element.appendChild(maskSpan);
  });

  element.dataset.splitReady = 'true';
}

/**
 * useWeichieScrollAnimations
 * Custom hook applying agency-grade scroll-triggered reveals,
 * text reveals, image clip & parallax, and card staggers.
 * Fully cleans up on unmount / route changes via gsap.context().
 */
export function useWeichieScrollAnimations(containerRef, dependencies = []) {
  useEffect(() => {
    if (!containerRef.current) return;

    // Check accessibility & reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Scoped GSAP context
    const ctx = gsap.context((self) => {
      if (prefersReducedMotion) {
        // If reduced motion is requested, show all elements naturally with zero motion
        return;
      }

      // =====================================================================
      // 1. TEXT REVEALS (Weichie-style clipping mask word-by-word reveal)
      // =====================================================================
      const textRevealElements = containerRef.current.querySelectorAll('[data-text-reveal]');
      textRevealElements.forEach((el) => {
        // Skip hero or protected elements
        if (el.closest('.hero') || el.closest('.nav-wrap')) return;

        prepareTextReveal(el);
        const words = el.querySelectorAll('.weichie-word-inner');

        if (words.length > 0) {
          gsap.fromTo(
            words,
            {
              yPercent: 110,
              opacity: 0,
            },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.022,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      });

      // =====================================================================
      // 2. SCROLL-TRIGGERED REVEAL (Subtle vertical translation & opacity)
      // =====================================================================
      const singleRevealElements = containerRef.current.querySelectorAll('[data-reveal]:not([data-reveal-stagger]):not([data-text-reveal])');
      singleRevealElements.forEach((el) => {
        // Never touch hero section or protected elements
        if (el.closest('.hero') || el.closest('.nav-wrap')) return;

        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 36,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 87%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      // =====================================================================
      // 3. STAGGERED CARDS & LISTS ENTRANCE (Work, Systems, Team, Services)
      // =====================================================================
      const staggerContainers = containerRef.current.querySelectorAll('[data-reveal-stagger]');
      staggerContainers.forEach((container) => {
        if (container.closest('.hero') || container.closest('.nav-wrap')) return;

        const items = container.querySelectorAll(':scope > *');
        if (items.length === 0) return;

        gsap.fromTo(
          items,
          {
            opacity: 0,
            y: 38,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      // =====================================================================
      // 4. IMAGE REVEAL & RESTRAINED PARALLAX (Clip-mask & scroll parallax)
      // =====================================================================
      const parallaxImages = containerRef.current.querySelectorAll('[data-parallax-image]');
      parallaxImages.forEach((frame) => {
        if (frame.closest('.hero') || frame.closest('.nav-wrap')) return;

        const img = frame.querySelector('img');
        if (!img) return;

        // Reveal clip-mask on enter
        gsap.fromTo(
          frame,
          {
            clipPath: 'inset(8% 0% 0% 0%)',
            opacity: 0.3,
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 0.95,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: frame,
              start: 'top 88%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        // Desktop restrained parallax scrub (scale 1.12 to prevent gaps)
        if (!isMobile) {
          gsap.fromTo(
            img,
            {
              yPercent: -6,
              scale: 1.1,
            },
            {
              yPercent: 6,
              scale: 1.1,
              ease: 'none',
              scrollTrigger: {
                trigger: frame,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            }
          );
        }
      });

      // =====================================================================
      // 5. HORIZONTAL PARALLAX FOR DECORATIVE TICKER / TEXT
      // =====================================================================
      const horizontalParallaxElements = containerRef.current.querySelectorAll('[data-horizontal-parallax]');
      horizontalParallaxElements.forEach((el) => {
        if (isMobile) return;

        const speed = parseFloat(el.dataset.horizontalParallax || '-5');
        gsap.to(el, {
          xPercent: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });

    }, containerRef);

    // Refresh triggers once fonts and media have loaded
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert(); // Complete cleanup of GSAP animations and ScrollTriggers
    };
  }, [containerRef, ...dependencies]);
}
