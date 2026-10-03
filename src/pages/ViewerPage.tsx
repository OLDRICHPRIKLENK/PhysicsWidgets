import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  RotateCw,
  Share2,
  Check,
  ExternalLink,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { WidgetIframe } from '../components/WidgetIframe';
import { WidgetMetadata } from '../types/widget';
import { getWidgetBySlug, getAdjacentWidgets } from '../utils/widgetRegistry';

interface ViewerPageProps {
  widgets: WidgetMetadata[];
}

export const ViewerPage: React.FC<ViewerPageProps> = ({ widgets }) => {
  const params = useParams();
  const navigate = useNavigate();

  const rawSlug = params['*'] || [params.category, params.widgetName].filter(Boolean).join('/');
  const widget = getWidgetBySlug(widgets, rawSlug);

  const [reloadKey, setReloadKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { prev, next } = widget ? getAdjacentWidgets(widgets, widget.slug) : {};

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft' && prev) {
        navigate(`/${prev.slug}`);
      } else if (e.key === 'ArrowRight' && next) {
        navigate(`/${next.slug}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next, navigate]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Fullscreen request failed', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Exit fullscreen failed', err);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleOpenNewTab = () => {
    if (!widget) return;
    const blob = new Blob([widget.rawHtml], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
  };

  if (!widget) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-14 px-4 font-serif">
        <div className="max-w-md text-center p-8 border border-academic-rule bg-ink-900 space-y-4">
          <div className="w-10 h-10 border border-academic-rule flex items-center justify-center mx-auto text-parchment-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-light text-parchment-100">Widget Not Found</h2>
          <p className="text-xs font-mono text-parchment-400">
            Null index for coordinate: &ldquo;{rawSlug}&rdquo;
          </p>
          <div className="pt-2 flex justify-center gap-3 font-mono text-xs">
            <Link to="/" className="academic-button">
              <span>[ Return to Index ]</span>
            </Link>
            {widgets.length > 0 && (
              <Link to={`/${widgets[0].slug}`} className="academic-button-primary">
                <span>[ View Plate I ]</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-14 px-4 sm:px-8 pb-8 font-serif">
      {/* Plate Header & Controls */}
      <div className="max-w-6xl mx-auto w-full mb-4">
        {/* Archival Notation / Breadcrumb */}
        <div className="flex items-baseline gap-2 font-mono text-xs text-parchment-500 mb-2">
          <Link to="/" className="hover:text-parchment-200 transition-colors">
            INDEX
          </Link>
          <span>/</span>
          <span className="text-parchment-400 uppercase tracking-wider">{widget.category}</span>
          <span>/</span>
          <span className="text-parchment-200">{widget.fileName}</span>
        </div>

        {/* Title and Toolbar */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-3 border-b border-academic-rule">
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="font-serif font-light text-2xl sm:text-3xl text-parchment-100 tracking-wide">
                {widget.title}
              </h1>
              <span className="font-mono text-[10px] text-parchment-500 uppercase">
                [{widget.category}]
              </span>
            </div>
            {widget.description && (
              <p className="font-serif italic text-xs text-parchment-400 mt-1 max-w-2xl">
                {widget.description}
              </p>
            )}
          </div>

          {/* Minimalist Controls */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="academic-button text-[11px]"
              title="Reset simulation parameters"
            >
              <RotateCw className="w-3 h-3" />
              <span>[ Reset ]</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="academic-button text-[11px]"
              title="Copy shareable link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-parchment-200" />
                  <span>[ Copied ]</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" />
                  <span>[ Share URL ]</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenNewTab}
              className="academic-button text-[11px]"
              title="Open widget in clean window"
            >
              <ExternalLink className="w-3 h-3" />
              <span>[ New Tab ]</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="academic-button-primary text-[11px]"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3 h-3" />
                  <span>[ Exit ]</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3 h-3" />
                  <span>[ Fullscreen ]</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Workbench Canvas Container */}
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
        <div
          ref={containerRef}
          className={`border border-academic-rule bg-ink-900 flex-1 flex flex-col overflow-hidden ${
            isFullscreen ? 'h-screen w-screen border-0' : 'h-[600px] sm:h-[620px]'
          }`}
        >
          {/* Top Workbench Rule Bar */}
          <div className="px-4 py-2 bg-ink-950 border-b border-academic-rule flex items-center justify-between font-mono text-[11px] text-parchment-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-parchment-400 inline-block" />
              <span>sandbox://{widget.slug}.html</span>
            </div>

            <div className="text-parchment-500 text-[10px]">
              ISOLATED EVALUATION FRAME
            </div>
          </div>

          {/* Pure Iframe Viewport */}
          <div className="flex-1 w-full h-full relative bg-ink-950">
            <WidgetIframe
              rawHtml={widget.rawHtml}
              title={widget.title}
              reloadKey={reloadKey}
            />
          </div>
        </div>

        {/* Sequential Plate Pagination */}
        <div className="flex items-center justify-between mt-4 font-mono text-xs border-t border-academic-rule pt-3 text-parchment-400">
          {prev ? (
            <Link
              to={`/${prev.slug}`}
              className="hover:text-parchment-100 flex items-center gap-1.5 transition-colors"
              title={`Previous: ${prev.title}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>← PREV: {prev.title}</span>
            </Link>
          ) : (
            <div />
          )}

          <div className="font-mono text-[11px] text-parchment-500 hidden sm:block">
            [ use keys ← and → to navigate ]
          </div>

          {next ? (
            <Link
              to={`/${next.slug}`}
              className="hover:text-parchment-100 flex items-center gap-1.5 transition-colors"
              title={`Next: ${next.title}`}
            >
              <span>NEXT: {next.title} →</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};
