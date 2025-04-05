import { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;
      
      const { clientX, clientY } = e;
      const x = clientX / window.innerWidth;
      const y = clientY / window.innerHeight;
      
      // More dynamic movement with parallax effect
      backgroundRef.current.style.setProperty('--x', `${x * 100}%`);
      backgroundRef.current.style.setProperty('--y', `${y * 100}%`);
      
      // Adjust gradient positions based on mouse position
      backgroundRef.current.style.backgroundPosition = `
        ${x * 40}px ${y * 40}px,
        ${x * -30}px ${y * -30}px,
        ${x * 20}px ${y * -20}px,
        ${x * -10}px ${y * 10}px,
        0 0
      `;
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={backgroundRef}
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      style={{
        '--x': '50%',
        '--y': '50%',
      } as React.CSSProperties}
    >
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(74, 198, 183, 0.08) 0%, transparent 25%),
            radial-gradient(circle at 85% 60%, rgba(148, 120, 230, 0.08) 0%, transparent 25%),
            radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 25%),
            radial-gradient(circle at 70% 30%, rgba(148, 120, 230, 0.08) 0%, transparent 25%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(45deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: `
            100% 100%,
            100% 100%,
            100% 100%,
            100% 100%,
            30px 30px,
            30px 30px
          `,
          backgroundPosition: "0 0",
          transition: "background-position 0.3s ease-out",
          filter: "blur(0.3px)"
        }}
      />
      
      {/* Animated particles */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at var(--x) var(--y), 
            rgba(255, 255, 255, 0.5) 0%, 
            rgba(74, 198, 183, 0.3) 30%, 
            rgba(148, 120, 230, 0.1) 60%, 
            transparent 100%)`,
          backgroundSize: '200% 200%',
          transition: 'background-position 0.1s linear',
          opacity: 0.5
        }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at var(--x) var(--y), black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at var(--x) var(--y), black 30%, transparent 70%)'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;