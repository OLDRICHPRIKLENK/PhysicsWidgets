import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-academic-rule bg-ink-950 text-parchment-500 font-serif text-xs py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-baseline justify-between gap-3 text-xs">
        <p>
          Created and maintained by <span className="text-parchment-300 font-medium">Oldrich Priklenk</span>.
        </p>

        <p className="font-mono text-[11px] text-parchment-500">
          Analytical Physics
        </p>
      </div>
    </footer>
  );
};
