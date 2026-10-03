import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { WidgetMetadata, WidgetTreeNode } from '../types/widget';
import { SidebarTree } from './SidebarTree';

interface SidebarProps {
  widgets: WidgetMetadata[];
  tree: WidgetTreeNode[];
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  widgets,
  tree,
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWidgets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return widgets.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.fileName.toLowerCase().includes(q) ||
        w.slug.toLowerCase().includes(q)
    );
  }, [widgets, searchQuery]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-72 lg:w-64 bg-ink-950 border-r border-academic-rule flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Table of Contents Banner */}
        <div className="p-4 border-b border-academic-rule">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-parchment-400">
              Table of Contents
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-parchment-400 hover:text-parchment-100 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mt-2">
            <Search className="absolute left-2 top-2 w-3.5 h-3.5 text-parchment-500" />
            <input
              type="text"
              placeholder="Search index & formalisms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-6 py-1.5 text-xs font-mono bg-ink-900 border border-academic-rule text-parchment-200 placeholder-parchment-500 focus:outline-none focus:border-parchment-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-parchment-500 hover:text-parchment-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Primary Origin Link */}
        <div className="px-3 pt-3 pb-2 border-b border-academic-rule">
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-2 py-1 text-xs font-serif transition-colors ${
                isActive
                  ? 'bg-ink-800 text-parchment-100 font-medium'
                  : 'text-parchment-400 hover:text-parchment-200'
              }`
            }
          >
            <span>Home</span>
            <span className="font-mono text-[10px] text-parchment-500">/</span>
          </NavLink>
        </div>

        {/* Navigation Content Area */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {searchQuery ? (
            /* Search Results */
            <div>
              <div className="text-[10px] font-mono text-parchment-500 uppercase tracking-widest mb-2 px-1">
                Filter Matches ({filteredWidgets.length})
              </div>
              {filteredWidgets.length === 0 ? (
                <div className="text-center py-6 text-xs font-serif italic text-parchment-500">
                  No plates matched &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                <ul className="space-y-1">
                  {filteredWidgets.map((w) => (
                    <li key={w.id}>
                      <NavLink
                        to={`/${w.slug}`}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `block px-2 py-1.5 text-xs font-serif transition-colors ${
                            isActive
                              ? 'bg-ink-800 text-parchment-100 border-l-2 border-parchment-300'
                              : 'hover:bg-ink-900 text-parchment-300'
                          }`
                        }
                      >
                        <div className="tracking-wide">{w.title}</div>
                        <div className="text-[10px] text-parchment-500 font-mono">
                          {w.category} / {w.fileName}
                        </div>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            /* Scholarly Tree */
            <div>
              <div className="flex items-center justify-between mb-2 px-1 text-[10px] font-mono text-parchment-500 uppercase tracking-widest">
                <span>Classified Apparatus</span>
                <span>{widgets.length}</span>
              </div>

              <SidebarTree nodes={tree} onItemClick={onClose} />
            </div>
          )}
        </div>

        {/* Sidebar Colophon */}
        <div className="p-3 border-t border-academic-rule bg-ink-950 font-mono text-[10px] text-parchment-500 flex items-center justify-between">
          <span>ARCHIVAL REPO</span>
          <span>HILBERT FORMALISM</span>
        </div>
      </aside>
    </>
  );
};
