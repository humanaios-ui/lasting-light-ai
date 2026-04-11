import React, { useEffect, useRef } from 'react';
const RESP_RATES = [28, 22, 17, 13, 10, 8, 7, 6, 5, 4];
interface SigilGlowProps {
  li: number | null;
  color: [number, number, number];
  size?: number;
}
function bandIdx(li: number) {
  return Math.min(9, Math.max(0, Math.round((1 - li) * 9)));
}
export function SigilGlow({ li, color, size = 48 }: SigilGlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const S = size * 2; // 2x for retina
    canvas.width = S;
    canvas.height = S;
    const effectiveLI = li === null ? 0.5 : li;
    const bpm = RESP_RATES[bandIdx(effectiveLI)];
    const isForce = li !== null && li >= 1.0;
    const isNull = li === null;
    let tSecs = 0;
    let lastTs: number | null = null;
    let animId: number;
    const [r, g, b] = color;
    const cx = S / 2,
      cy = S / 2;
    const maxR = S * 0.42;
    function frame(timestamp: number) {
      if (lastTs === null) lastTs = timestamp;
      const dt = (timestamp - lastTs) / 1000;
      lastTs = timestamp;
      tSecs += dt;
      // Breathing phase
      const breathCycle = tSecs * bpm / 60 % 1;
      const breath =
      breathCycle < 0.4 ? breathCycle / 0.4 : 1 - (breathCycle - 0.4) / 0.6;
      ctx!.clearRect(0, 0, S, S);
      // Outer glow halo
      const outerR = maxR * (0.85 + breath * 0.15);
      const outerGrad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, outerR);
      outerGrad.addColorStop(
        0,
        `rgba(${r},${g},${b},${(0.12 + breath * 0.12).toFixed(3)})`
      );
      outerGrad.addColorStop(
        0.5,
        `rgba(${r},${g},${b},${(0.06 + breath * 0.06).toFixed(3)})`
      );
      outerGrad.addColorStop(1, 'transparent');
      ctx!.beginPath();
      ctx!.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx!.fillStyle = outerGrad;
      ctx!.fill();
      // Inner glow
      const innerR = maxR * (0.5 + breath * 0.12);
      const innerGrad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, innerR);
      innerGrad.addColorStop(
        0,
        `rgba(${r},${g},${b},${(0.45 + breath * 0.35).toFixed(3)})`
      );
      innerGrad.addColorStop(
        0.5,
        `rgba(${r},${g},${b},${(0.2 + breath * 0.15).toFixed(3)})`
      );
      innerGrad.addColorStop(1, 'transparent');
      ctx!.beginPath();
      ctx!.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx!.fillStyle = innerGrad;
      ctx!.fill();
      // Core orb
      const coreR = maxR * (0.18 + breath * 0.08);
      ctx!.beginPath();
      ctx!.arc(cx, cy, coreR, 0, Math.PI * 2);
      const br = Math.min(255, r + 60),
        bg = Math.min(255, g + 60),
        bb = Math.min(255, b + 60);
      ctx!.fillStyle = `rgba(${br},${bg},${bb},${(0.7 + breath * 0.3).toFixed(2)})`;
      ctx!.fill();
      // Bright center pip
      ctx!.beginPath();
      ctx!.arc(cx, cy, coreR * 0.35, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(255,255,255,${(0.4 + breath * 0.6).toFixed(2)})`;
      ctx!.fill();
      // Force ring for LI >= 1.0
      if (isForce) {
        ctx!.beginPath();
        ctx!.arc(cx, cy, coreR + 4 + breath * 3, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(217,125,112,${(0.25 + breath * 0.35).toFixed(2)})`;
        ctx!.lineWidth = 1.2;
        ctx!.stroke();
      }
      // Null/unanchored: flickering dim ring
      if (isNull) {
        const flicker = 0.15 + 0.15 * Math.sin(tSecs * 3.7);
        ctx!.beginPath();
        ctx!.arc(cx, cy, coreR + 5, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${r},${g},${b},${flicker.toFixed(2)})`;
        ctx!.lineWidth = 0.8;
        ctx!.setLineDash([3, 4]);
        ctx!.stroke();
        ctx!.setLineDash([]);
      }
      animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [li, color, size]);
  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
      className="block shrink-0" />);


}