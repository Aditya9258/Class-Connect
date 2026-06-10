import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero, { type HeroHandles } from '../sections/Hero';
import VideoShowreel, { type VideoShowreelHandles } from '../sections/VideoShowreel';
import AboutStudio, { type AboutStudioHandles } from '../sections/AboutStudio';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const heroRef = useRef<HeroHandles>(null);
  const videoRef = useRef<VideoShowreelHandles>(null);
  const aboutRef = useRef<AboutStudioHandles>(null);
  const aboutWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !heroRef.current || !videoRef.current || !aboutRef.current) return;

    // Wait for a tick to ensure elements are rendered and sized
    let ctx: gsap.Context;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const heroSection = heroRef.current?.section;
        const playButton = heroRef.current?.playButton;
        const videoSection = videoRef.current?.section;
        const videoContainer = videoRef.current?.videoContainer;
        const videoText = videoRef.current?.textContainer;
        const aboutSection = aboutRef.current?.section;
        const aboutHeadingLines = aboutRef.current?.headingLines;
        const aboutStats = aboutRef.current?.stats?.querySelectorAll('.stat-item');

        if (!heroSection || !playButton || !videoSection || !videoContainer || !videoText || !aboutSection || !aboutHeadingLines) return;

        // Update math on resize
        ScrollTrigger.addEventListener('refresh', () => {
          // Math is handled directly in the tween for clip-path
        });

        // --- MASTER TIMELINE ---
        // We pin a wrapper container that holds all three sections.
        // Wait, if we pin the wrapper, all sections stay visible on top of each other.
        // Let's set the initial states first.
        
        // VideoShowreel needs to be absolute over Hero
        gsap.set(videoSection, {
          position: 'absolute',
          bottom: 0, // Align to bottom so it covers the viewport when pinned at 'bottom bottom'
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 10,
          pointerEvents: 'none',
        });

        // Position the expanding clip-path exactly where the play button is
        const pbRect = playButton.getBoundingClientRect();
        const vsRect = videoSection.getBoundingClientRect();

        const startX = pbRect.left - vsRect.left + pbRect.width / 2;
        const startY = pbRect.top - vsRect.top + pbRect.height / 2;

        gsap.set(videoContainer, {
          clipPath: `circle(0px at ${startX}px ${startY}px)`,
        });

        // AboutWrapper starts at y: 100vh (pushed below the screen)
        gsap.set(aboutWrapperRef.current, {
          y: '100vh',
        });

        // Create the scroll timeline
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: () => {
              // Trigger when the bottom of wrapperRef hits the bottom of the viewport
              const wrapperHeight = wrapperRef.current?.offsetHeight || window.innerHeight;
              const offset = wrapperHeight - window.innerHeight;
              return `top top-=${Math.max(0, offset)}px`;
            },
            end: '+=600%', // Increased scroll distance to accommodate sequential text reveal
            scrub: true,
            pin: true, // Pin the trigger itself to avoid GSAP nested pin bugs
            anticipatePin: 1,
            refreshPriority: 10, // CRITICAL: Ensures this pin spacer is calculated BEFORE downstream triggers (like Portfolio)
          },
        });

        // Phase 1: Expansion (0% -> 30%)
        masterTl
          .to(videoContainer, {
            clipPath: 'circle(150% at 50% 50%)',
            duration: 2,
            ease: 'power3.inOut',
          }, 0)
          .to(heroSection, {
            opacity: 0, // Fade out hero behind it
            duration: 1,
          }, 0.5)
          
          // Enable pointer events on video section once expanded
          .set(videoSection, { pointerEvents: 'auto' }, 2)

          // Phase 2: Video Content lock and breathe (30% -> 50%)
          // Add a small pause
          .to({}, { duration: 0.5 })
          .to(videoText, {
            opacity: 1,
            scale: 1.05,
            duration: 1,
            ease: 'power2.out',
          }, 2.5)
          .to({}, { duration: 1 }) // The "breathe" pause

          // Phase 3: Parallax Stacking of About Section (50% -> 80%)
          .to(aboutWrapperRef.current, {
            y: '0vh', // Slide up to cover
            duration: 2,
            ease: 'power3.inOut',
          }, 4)
          // Physical layering: Video section scales down slightly as it's covered
          .to(videoSection, {
            scale: 0.95,
            opacity: 0.5,
            duration: 2,
            ease: 'power3.inOut',
          }, 4)

          // Phase 4: Editorial Text Reveal (80% -> 100%)
          .to(aboutHeadingLines, {
            y: '0%', // Translate from 100% to 0%
            duration: 1,
            stagger: 0.15,
            ease: 'expo.out',
          }, 5.5)
          
          // Phase 5: Text Reveal Mask Scrub (Gray to Black)
          // Sequential: stagger equals duration so the next line starts only after the previous finishes
          .to(aboutHeadingLines, {
            backgroundPositionX: '0%',
            duration: 1.5,
            stagger: 1.5,
            ease: 'none',
          }, 7.0);
          
          if (aboutStats) {
             masterTl.to(aboutStats, {
               opacity: 1,
               y: 0,
               duration: 0.8,
               stagger: 0.1,
               ease: 'power3.out'
             }, 6);
          }

      }, containerRef);
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[var(--cream)]">
      {/* 
        Hero and Video are inside a wrapper that dictates their natural height.
        When Hero is taller than 100vh, the user can scroll down to see it.
        Animation pins when the BOTTOM of this wrapper hits the BOTTOM of the viewport.
      */}
      <div ref={wrapperRef} className="relative w-full overflow-hidden">
        <Hero ref={heroRef} />
        <VideoShowreel ref={videoRef} />
      </div>

      {/* 
        AboutStudio is in the normal document flow but pulled up by -100vh 
        so it sits exactly on top of the Hero/Video wrapper. 
        We use GSAP to translateY(100vh) initially, then animate it to 0.
        Because it's in normal flow, its height naturally pushes down subsequent sections.
      */}
      <div 
        ref={aboutWrapperRef} 
        className="relative z-20 w-full will-change-transform" 
        style={{ marginTop: '-100vh' }}
      >
        <AboutStudio ref={aboutRef} />
      </div>
    </div>
  );
}
