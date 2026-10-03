import React from 'react';
import { FractalCanvas } from './FractalCanvas';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-12 border-b border-academic-rule relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* About Text Content */}
          <div className="lg:col-span-7 space-y-5">
            <h2 className="font-serif font-light text-3xl sm:text-4xl text-parchment-100 tracking-tight">
              About
            </h2>

            {/* Exact Required Text */}
            <div className="p-5 border-l-2 border-parchment-400 bg-ink-900 border border-academic-rule">
              <p className="font-serif text-base sm:text-lg text-parchment-200 leading-relaxed font-light">
                This website is to store visualisation artifacts and widgets from analytical equations and physical experiments. Created and maintained by <strong className="text-parchment-100 font-medium">Oldrich Priklenk</strong>.
              </p>
            </div>

            <div className="pt-2 flex items-baseline gap-2 font-serif text-xs text-parchment-400">
              <span className="italic">Curator:</span>
              <span className="text-parchment-200 font-medium">Oldrich Priklenk</span>
            </div>
          </div>

          {/* Fractal Image */}
          <div className="lg:col-span-5">
            <FractalCanvas />
          </div>
        </div>
      </div>
    </section>
  );
};
