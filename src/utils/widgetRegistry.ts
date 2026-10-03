import { WidgetMetadata, WidgetTreeNode, WidgetFolderNode, WidgetLeafNode } from '../types/widget';

/**
 * Extracts a human-friendly title from an HTML string or filename.
 */
export function extractTitle(rawHtml: string, fallbackName: string): string {
  const titleMatch = rawHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]?.trim()) {
    return titleMatch[1].trim();
  }

  // Format filename: 'future_visualisation' -> 'Future Visualisation'
  return fallbackName
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

/**
 * Extracts a description from HTML meta tags if present.
 */
export function extractDescription(rawHtml: string): string | undefined {
  const metaMatch = rawHtml.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
    || rawHtml.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
  return metaMatch ? metaMatch[1].trim() : undefined;
}

/**
 * Normalizes an import path from Vite import.meta.glob into structured WidgetMetadata.
 * Handles paths like:
 *   - "/src/Geometries/cyllinder.html"
 *   - "/src/widgets/Geometries/cyllinder.html"
 *   - "src/EMFields/stub.html"
 */
export function parseWidgetPath(filePath: string, rawHtml: string = ''): WidgetMetadata | null {
  // Normalize slashes
  let cleanPath = filePath.replace(/\\/g, '/');

  // Skip index.html or files outside of widget directories if needed
  if (cleanPath.endsWith('/index.html') || cleanPath === 'index.html') {
    return null;
  }

  // Remove leading /widgets/, /src/widgets/, /src/, or relative prefixes
  cleanPath = cleanPath.replace(/^\/?(src\/widgets\/|widgets\/|src\/)/, '');

  const segments = cleanPath.split('/').filter(Boolean);
  if (segments.length === 0) {
    return null;
  }

  const fileName = segments[segments.length - 1];
  if (!fileName.endsWith('.html')) {
    return null;
  }

  const baseName = fileName.replace(/\.html$/, '');
  const categorySegments = segments.slice(0, -1);
  const category = categorySegments.length > 0 ? categorySegments.join('/') : 'General';
  const slug = categorySegments.length > 0 ? `${categorySegments.join('/')}/${baseName}` : baseName;
  const title = extractTitle(rawHtml, baseName);
  const description = extractDescription(rawHtml);

  return {
    id: slug,
    slug,
    title,
    fileName,
    filePath,
    category,
    categorySegments: categorySegments.length > 0 ? categorySegments : ['General'],
    rawHtml,
    description,
  };
}

/**
 * Transforms an array of parsed widgets into a nested directory tree.
 */
export function buildWidgetTree(widgets: WidgetMetadata[]): WidgetTreeNode[] {
  const rootFolders: Map<string, WidgetFolderNode> = new Map();
  const rootFiles: WidgetLeafNode[] = [];

  for (const widget of widgets) {
    if (widget.categorySegments.length === 0 || (widget.categorySegments.length === 1 && widget.categorySegments[0] === 'General')) {
      rootFiles.push({
        type: 'file',
        name: widget.fileName,
        widget,
      });
      continue;
    }

    let currentMap = rootFolders;
    let accumulatedPath = '';

    for (let i = 0; i < widget.categorySegments.length; i++) {
      const segment = widget.categorySegments[i];
      accumulatedPath = accumulatedPath ? `${accumulatedPath}/${segment}` : segment;

      let folderNode = currentMap.get(segment);
      if (!folderNode) {
        folderNode = {
          type: 'folder',
          name: segment,
          path: accumulatedPath,
          children: [],
          widgetCount: 0,
        };
        currentMap.set(segment, folderNode);
      }

      folderNode.widgetCount += 1;

      // If we are at the deepest category level, insert the leaf file
      if (i === widget.categorySegments.length - 1) {
        folderNode.children.push({
          type: 'file',
          name: widget.fileName,
          widget,
        });
      } else {
        // Prepare next nested folder map if needed
        let subFolderMap = (folderNode as unknown as { _subMap?: Map<string, WidgetFolderNode> })._subMap;
        if (!subFolderMap) {
          subFolderMap = new Map<string, WidgetFolderNode>();
          (folderNode as unknown as { _subMap?: Map<string, WidgetFolderNode> })._subMap = subFolderMap;
        }
        currentMap = subFolderMap;
      }
    }
  }

  // Helper to convert maps to arrays recursively and sort alphabetically
  function finalizeNodes(folders: Map<string, WidgetFolderNode>, files: WidgetLeafNode[]): WidgetTreeNode[] {
    const result: WidgetTreeNode[] = [];

    // Sort folders by name
    const sortedFolderKeys = Array.from(folders.keys()).sort((a, b) => a.localeCompare(b));
    for (const key of sortedFolderKeys) {
      const folder = folders.get(key)!;
      const subMap = (folder as unknown as { _subMap?: Map<string, WidgetFolderNode> })._subMap;
      if (subMap) {
        const subFolders = finalizeNodes(subMap, []);
        // Combine sub-folders and existing children
        folder.children = [...subFolders, ...folder.children];
        delete (folder as unknown as { _subMap?: unknown })._subMap;
      }
      // Sort children: folders first, then files
      folder.children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      result.push(folder);
    }

    // Sort files by title or filename
    files.sort((a, b) => a.name.localeCompare(b.name));
    result.push(...files);

    return result;
  }

  return finalizeNodes(rootFolders, rootFiles);
}

/**
 * Finds a widget by slug or case-insensitive matching.
 */
export function getWidgetBySlug(widgets: WidgetMetadata[], slug: string): WidgetMetadata | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');
  const cleanLower = cleanSlug.toLowerCase();

  return widgets.find((w) => {
    const wSlug = w.slug.toLowerCase();
    return wSlug === cleanLower || w.id.toLowerCase() === cleanLower;
  });
}

/**
 * Returns previous and next widgets for sequential navigation.
 */
export function getAdjacentWidgets(
  widgets: WidgetMetadata[],
  currentSlug: string
): { prev?: WidgetMetadata; next?: WidgetMetadata } {
  const index = widgets.findIndex((w) => {
    const cleanCurrent = currentSlug.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '').toLowerCase();
    return w.slug.toLowerCase() === cleanCurrent;
  });

  if (index === -1) {
    return {};
  }

  return {
    prev: index > 0 ? widgets[index - 1] : undefined,
    next: index < widgets.length - 1 ? widgets[index + 1] : undefined,
  };
}

/**
 * Scans and parses all HTML files from /widgets dynamically using Vite's import.meta.glob.
 */
export function loadAllWidgets(): WidgetMetadata[] {
  // We glob all html files in /widgets, allowing users to drop widgets without touching src/
  // Vite replaces this at build-time with an object of paths -> module raw strings
  const rawHtmlModules = import.meta.glob(
    ['/widgets/**/*.html'],
    { query: '?raw', import: 'default', eager: true }
  ) as Record<string, string>;

  const widgets: WidgetMetadata[] = [];

  for (const [filePath, rawHtml] of Object.entries(rawHtmlModules)) {
    const parsed = parseWidgetPath(filePath, rawHtml);
    if (parsed) {
      widgets.push(parsed);
    }
  }

  // Sort widgets deterministically by category and title
  widgets.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });

  return widgets;
}
