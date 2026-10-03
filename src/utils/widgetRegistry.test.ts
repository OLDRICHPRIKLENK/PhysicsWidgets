import { describe, it, expect } from 'vitest';
import {
  extractTitle,
  extractDescription,
  parseWidgetPath,
  buildWidgetTree,
  getWidgetBySlug,
  getAdjacentWidgets,
  loadAllWidgets,
} from './widgetRegistry';
import { WidgetMetadata } from '../types/widget';

describe('widgetRegistry utils', () => {
  describe('extractTitle', () => {
    it('extracts title tag content when present', () => {
      const html = '<html><head><title>3D Rotating Cylinder</title></head><body></body></html>';
      expect(extractTitle(html, 'cyllinder')).toBe('3D Rotating Cylinder');
    });

    it('formats fallback name with title casing and underscores replaced', () => {
      const html = '<div>no title tag</div>';
      expect(extractTitle(html, 'future_visualisation')).toBe('Future Visualisation');
      expect(extractTitle(html, 'em_field_dipole')).toBe('Em Field Dipole');
    });
  });

  describe('extractDescription', () => {
    it('extracts meta description content', () => {
      const html = '<html><head><meta name="description" content="Visual representation of magnetic field"></head></html>';
      expect(extractDescription(html)).toBe('Visual representation of magnetic field');
    });

    it('returns undefined when no meta description exists', () => {
      const html = '<html><head><title>Test</title></head></html>';
      expect(extractDescription(html)).toBeUndefined();
    });
  });

  describe('parseWidgetPath', () => {
    it('parses standard category and filename from /widgets directory', () => {
      const html = '<title>Cylinder Geometry</title><meta name="description" content="Interactive 3D cylinder">';
      const widget = parseWidgetPath('/widgets/Geometries/cyllinder.html', html);

      expect(widget).not.toBeNull();
      expect(widget?.id).toBe('Geometries/cyllinder');
      expect(widget?.slug).toBe('Geometries/cyllinder');
      expect(widget?.category).toBe('Geometries');
      expect(widget?.categorySegments).toEqual(['Geometries']);
      expect(widget?.fileName).toBe('cyllinder.html');
      expect(widget?.title).toBe('Cylinder Geometry');
      expect(widget?.description).toBe('Interactive 3D cylinder');
      expect(widget?.rawHtml).toBe(html);
    });

    it('handles nested categories in /widgets', () => {
      const widget = parseWidgetPath('/widgets/Relativity/General/schwarzschild.html', '');
      expect(widget?.category).toBe('Relativity/General');
      expect(widget?.categorySegments).toEqual(['Relativity', 'General']);
      expect(widget?.slug).toBe('Relativity/General/schwarzschild');
      expect(widget?.title).toBe('Schwarzschild');
    });

    it('ignores index.html and non-html files', () => {
      expect(parseWidgetPath('/widgets/index.html')).toBeNull();
      expect(parseWidgetPath('/widgets/Geometries/style.css')).toBeNull();
      expect(parseWidgetPath('index.html')).toBeNull();
    });
  });

  describe('buildWidgetTree', () => {
    const mockWidgets: WidgetMetadata[] = [
      {
        id: 'Geometries/cyllinder',
        slug: 'Geometries/cyllinder',
        title: 'Cyllinder',
        fileName: 'cyllinder.html',
        filePath: '/src/Geometries/cyllinder.html',
        category: 'Geometries',
        categorySegments: ['Geometries'],
        rawHtml: '',
      },
      {
        id: 'Geometries/future_visualisation',
        slug: 'Geometries/future_visualisation',
        title: 'Future Visualisation',
        fileName: 'future_visualisation.html',
        filePath: '/src/Geometries/future_visualisation.html',
        category: 'Geometries',
        categorySegments: ['Geometries'],
        rawHtml: '',
      },
      {
        id: 'EMFields/stub',
        slug: 'EMFields/stub',
        title: 'Stub',
        fileName: 'stub.html',
        filePath: '/src/EMFields/stub.html',
        category: 'EMFields',
        categorySegments: ['EMFields'],
        rawHtml: '',
      },
    ];

    it('constructs a nested tree with correct counts and nodes', () => {
      const tree = buildWidgetTree(mockWidgets);

      expect(tree).toHaveLength(2); // EMFields, Geometries (sorted alphabetically)

      const emFolder = tree[0];
      expect(emFolder.type).toBe('folder');
      if (emFolder.type === 'folder') {
        expect(emFolder.name).toBe('EMFields');
        expect(emFolder.widgetCount).toBe(1);
        expect(emFolder.children).toHaveLength(1);
        expect(emFolder.children[0].type).toBe('file');
      }

      const geomFolder = tree[1];
      expect(geomFolder.type).toBe('folder');
      if (geomFolder.type === 'folder') {
        expect(geomFolder.name).toBe('Geometries');
        expect(geomFolder.widgetCount).toBe(2);
        expect(geomFolder.children).toHaveLength(2);
      }
    });
  });

  describe('getWidgetBySlug', () => {
    const mockWidgets: WidgetMetadata[] = [
      {
        id: 'Geometries/cyllinder',
        slug: 'Geometries/cyllinder',
        title: 'Cyllinder',
        fileName: 'cyllinder.html',
        filePath: '/src/Geometries/cyllinder.html',
        category: 'Geometries',
        categorySegments: ['Geometries'],
        rawHtml: '',
      },
      {
        id: 'EMFields/stub',
        slug: 'EMFields/stub',
        title: 'EM Stub',
        fileName: 'stub.html',
        filePath: '/src/EMFields/stub.html',
        category: 'EMFields',
        categorySegments: ['EMFields'],
        rawHtml: '',
      },
    ];

    it('finds widget by exact slug', () => {
      const result = getWidgetBySlug(mockWidgets, 'Geometries/cyllinder');
      expect(result?.title).toBe('Cyllinder');
    });

    it('finds widget case-insensitively and with leading slash or .html', () => {
      const result1 = getWidgetBySlug(mockWidgets, '/geometries/cyllinder/');
      expect(result1?.title).toBe('Cyllinder');

      const result2 = getWidgetBySlug(mockWidgets, 'emfields/stub.html');
      expect(result2?.title).toBe('EM Stub');
    });

    it('returns undefined if not found', () => {
      expect(getWidgetBySlug(mockWidgets, 'Unknown/widget')).toBeUndefined();
    });
  });

  describe('getAdjacentWidgets', () => {
    const mockWidgets: WidgetMetadata[] = [
      { id: '1', slug: 'w1', title: 'W1', fileName: 'w1.html', filePath: '', category: 'A', categorySegments: ['A'], rawHtml: '' },
      { id: '2', slug: 'w2', title: 'W2', fileName: 'w2.html', filePath: '', category: 'A', categorySegments: ['A'], rawHtml: '' },
      { id: '3', slug: 'w3', title: 'W3', fileName: 'w3.html', filePath: '', category: 'A', categorySegments: ['A'], rawHtml: '' },
    ];

    it('returns correct prev and next for middle widget', () => {
      const adj = getAdjacentWidgets(mockWidgets, 'w2');
      expect(adj.prev?.slug).toBe('w1');
      expect(adj.next?.slug).toBe('w3');
    });

    it('handles boundaries at start and end', () => {
      const startAdj = getAdjacentWidgets(mockWidgets, 'w1');
      expect(startAdj.prev).toBeUndefined();
      expect(startAdj.next?.slug).toBe('w2');

      const endAdj = getAdjacentWidgets(mockWidgets, 'w3');
      expect(endAdj.prev?.slug).toBe('w2');
      expect(endAdj.next).toBeUndefined();
    });
  });

  describe('loadAllWidgets', () => {
    it('discovers and loads widgets from project folders', () => {
      const allWidgets = loadAllWidgets();
      expect(allWidgets.length).toBeGreaterThanOrEqual(4);

      const slugs = allWidgets.map((w) => w.slug);
      expect(slugs).toContain('Geometries/cyllinder');
      expect(slugs).toContain('EMFields/stub');
      expect(slugs).toContain('Relativity/stub');
      expect(slugs).toContain('Geometries/future_visualisation');

      const cylinder = allWidgets.find((w) => w.slug === 'Geometries/cyllinder');
      expect(cylinder?.title).toBe('Interactive Quaternion Superquadrics');
      expect(cylinder?.rawHtml).toContain('plot');

      const stub = allWidgets.find((w) => w.slug === 'Relativity/stub');
      expect(stub?.title).toBe('Nothing to show here!');
      expect(stub?.description).toContain('theoretical depth');
    });
  });
});

