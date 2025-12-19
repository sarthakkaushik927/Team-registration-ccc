import React, { useEffect, useState, useId } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "../lib/utils";

export const SparklesCore = (props) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  
  const [init, setInit] = useState(false);
  
  useEffect(() => {
    setInit(true);
  }, []);

  const controls = useAnimation();

  const particlesLoaded = async (container) => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: {
          duration: 1,
        },
      });
    }
  };

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      {init && (
        <Particles
          id={id || useId()}
          className={cn("h-full w-full")}
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background || "transparent" } },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: false, mode: "repulse" },
                resize: true,
              },
              modes: {
                push: { quantity: 4 },
                repulse: { distance: 200, duration: 0.4 },
              },
            },
            particles: {
              color: { value: particleColor || "#ffffff" },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: speed || 6,
                straight: false,
              },
              number: {
                density: { enable: true, area: 800 },
                value: particleDensity || 120,
              },
              opacity: { value: 0.5 },
              shape: { type: "circle" },
              size: {
                value: { min: minSize || 1, max: maxSize || 3 },
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  );
};

// Simplified Particle implementation for React
const Particles = ({ id, className, options }) => {
    const canvasRef = React.useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrame;
        let particles = [];
        
        const resize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        
        window.addEventListener('resize', resize);
        resize();

        const createParticles = () => {
            const count = options.particles.number.value;
            for(let i=0; i<count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2,
                    alpha: Math.random()
                })
            }
        }
        createParticles();

        const animate = () => {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            ctx.fillStyle = options.particles.color.value;
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            animationFrame = requestAnimationFrame(animate);
        }
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        }
    }, []);

    return <canvas ref={canvasRef} id={id} className={className} />
}