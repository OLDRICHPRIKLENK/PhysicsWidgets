import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCw, Maximize2 } from 'lucide-react';
import { WidgetIframe } from './WidgetIframe';
import { WidgetMetadata } from '../types/widget';

interface HeroSectionProps {
  heroWidget?: WidgetMetadata;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ heroWidget }) => {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <section className="pt-8 pb-12 border-b border-academic-rule relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="font-serif font-light text-4xl sm:text-5xl lg:text-6xl tracking-tight text-parchment-100 mb-4">
            Welcome to Physics
          </h1>

          <div className="mt-5 flex items-center justify-center font-mono text-xs">
            <Link
              to="/Geometries/cyllinder"
              className="academic-button-primary"
            >
              <span>[ Open Dedicated Viewer ]</span>
            </Link>
          </div>
        </div>

        {/* Technical Plate Container (Figure 1.1) */}
        <div className="border border-academic-rule bg-ink-900">
          {/* Technical Plate Masthead */}
          <div className="px-4 py-2 bg-ink-950 border-b border-academic-rule flex items-center justify-between font-mono text-xs">
            <div className="flex items-baseline gap-2">
              <span className="text-parchment-300 font-medium">PLATE 1.1</span>
              <span className="text-parchment-500">/</span>
              <span className="text-parchment-400">Geometries / cyllinder.html</span>
              <span className="text-[10px] text-parchment-500 border border-academic-rule px-1.5 py-0.2 ml-2">
                HERO WIDGET
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setReloadKey((k) => k + 1)}
                className="text-parchment-400 hover:text-parchment-100 transition-colors flex items-center gap-1 text-[11px]"
                title="Reset simulation parameters"
              >
                <RotateCw className="w-3 h-3" />
                <span>[reset]</span>
              </button>

              <Link
                to="/Geometries/cyllinder"
                className="text-parchment-400 hover:text-parchment-100 transition-colors flex items-center gap-1 text-[11px]"
                title="Open in dedicated viewer"
              >
                <Maximize2 className="w-3 h-3" />
                <span>[expand]</span>
              </Link>
            </div>
          </div>

          {/* Iframe Viewport - vertical space on mobile */}
          <div className="relative w-full h-[540px] sm:h-[480px] bg-ink-950">
            {heroWidget ? (
              <WidgetIframe
                rawHtml={heroWidget.rawHtml}
                title={heroWidget.title}
                reloadKey={reloadKey}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-parchment-500 font-mono text-xs">
                INITIALIZING APPARATUS...
              </div>
            )}
          </div>

          {/* Technical Plate Legend */}
          <div className="px-4 py-3 bg-ink-950 border-t border-academic-rule font-serif text-xs text-parchment-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong className="text-parchment-200 font-medium">Figure 1.1.</strong>—Quaternion Superquadrics Manifold in ℝ³.
            </div>
            <div className="font-mono text-[11px] text-parchment-500">
              F_unified = ∏ [(R_term)^P + (H_term)^P - 1] • P ∈ [1, 8]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
