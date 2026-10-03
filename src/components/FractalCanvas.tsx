import React, { useEffect, useRef, useState } from 'react';

export const FractalCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 340;
    const height = 280;
    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;
    const maxIter = 55;

    const renderFractal = () => {
      if (isPlaying) {
        timeRef.current += 0.01;
      }
      const t = timeRef.current;

      // Dynamic parameter in complex plane
      const cr = -0.7269 + Math.sin(t * 0.5) * 0.06;
      const ci = 0.1889 + Math.cos(t * 0.4) * 0.06;

      let idx = 0;
      for (let y = 0; y < height; y++) {
        const zy0 = (y - height / 2) * (2.4 / height);
        for (let x = 0; x < width; x++) {
          let zx = (x - width / 2) * (2.4 / height);
          let zy = zy0;
          let iter = 0;

          while (zx * zx + zy * zy < 4.0 && iter < maxIter) {
            const xtemp = zx * zx - zy * zy + cr;
            zy = 2.0 * zx * zy + ci;
            zx = xtemp;
            iter++;
          }

          if (iter === maxIter) {
            // Interior: Deep matte charcoal ink
            data[idx] = 12;
            data[idx + 1] = 12;
            data[idx + 2] = 14;
            data[idx + 3] = 255;
          } else {
            // Monochromatic archival ink engraving (silver/ivory gradient)
            const lum = Math.floor((iter / maxIter) * 210 + 30);
            data[idx] = lum;
            data[idx + 1] = lum - 3;
            data[idx + 2] = lum - 8;
            data[idx + 3] = 255;
          }
          idx += 4;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Fine coordinate crosshairs over the fractal plate
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(renderFractal);
      }
    };

    renderFractal();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="border border-academic-rule bg-ink-900 overflow-hidden">
      {/* Plate Header */}
      <div className="px-3 py-1.5 bg-ink-950 border-b border-academic-rule flex items-center justify-between font-mono text-[10px] text-parchment-400">
        <span>FIG. 2.1 — COMPLEX DYNAMICS</span>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="hover:text-parchment-100 transition-colors"
        >
          {isPlaying ? '[ pause ]' : '[ resume ]'}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-auto block object-cover aspect-[4/3] bg-ink-950"
      />

      {/* Plate Footnote */}
      <div className="p-2.5 font-serif text-[11px] text-parchment-400 bg-ink-950 border-t border-academic-rule flex justify-between items-baseline">
        <span>Attractor: z ↦ z² + c</span>
        <span className="font-mono text-[10px] text-parchment-500">c ∈ ℂ</span>
      </div>
    </div>
  );
};
