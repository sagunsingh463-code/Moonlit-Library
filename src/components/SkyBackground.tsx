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

    // Generate delicate dreamy stars
    const starCount = Math.min(180, Math.floor((width * height) / 8000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      speed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      color: Math.random() > 0.4 
        ? '#FFF7ED' // Cream
        : (Math.random() > 0.5 ? '#C7B6E8' : (Math.random() > 0.5 ? '#F3D8E5' : '#E8DDF8')) // Dusty lavender, pastel pink, soft lilac
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

    // Delicate floating fairy sparkles (starlit library dust)
    const sparkleCount = 28;
    const sparkles = Array.from({ length: sparkleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.8,
      speedY: Math.random() * 0.22 + 0.08,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.5 ? '#F3D8E5' : '#E2C785' // Blush pink or warm golden candlelight
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isLight = document.documentElement.classList.contains('light-theme');

      // Background gradient (Deep Plum sanctuary sky in dark mode vs soft cream & pastel pink in light mode)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isLight) {
        bgGrad.addColorStop(0, '#FAF5F8');
        bgGrad.addColorStop(0.4, '#FDF2F7');
        bgGrad.addColorStop(0.8, '#F6EFF9');
        bgGrad.addColorStop(1, '#EDE5F5');
      } else {
        bgGrad.addColorStop(0, '#1E1528');
        bgGrad.addColorStop(0.4, '#241832');
        bgGrad.addColorStop(0.8, '#2B1E3B');
        bgGrad.addColorStop(1, '#30243D');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Dusty lavender & pastel pink celestial nebulas
      const nebula1 = ctx.createRadialGradient(width * 0.75, height * 0.2, 20, width * 0.75, height * 0.2, 450);
      nebula1.addColorStop(0, 'rgba(199, 182, 232, 0.14)');
      nebula1.addColorStop(0.6, 'rgba(232, 221, 248, 0.05)');
      nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(width * 0.2, height * 0.6, 20, width * 0.2, height * 0.6, 400);
      nebula2.addColorStop(0, 'rgba(243, 216, 229, 0.1)');
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
        cloudGrad.addColorStop(0, `rgba(232, 221, 248, ${cloud.opacity * 1.2})`);
        cloudGrad.addColorStop(0.7, `rgba(199, 182, 232, ${cloud.opacity * 0.4})`);
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

        // Drifting fairy dust sparkles (warm golden & blush pink glowing particles)
        sparkles.forEach(sp => {
          sp.y -= sp.speedY;
          sp.angle += sp.angularSpeed;
          sp.x += Math.sin(sp.angle) * 0.35;
          if (sp.y < -10) {
            sp.y = height + 10;
            sp.x = Math.random() * width;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fillStyle = sp.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = sp.color;
          ctx.globalAlpha = 0.5 + Math.sin(sp.angle) * 0.35;
          ctx.fill();
          ctx.restore();
        });
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
