import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface VideoShowreelHandles {
  section: HTMLElement | null;
  videoContainer: HTMLDivElement | null;
  textContainer: HTMLDivElement | null;
}

const VideoShowreel = forwardRef<VideoShowreelHandles, {}>((_, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    get section() {
      return sectionRef.current;
    },
    get videoContainer() {
      return videoContainerRef.current;
    },
    get textContainer() {
      return textContainerRef.current;
    }
  }));

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden video-section pointer-events-none"
    >
      {/* The expanding clip-path container */}
      <div
        ref={videoContainerRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden video-container"
        style={{
          backgroundColor: 'var(--crimson)',
          clipPath: 'circle(0px at 50% 50%)' // Prevents full-screen red flash before GSAP kicks in
        }}
      >
        {/* Actual video player */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          src="https://cdn.coverr.co/videos/coverr-abstract-neon-light-loop-5242/1080p.mp4"
        />

        <div ref={textContainerRef} className="relative z-10 opacity-0 video-text-content pointer-events-none">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-center tracking-tight leading-none whitespace-nowrap drop-shadow-lg">
            SUCCEED <span className="inline-block mx-2 md:mx-4">●</span> TOGETHER!
          </h2>
        </div>
      </div>
    </section>
  );
});

export default VideoShowreel;
