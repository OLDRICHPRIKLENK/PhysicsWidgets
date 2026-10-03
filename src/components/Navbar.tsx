import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  totalWidgets: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  totalWidgets,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-ink-950/95 border-b border-academic-rule flex items-center justify-between px-4 sm:px-6">
      {/* Brand & Table of Contents Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 border border-academic-rule hover:border-parchment-400 bg-ink-900 text-parchment-300 hover:text-parchment-100 transition-colors"
          aria-label="Toggle Navigation Sidebar"
          title="Toggle Table of Contents"
        >
          <Menu className="w-4 h-4" />
        </button>

        <Link to="/" className="flex items-baseline gap-3 group">
          <span className="font-serif font-light text-base tracking-[0.16em] uppercase text-parchment-100 group-hover:text-parchment-50 transition-colors">
            PhysicsWidgets
          </span>
          <span className="hidden sm:inline font-mono text-[11px] text-parchment-500 tracking-wider">
            [{totalWidgets} widgets]
          </span>
        </Link>
      </div>

      {/* Center Navigational Index */}
      <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-parchment-400">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `transition-colors ${
              isActive ? 'text-parchment-100 underline decoration-academic-rule-light underline-offset-4' : 'hover:text-parchment-200'
            }`
          }
        >
          [ Home ]
        </NavLink>
      </nav>

      {/* Right / Repository */}
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/OLDRICHPRIKLENK/PhysicsWidgets"
          target="_blank"
          rel="noopener noreferrer"
          className="academic-button py-1 px-2.5 text-[11px]"
          title="Source Repository on GitHub"
        >
          <GithubIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Archive</span>
        </a>
      </div>
    </header>
  );
};
