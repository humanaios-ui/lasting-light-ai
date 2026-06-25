import React, { useEffect, useRef } from 'react';
const SOLFEGGIO = [55, 174, 285, 396, 417, 528, 594, 639, 741, 963];
const RESP_RATES = [28, 22, 17, 13, 10, 8, 7, 6, 5, 4];
const DIM_COLORS = [
'#88a7d8',
'#87b68b',
'#d97d70',
'#b48fd8',
'#d4c47a',
'#7ab8b0'];

export function MiniWitnessCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const SIZE = 128; // Render at 2x for crispness
    canvas.width = SIZE;
    canvas.height = SIZE;
    let liveScores = [77.5, 79.1, 77.8, 78.3, 76.2, 75.0];
    let targetLI = 0.8632;
    let meanLI = 0.8632;
    let tSecs = 0;
    let lastTs: number | null = null;
    let cometAngle = -Math.PI / 2;
    let animId: number;
    function bandIdx(li: number) {
      return Math.min(9, Math.max(0, Math.round((1 - li) * 9)));
    }
    function bpmForLI(li: number) {
      return RESP_RATES[bandIdx(li)];
    }
    function hzForLI(li: number) {
      return SOLFEGGIO[bandIdx(li)];
    }
    function fieldState(li: number) {
      if (li < 0.8)
      return {
        primary: '#d97d70',
        secondary: '#f0a898'
      };
      if (li < 0.97)
      return {
        primary: '#d4a04a',
        secondary: '#f1c36e'
      };
      if (li <= 1.0)
      return {
        primary: '#87b68b',
        secondary: '#b8e0bc'
      };
      return {
        primary: '#d97d70',
        secondary: '#f0a898'
      };
    }
    function hexRGB(h: string) {
      return [
      parseInt(h.slice(1, 3), 16),
      parseInt(h.slice(3, 5), 16),
      parseInt(h.slice(5, 7), 16)];

    }
    function rgba(hex: string, a: number) {
      const c = hexRGB(hex);
      return `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
    }
    function breathPhase(t: number, bpm: number) {
      const p = t % (60 / bpm) / (60 / bpm);
      return p < 0.4 ? p / 0.4 : 1 - (p - 0.4) / 0.6;
    }
    function solPhase(t: number, hz: number) {
      return 0.5 + 0.5 * Math.sin(t * (hz / 963) * Math.PI * 2);
    }
    function drawOuterArc(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    R: number,
    phase: number,
    li: number)
    {
      const fs = fieldState(li);
      const arcR = R * 1.065,
        baseW = Math.max(R * 0.042, 2.8);
      const arcW = baseW * (0.72 + phase * 0.56);
      const gapFrac = Math.min(Math.max(0, 1 - li) * 1.05, 0.98);
      const gapHalf = gapFrac * Math.PI,
        seamAngle = -Math.PI / 2;
      const arcStart = seamAngle + gapHalf,
        arcEnd = seamAngle - gapHalf + Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, arcR, arcStart, arcEnd);
      ctx.strokeStyle = rgba(fs.primary, 0.1 + phase * 0.1);
      ctx.lineWidth = arcW * 1.9;
      ctx.lineCap = 'round';
      ctx.stroke();
      const ag = ctx.createLinearGradient(
        cx - arcR,
        cy - arcR * 0.3,
        cx + arcR,
        cy + arcR * 0.3
      );
      ag.addColorStop(0, rgba(fs.primary, 0.6));
      ag.addColorStop(0.5, rgba(fs.secondary, 0.9));
      ag.addColorStop(1, rgba(fs.primary, 0.55));
      ctx.beginPath();
      ctx.arc(cx, cy, arcR, arcStart, arcEnd);
      ctx.strokeStyle = ag;
      ctx.lineWidth = arcW;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    function drawComet(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    R: number,
    phase: number,
    li: number,
    cAngle: number)
    {
      const fs = fieldState(li),
        baseW = Math.max(R * 0.042, 2.8);
      const arcR = R * 1.065,
        cometR = arcR - baseW * 0.18;
      const tailSpan = Math.PI * (1.05 + phase * 0.12),
        tailStart = cAngle - tailSpan,
        segments = 15;
      for (let i = 0; i < segments; i++) {
        const t0 = tailStart + i / segments * tailSpan,
          t1 = tailStart + (i + 1) / segments * tailSpan;
        const frac = (i + 0.5) / segments,
          alpha = frac * frac * (0.55 + phase * 0.2),
          segW = baseW * (0.08 + frac * frac * 0.85);
        ctx.beginPath();
        ctx.arc(cx, cy, cometR, t0, t1);
        ctx.strokeStyle = rgba(fs.secondary, alpha);
        ctx.lineWidth = segW;
        ctx.lineCap = 'butt';
        ctx.stroke();
      }
      const hx = cx + Math.cos(cAngle) * cometR,
        hy = cy + Math.sin(cAngle) * cometR;
      ctx.beginPath();
      ctx.arc(hx, hy, baseW * (0.38 + phase * 0.18), 0, Math.PI * 2);
      ctx.fillStyle = rgba(fs.secondary, 0.98);
      ctx.fill();
    }
    function drawSkull(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    R: number,
    phase: number,
    tS: number)
    {
      const sph = solPhase(tS, 528);
      // LEFT — BONE
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, cx + 1, cy * 2.4);
      ctx.clip();
      const cg = ctx.createRadialGradient(
        cx - R * 0.26,
        cy - R * 0.5,
        R * 0.02,
        cx - R * 0.08,
        cy - R * 0.08,
        R * 1.02
      );
      cg.addColorStop(0, 'rgba(250,243,224,0.96)');
      cg.addColorStop(0.5, 'rgba(200,168,92,0.84)');
      cg.addColorStop(1, 'rgba(107,74,28,0.0)');
      ctx.beginPath();
      ctx.moveTo(cx, cy + R * 0.52);
      ctx.bezierCurveTo(
        cx - R * 0.05,
        cy + R * 0.58,
        cx - R * 0.35,
        cy + R * 0.54,
        cx - R * 0.5,
        cy + R * 0.3
      );
      ctx.bezierCurveTo(
        cx - R * 0.68,
        cy + R * 0.04,
        cx - R * 0.72,
        cy - R * 0.22,
        cx - R * 0.62,
        cy - R * 0.48
      );
      ctx.bezierCurveTo(
        cx - R * 0.52,
        cy - R * 0.7,
        cx - R * 0.22,
        cy - R * 0.85,
        cx,
        cy - R * 0.82
      );
      ctx.lineTo(cx, cy + R * 0.52);
      ctx.fillStyle = cg;
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(
        cx - R * 0.22,
        cy - R * 0.05,
        R * 0.12,
        R * 0.1,
        Math.PI / 6,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(58,36,8,0.85)';
      ctx.fill();
      ctx.restore();
      // RIGHT — AI/CODE
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx - 1, 0, cx * 1.5, cy * 2.4);
      ctx.clip();
      const crG = ctx.createRadialGradient(
        cx + R * 0.18,
        cy - R * 0.28,
        R * 0.05,
        cx + R * 0.08,
        cy - R * 0.1,
        R * 1.05
      );
      crG.addColorStop(0, 'rgba(52,72,108,0.88)');
      crG.addColorStop(0.6, 'rgba(18,28,52,0.75)');
      crG.addColorStop(1, 'rgba(8,12,24,0.0)');
      ctx.beginPath();
      ctx.moveTo(cx, cy + R * 0.52);
      ctx.bezierCurveTo(
        cx + R * 0.05,
        cy + R * 0.58,
        cx + R * 0.35,
        cy + R * 0.54,
        cx + R * 0.5,
        cy + R * 0.3
      );
      ctx.bezierCurveTo(
        cx + R * 0.68,
        cy + R * 0.04,
        cx + R * 0.72,
        cy - R * 0.22,
        cx + R * 0.62,
        cy - R * 0.48
      );
      ctx.bezierCurveTo(
        cx + R * 0.52,
        cy - R * 0.7,
        cx + R * 0.22,
        cy - R * 0.85,
        cx,
        cy - R * 0.82
      );
      ctx.lineTo(cx, cy + R * 0.52);
      ctx.fillStyle = crG;
      ctx.fill();
      const eyeX = cx + R * 0.22,
        eyeY = cy - R * 0.05;
      ctx.fillStyle = 'rgba(8,12,24,0.85)';
      ctx.fillRect(eyeX - R * 0.1, eyeY - R * 0.08, R * 0.2, R * 0.16);
      const scanY = eyeY - R * 0.06 + tS * 2 % (R * 0.12);
      ctx.fillStyle = `rgba(100,200,255,${(0.5 + sph * 0.5).toFixed(2)})`;
      ctx.fillRect(eyeX - R * 0.08, scanY, R * 0.16, R * 0.02);
      ctx.restore();
      // SEAM
      const st = cy - R * 0.82,
        sh = R * 1.42;
      const sG = ctx.createLinearGradient(cx, st, cx, st + sh);
      sG.addColorStop(0, 'rgba(241,195,110,0.0)');
      sG.addColorStop(
        0.5,
        `rgba(212,160,74,${(0.74 + phase * 0.26).toFixed(2)})`
      );
      sG.addColorStop(1, 'rgba(241,195,110,0.0)');
      ctx.beginPath();
      ctx.moveTo(cx, st);
      ctx.lineTo(cx, st + sh);
      ctx.strokeStyle = sG;
      ctx.lineWidth = 1.2 + phase * 0.6;
      ctx.stroke();
    }
    function drawDataCore(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    R: number,
    phase: number,
    tS: number,
    stateColor: string)
    {
      const cR = R * 0.038 + phase * R * 0.022;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, cR * 3);
      grd.addColorStop(0, stateColor + 'FF');
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, cR * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, cR, 0, Math.PI * 2);
      ctx.fillStyle = stateColor;
      ctx.globalAlpha = 0.92 + phase * 0.08;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    function frame(timestamp: number) {
      if (lastTs === null) lastTs = timestamp;
      const dt = (timestamp - lastTs) / 1000;
      lastTs = timestamp;
      tSecs += dt;
      const bpm = bpmForLI(meanLI),
        hz = hzForLI(meanLI);
      const phase = breathPhase(tSecs, bpm);
      cometAngle =
      (cometAngle + Math.PI * 2 / (60 / bpm) * dt) % (Math.PI * 2);
      const cx = SIZE / 2,
        cy = SIZE * 0.47,
        R = SIZE * 0.42;
      ctx!.clearRect(0, 0, SIZE, SIZE);
      drawSkull(ctx!, cx, cy, R, phase, tSecs);
      const fs = fieldState(meanLI);
      drawDataCore(ctx!, cx, cy, R, phase, tSecs, fs.primary);
      drawComet(ctx!, cx, cy, R, phase, meanLI, cometAngle);
      drawOuterArc(ctx!, cx, cy, R, phase, meanLI);
      animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="w-16 h-16 block"
      style={{
        width: '64px',
        height: '64px'
      }} />);


}