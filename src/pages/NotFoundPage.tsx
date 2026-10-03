import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-14 px-4 font-serif">
      <div className="max-w-md w-full text-center p-8 border border-academic-rule bg-ink-900 space-y-5">
        <div className="w-12 h-12 border border-academic-rule flex items-center justify-center mx-auto text-parchment-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div>
          <div className="font-mono text-xs text-parchment-500 uppercase tracking-widest mb-1">
            ERROR RECORD 404
          </div>
          <h1 className="font-serif font-light text-2xl text-parchment-100 mb-2">
            Null Catalog Index
          </h1>
          <p className="font-serif italic text-xs text-parchment-400 max-w-xs mx-auto leading-relaxed">
            The archival catalog contains no analytical apparatus corresponding to the requested coordinate.
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3 font-mono text-xs">
          <Link to="/" className="academic-button-primary">
            <span>[ Return to Index ]</span>
          </Link>
          <Link to="/Geometries/cyllinder" className="academic-button">
            <span>[ Plate I ]</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
