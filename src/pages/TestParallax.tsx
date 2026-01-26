import React, { useEffect, useRef, useState } from "react";
import { Cloud, ArrowRight } from "lucide-react";

// Extend Window interface for mouse tracking
declare global {
    interface Window {
        mouseX?: number;
        mouseY?: number;
    }
}

export default function TestParallax() {
    const heroRef = useRef<HTMLElement>(null);
    const parallaxRef = useRef<HTMLDivElement>(null);
    const [counters, setCounters] = useState([0, 0, 0]);
    const ctaRef = useRef<HTMLButtonElement>(null);

    // ────────────────────────────────────────────────
    //   Combined Scroll + Mouse Parallax
    // ────────────────────────────────────────────────
    useEffect(() => {
        const hero = heroRef.current;
        const scene = parallaxRef.current;
        if (!hero || !scene) return;

        const layers = scene.querySelectorAll("[data-depth]");

        let rafId: number;
        const update = () => {
            const scrollProgress = Math.min(window.scrollY / hero.offsetHeight, 1);

            const mx = (window.mouseX || 0) / window.innerWidth - 0.5;
            const my = (window.mouseY || 0) / window.innerHeight - 0.5;

            layers.forEach((layer) => {
                const depth = Number((layer as HTMLElement).dataset.depth) || 0;
                // Combine scroll (Y only) + mouse (X/Y subtle)
                const ty = scrollProgress * depth * 180;
                const tx = mx * depth * 60;
                const tyMouse = my * depth * 40;

                (layer as HTMLElement).style.transform = `translate3d(${tx}px, ${ty + tyMouse}px, 0)`;
            });

            rafId = requestAnimationFrame(update);
        };

        const onMouseMove = (e: MouseEvent) => {
            window.mouseX = e.clientX;
            window.mouseY = e.clientY;
        };

        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("mousemove", onMouseMove);
        update(); // initial

        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    // ────────────────────────────────────────────────
    //   Counters animation with native JS
    // ────────────────────────────────────────────────
    useEffect(() => {
        const targetValues = [120, 45, 98];
        const duration = 1800;
        const startTime = Date.now();

        const animateCounters = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutExpo)
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCounters(targetValues.map(target => Math.round(target * eased)));

            if (progress < 1) {
                requestAnimationFrame(animateCounters);
            }
        };

        const timer = setTimeout(() => {
            animateCounters();
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="min-h-screen bg-black text-white overflow-hidden">
            <section
                ref={heroRef}
                className="relative h-[100vh] flex items-center justify-center"
            >
                <div ref={parallaxRef} className="absolute inset-0 pointer-events-none">
                    <div
                        data-depth="0.15"
                        className="absolute top-[15%] left-[10%] opacity-30 transition-transform"
                    >
                        <Cloud size={180} strokeWidth={1.2} />
                    </div>
                    <div
                        data-depth="0.35"
                        className="absolute bottom-[18%] right-[12%] opacity-25 transition-transform"
                    >
                        <Cloud size={260} strokeWidth={1} />
                    </div>
                    <div
                        data-depth="0.6"
                        className="absolute top-[40%] right-[20%] opacity-15 transition-transform"
                    >
                        <Cloud size={140} strokeWidth={1.5} />
                    </div>
                </div>

                <div className="relative z-10 text-center px-6">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 tracking-tight">
                        Advanced Parallax Experience
                    </h1>
                    <button
                        ref={ctaRef}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 animate-pulse"
                        style={{ animationDuration: '3s' }}
                    >
                        Get Started <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            <section className="py-24 px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
                    {[
                        { value: counters[0], label: "Projects Delivered", suffix: "+" },
                        { value: counters[1], label: "Countries Reached", suffix: "" },
                        { value: counters[2], label: "Satisfaction Rate", suffix: "%" },
                    ].map((item, i) => (
                        <div key={i} className="space-y-3">
                            <div className="text-6xl md:text-7xl font-black text-white">
                                {item.value}{item.suffix}
                            </div>
                            <p className="text-gray-400 text-lg font-medium">{item.label}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
