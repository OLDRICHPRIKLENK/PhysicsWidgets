import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      drawGrid();
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);

      // Matte dark graphite ground
      ctx.fillStyle = '#0c0c0d';
      ctx.fillRect(0, 0, width, height);

      // Fine Cartesian Coordinate Grid (Archival 1930s Mathematical Ruled Paper)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;

      const majorStep = 80;
      const minorStep = 20;

      // Minor grid lines
      ctx.beginPath();
      for (let x = 0; x < width; x += minorStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += minorStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Major coordinate intersections & subtle tick marks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      for (let x = 0; x < width; x += majorStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += majorStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Coordinate Crosshairs at major intersections
      ctx.strokeStyle = 'rgba(216, 212, 200, 0.12)';
      const crossSize = 3;
      for (let x = 0; x < width; x += majorStep) {
        for (let y = 0; y < height; y += majorStep) {
          ctx.beginPath();
          ctx.moveTo(x - crossSize, y);
          ctx.lineTo(x + crossSize, y);
          ctx.moveTo(x, y - crossSize);
          ctx.lineTo(x, y + crossSize);
          ctx.stroke();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
