import React, { useEffect, useRef } from 'react';

interface SkyBackgroundProps {
  reduceMotion?: boolean;
}

export const SkyBackground: React.FC<SkyBackgroundProps> = ({ reduceMotion = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate stars
    const starCount = Math.min(180, Math.floor((width * height) / 8000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      speed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      color: Math.random() > 0.3 ? '#FFE8A3' : (Math.random() > 0.5 ? '#E1D9F8' : '#F4ABC4')
    }));

    // Floating shooting star state
    let shootingStar: { x: number; y: number; length: number; speed: number; alpha: number; angle: number } | null = null;
    let nextShootingStarTime = Date.now() + 4000;

    // Drifting clouds (semi-transparent soft discs)
    const clouds = [
      { x: width * 0.1, y: height * 0.15, radius: 180, speed: 0.15, opacity: 0.04 },
      { x: width * 0.6, y: height * 0.25, radius: 240, speed: 0.1, opacity: 0.05 },
      { x: width * 0.85, y: height * 0.45, radius: 200, speed: 0.12, opacity: 0.03 }
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isLight = document.documentElement.classList.contains('light-theme');

      // Background gradient (Deep night space in dark mode vs soft pastel daydream sky in light mode)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isLight) {
        bgGrad.addColorStop(0, '#EDF2FC');
        bgGrad.addColorStop(0.4, '#F4F0FA');
        bgGrad.addColorStop(0.8, '#F8F4FD');
        bgGrad.addColorStop(1, '#EAE4F7');
      } else {
        bgGrad.addColorStop(0, '#060814');
        bgGrad.addColorStop(0.4, '#0B0E1E');
        bgGrad.addColorStop(0.8, '#10162F');
        bgGrad.addColorStop(1, '#161D3E');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Lavender & rose celestial nebulas
      const nebula1 = ctx.createRadialGradient(width * 0.75, height * 0.2, 20, width * 0.75, height * 0.2, 450);
      nebula1.addColorStop(0, 'rgba(117, 78, 208, 0.12)');
      nebula1.addColorStop(0.6, 'rgba(186, 171, 245, 0.04)');
      nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(width * 0.2, height * 0.6, 20, width * 0.2, height * 0.6, 400);
      nebula2.addColorStop(0, 'rgba(244, 171, 196, 0.07)');
      nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // Draw drifting soft clouds
      clouds.forEach(cloud => {
        if (!reduceMotion) {
          cloud.x += cloud.speed;
          if (cloud.x - cloud.radius > width) {
            cloud.x = -cloud.radius;
          }
        }
        const cloudGrad = ctx.createRadialGradient(cloud.x, cloud.y, 10, cloud.x, cloud.y, cloud.radius);
        cloudGrad.addColorStop(0, `rgba(186, 171, 245, ${cloud.opacity})`);
        cloudGrad.addColorStop(0.7, `rgba(186, 171, 245, ${cloud.opacity * 0.3})`);
        cloudGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw twinkling stars
      stars.forEach(star => {
        if (!reduceMotion) {
          star.alpha += star.speed;
          if (star.alpha > 0.95 || star.alpha < 0.15) {
            star.speed = -star.speed;
          }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
        ctx.fill();

        // Extra twinkle cross on larger stars
        if (star.radius > 1.2 && star.alpha > 0.7 && !reduceMotion) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - star.radius * 2.5, star.y);
          ctx.lineTo(star.x + star.radius * 2.5, star.y);
          ctx.moveTo(star.x, star.y - star.radius * 2.5);
          ctx.lineTo(star.x, star.y + star.radius * 2.5);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;

      // Occasional gentle shooting star
      if (!reduceMotion) {
        const now = Date.now();
        if (!shootingStar && now > nextShootingStarTime) {
          shootingStar = {
            x: Math.random() * (width * 0.8),
            y: Math.random() * (height * 0.4),
            length: 60 + Math.random() * 40,
            speed: 6 + Math.random() * 4,
            alpha: 1,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2
          };
          nextShootingStarTime = now + 9000 + Math.random() * 7000;
        }

        if (shootingStar) {
          ctx.save();
          ctx.translate(shootingStar.x, shootingStar.y);
          ctx.rotate(shootingStar.angle);
          const shootGrad = ctx.createLinearGradient(0, 0, -shootingStar.length, 0);
          shootGrad.addColorStop(0, `rgba(255, 232, 163, ${shootingStar.alpha})`);
          shootGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.strokeStyle = shootGrad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-shootingStar.length, 0);
          ctx.stroke();
          ctx.restore();

          shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
          shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.alpha -= 0.015;

          if (shootingStar.alpha <= 0) {
            shootingStar = null;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [reduceMotion]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0" 
      aria-hidden="true"
    />
  );
};
