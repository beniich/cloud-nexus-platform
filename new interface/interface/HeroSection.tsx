import { useEffect, useRef } from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export function HeroSection({
  title,
  subtitle,
  ctaText = "Commencer",
  onCtaClick
}: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animated dots pattern
    const dots: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
    }> = [];

    // Generate dots
    for (let i = 0; i < 50; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update dots
      dots.forEach((dot) => {
        // Update position
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Bounce off edges
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${dot.opacity})`;
        ctx.fill();

        // Draw connections
        dots.forEach((otherDot) => {
          const dx = dot.x - otherDot.x;
          const dy = dot.y - otherDot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(otherDot.x, otherDot.y);
            const opacity = (1 - distance / 100) * 0.2;
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0e27]">
      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0e27]/50 to-[#0a0e27]" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 text-center">
        {/* Badge optionnel */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full 
                        bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm
                        animate-slide-up">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-300 text-sm font-medium">
            Passerelle IA
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
                       font-black text-white mb-6 max-w-5xl
                       leading-tight tracking-tight
                       animate-slide-up [animation-delay:100ms]">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl
                      leading-relaxed
                      animate-slide-up [animation-delay:200ms]">
          {subtitle}
        </p>

        {/* CTA Button */}
        <button
          onClick={onCtaClick}
          className="group relative px-8 py-4 rounded-lg
                     bg-gradient-to-r from-cyan-500 to-cyan-600
                     hover:from-cyan-400 hover:to-cyan-500
                     text-white font-bold text-lg
                     shadow-[0_0_30px_rgba(6,182,212,0.5)]
                     hover:shadow-[0_0_50px_rgba(6,182,212,0.7)]
                     transition-all duration-300
                     animate-slide-up [animation-delay:300ms]"
        >
          <span className="relative z-10">{ctaText}</span>
          
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r 
                          from-transparent via-white/20 to-transparent
                          translate-x-[-200%] group-hover:translate-x-[200%]
                          transition-transform duration-700" />
        </button>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2
                        animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-cyan-500/50
                          flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
