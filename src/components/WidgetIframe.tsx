import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface WidgetIframeProps {
  rawHtml: string;
  title: string;
  className?: string;
  reloadKey?: number;
  onLoad?: () => void;
}

export const WidgetIframe: React.FC<WidgetIframeProps> = ({
  rawHtml,
  title,
  className = '',
  reloadKey = 0,
  onLoad,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setIsLoading(true);
  }, [rawHtml, reloadKey]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    if (onLoad) {
      onLoad();
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-ink-950 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink-950/90 transition-opacity duration-200">
          <Loader2 className="w-5 h-5 text-parchment-400 animate-spin mb-2" />
          <p className="text-[11px] font-mono text-parchment-500 tracking-widest uppercase">
            Mounting Apparatus...
          </p>
        </div>
      )}

      <iframe
        key={reloadKey}
        ref={iframeRef}
        title={title}
        srcDoc={rawHtml}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={handleIframeLoad}
        className="w-full h-full border-0 block bg-transparent"
        loading="lazy"
      />
    </div>
  );
};
