import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { WidgetMetadata, WidgetTreeNode } from '../types/widget';

const mockWidgets: WidgetMetadata[] = [
  {
    id: 'Geometries/cyllinder',
    slug: 'Geometries/cyllinder',
    title: 'Rotating Cylinder',
    fileName: 'cyllinder.html',
    filePath: '/src/Geometries/cyllinder.html',
    category: 'Geometries',
    categorySegments: ['Geometries'],
    rawHtml: '<h1>Cylinder</h1>',
  },
  {
    id: 'EMFields/stub',
    slug: 'EMFields/stub',
    title: 'EM Dipole Field',
    fileName: 'stub.html',
    filePath: '/src/EMFields/stub.html',
    category: 'EMFields',
    categorySegments: ['EMFields'],
    rawHtml: '<h1>EM Field</h1>',
  },
];

const mockTree: WidgetTreeNode[] = [
  {
    type: 'folder',
    name: 'EMFields',
    path: 'EMFields',
    children: [{ type: 'file', name: 'stub.html', widget: mockWidgets[1] }],
    widgetCount: 1,
  },
  {
    type: 'folder',
    name: 'Geometries',
    path: 'Geometries',
    children: [{ type: 'file', name: 'cyllinder.html', widget: mockWidgets[0] }],
    widgetCount: 1,
  },
];

describe('Sidebar component', () => {
  it('renders directory tree folders and widget files', () => {
    render(
      <MemoryRouter>
        <Sidebar
          widgets={mockWidgets}
          tree={mockTree}
          isOpen={true}
          onClose={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('EMFields')).toBeInTheDocument();
    expect(screen.getByText('Geometries')).toBeInTheDocument();
    expect(screen.getByText('Rotating Cylinder')).toBeInTheDocument();
    expect(screen.getByText('EM Dipole Field')).toBeInTheDocument();
  });

  it('filters widgets when user types in search input', () => {
    render(
      <MemoryRouter>
        <Sidebar
          widgets={mockWidgets}
          tree={mockTree}
          isOpen={true}
          onClose={vi.fn()}
        />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'cylinder' } });

    expect(screen.getByText(/Matches \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText('Rotating Cylinder')).toBeInTheDocument();
    expect(screen.queryByText('EM Dipole Field')).not.toBeInTheDocument();
  });
});
