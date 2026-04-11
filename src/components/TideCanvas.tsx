import React, { useEffect, useRef } from 'react';
export function TideCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W: number,
      H: number,
      t = 0;
    let pts: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      f: number;
      c: 'a' | 'b';
    }> = [];
    const LI = 0.8632;
    let animationFrameId: number;
    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
      spawnPts();
    }
    function spawnPts() {
      pts = [];
      const n = Math.floor(W / 15);
      for (let i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22,
          vy: 0.1 + Math.random() * 0.2,
          r: 0.4 + Math.random() * 1.3,
          a: 0.07 + Math.random() * 0.25,
          f: 0.002 + Math.random() * 0.005,
          c: Math.random() > 0.55 ? 'a' : 'b'
        });
      }
    }
    function wl(x: number, t: number) {
      const b = H * (1 - LI * 0.53);
      return (
        b +
        Math.sin(x * 0.004 + t * 0.37) * H * 0.054 +
        Math.sin(x * 0.009 + t * 0.71 + 1.1) * H * 0.027 +
        Math.sin(x * 0.0015 + t * 0.21 + 2.3) * H * 0.037);

    }
    function draw() {
      t += 0.0068;
      ctx!.clearRect(0, 0, W, H);
      // Water body
      ctx!.beginPath();
      ctx!.moveTo(0, H);
      for (let x = 0; x <= W; x += 4) ctx!.lineTo(x, wl(x, t));
      ctx!.lineTo(W, H);
      ctx!.closePath();
      const g = ctx!.createLinearGradient(0, H * 0.22, 0, H);
      g.addColorStop(0, 'rgba(26,84,144,.19)');
      g.addColorStop(0.42, 'rgba(13,40,72,.36)');
      g.addColorStop(1, 'rgba(26,23,20,.8)');
      ctx!.fillStyle = g;
      ctx!.fill();
      // Crest
      ctx!.beginPath();
      for (let x = 0; x <= W; x += 4) {
        const y = wl(x, t);
        x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = 'rgba(37,99,168,.36)';
      ctx!.lineWidth = 1.1;
      ctx!.stroke();
      // Electric shimmer
      const sh = 0.038 + 0.028 * Math.sin(t * 4.2);
      ctx!.beginPath();
      for (let x = 0; x <= W; x += 4) {
        const y = wl(x, t) - 1.8;
        x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = `rgba(212,160,74,${sh})`;
      ctx!.lineWidth = 0.65;
      ctx!.stroke();
      // Particles
      pts.forEach((p) => {
        const wy = wl(p.x, t);
        const inW = p.y > wy;
        p.x += p.vx + Math.sin(t * p.f + p.y * 0.008) * 0.32;
        p.y -= inW ? p.vy * 0.26 : p.vy;
        if (p.y < -4) {
          p.y = H + 4;
          p.x = Math.random() * W;
        }
        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
        const d = Math.abs(p.y - wy);
        const al = inW ? p.a * 0.45 : p.a * Math.max(0, 1 - d / (H * 0.3));
        const [r, g, b] = p.c === 'a' ? [212, 160, 74] : [37, 99, 168];
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r},${g},${b},${al})`;
        ctx!.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    resize();
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen" />);


}