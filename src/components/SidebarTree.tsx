import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { WidgetTreeNode, WidgetFolderNode, WidgetLeafNode } from '../types/widget';

interface SidebarTreeProps {
  nodes: WidgetTreeNode[];
  onItemClick?: () => void;
  depth?: number;
}

export const SidebarTree: React.FC<SidebarTreeProps> = ({ nodes, onItemClick, depth = 0 }) => {
  return (
    <ul className={`space-y-0.5 ${depth > 0 ? 'ml-3 pl-2.5 border-l border-academic-rule' : ''}`}>
      {nodes.map((node) => {
        if (node.type === 'folder') {
          return (
            <FolderItem
              key={node.path}
              folder={node}
              depth={depth}
              onItemClick={onItemClick}
            />
          );
        } else {
          return (
            <FileItem
              key={node.widget.id}
              leaf={node}
              onItemClick={onItemClick}
            />
          );
        }
      })}
    </ul>
  );
};

const FolderItem: React.FC<{
  folder: WidgetFolderNode;
  depth: number;
  onItemClick?: () => void;
}> = ({ folder, depth, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const currentPath = decodeURIComponent(location.pathname.replace(/^\/+/, ''));
    if (currentPath.startsWith(folder.path)) {
      setIsOpen(true);
    }
  }, [location.pathname, folder.path]);

  return (
    <li className="select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-1.5 px-2 text-left hover:bg-ink-850 text-parchment-200 transition-colors group"
      >
        <div className="flex items-baseline gap-2 overflow-hidden">
          <span className="font-mono text-[10px] text-parchment-500 group-hover:text-parchment-300">
            {isOpen ? '[-]' : '[+]'}
          </span>
          <span className="font-serif font-medium text-xs tracking-wider uppercase text-parchment-200 group-hover:text-parchment-50 truncate">
            {folder.name}
          </span>
        </div>
        <span className="font-mono text-[10px] text-parchment-500">
          ({folder.widgetCount})
        </span>
      </button>

      {isOpen && (
        <div className="mt-0.5">
          <SidebarTree
            nodes={folder.children}
            depth={depth + 1}
            onItemClick={onItemClick}
          />
        </div>
      )}
    </li>
  );
};

const FileItem: React.FC<{
  leaf: WidgetLeafNode;
  onItemClick?: () => void;
}> = ({ leaf, onItemClick }) => {
  const { widget } = leaf;
  const targetPath = `/${widget.slug}`;

  return (
    <li>
      <NavLink
        to={targetPath}
        onClick={onItemClick}
        className={({ isActive }) =>
          `flex items-baseline justify-between py-1 px-2 text-xs transition-colors ${
            isActive
              ? 'bg-ink-800 text-parchment-50 font-serif border-l-2 border-parchment-300 pl-2'
              : 'text-parchment-400 hover:text-parchment-100 hover:bg-ink-900 font-serif'
          }`
        }
      >
        <span className="truncate tracking-wide">{widget.title}</span>
        <span className="font-mono text-[10px] text-parchment-500 shrink-0 ml-2">
          .html
        </span>
      </NavLink>
    </li>
  );
};
