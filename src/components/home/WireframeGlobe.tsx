// ── TerraFlux Interactive 3D Wireframe Globe & Particle Canvas ───────────────

import React, { useRef, useEffect } from 'react';

export const WireframeGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    let targetRotX = 0.2;
    let targetRotY = 0;
    let rotX = 0.2;
    let rotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      targetRotY = (x / width) * 1.5;
      targetRotX = (y / height) * 1.5;
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Generate 3D sphere points
    const points: { x: number; y: number; z: number; phi: number; theta: number; isContour?: boolean }[] = [];
    const radius = Math.min(width, height) * 0.38;

    for (let lat = -75; lat <= 75; lat += 15) {
      const phi = (lat * Math.PI) / 180;
      const rLat = radius * Math.cos(phi);
      const y = radius * Math.sin(phi);

      for (let lon = 0; lon < 360; lon += 8) {
        const theta = (lon * Math.PI) / 180;
        const x = rLat * Math.sin(theta);
        const z = rLat * Math.cos(theta);
        points.push({ x, y, z, phi, theta, isContour: lat % 30 === 0 });
      }
    }

    for (let i = 0; i < 180; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.85;
      const r = radius * (1 + Math.sin(theta * 3 + phi * 4) * 0.05);
      points.push({
        x: r * Math.cos(phi) * Math.sin(theta),
        y: r * Math.sin(phi),
        z: r * Math.cos(phi) * Math.cos(theta),
        phi,
        theta,
        isContour: true,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.008;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY + time - rotY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Glow halo backdrop behind the globe
      const haloGrad = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius * 1.3);
      haloGrad.addColorStop(0, 'rgba(23, 107, 99, 0.1)');
      haloGrad.addColorStop(0.7, 'rgba(85, 122, 90, 0.04)');
      haloGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Outer boundary ring
      ctx.strokeStyle = 'rgba(23, 107, 99, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Project and draw 3D points
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projectedPoints: { px: number; py: number; depth: number; isContour?: boolean }[] = [];

      for (const p of points) {
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const depth = z2 / radius;
        if (depth > -0.2) {
          const scale = (radius * 1.5) / (radius * 1.5 - z2);
          const px = cx + x1 * scale;
          const py = cy + y2 * scale;
          projectedPoints.push({ px, py, depth, isContour: p.isContour });
        }
      }

      projectedPoints.sort((a, b) => a.depth - b.depth);

      for (let i = 0; i < projectedPoints.length; i++) {
        const pt = projectedPoints[i];
        const alpha = Math.max(0.12, (pt.depth + 0.3) * 0.9);

        if (pt.isContour && pt.depth > 0.3) {
          // Alpine Teal highlight for elevated contours in front
          ctx.fillStyle = `rgba(23, 107, 99, ${alpha})`;
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Muted Moss / Gray particle
          ctx.fillStyle = `rgba(101, 113, 107, ${alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        if (i % 3 === 0 && pt.depth > 0.1) {
          for (let j = i + 1; j < Math.min(i + 8, projectedPoints.length); j++) {
            const pt2 = projectedPoints[j];
            const dx = pt.px - pt2.px;
            const dy = pt.py - pt2.py;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 26) {
              const lineAlpha = (1 - dist / 26) * alpha * 0.35;
              ctx.strokeStyle = `rgba(85, 122, 90, ${lineAlpha})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(pt.px, pt.py);
              ctx.lineTo(pt2.px, pt2.py);
              ctx.stroke();
            }
          }
        }
      }

      // Center crosshair
      ctx.strokeStyle = 'rgba(23, 107, 99, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy);
      ctx.lineTo(cx + 12, cy);
      ctx.moveTo(cx, cy - 12);
      ctx.lineTo(cx, cy + 12);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px] flex items-center justify-center pointer-events-none select-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
