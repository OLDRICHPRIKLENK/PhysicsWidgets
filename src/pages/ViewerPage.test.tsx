import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ViewerPage } from './ViewerPage';
import { WidgetMetadata } from '../types/widget';

const mockWidgets: WidgetMetadata[] = [
  {
    id: 'Geometries/cyllinder',
    slug: 'Geometries/cyllinder',
    title: 'Rotating Cylinder Geometry',
    fileName: 'cyllinder.html',
    filePath: '/widgets/Geometries/cyllinder.html',
    category: 'Geometries',
    categorySegments: ['Geometries'],
    rawHtml: '<canvas id="cylinderCanvas"></canvas>',
    description: 'Interactive 3D analytical cylinder',
  },
];

describe('ViewerPage component', () => {
  it('renders widget title, toolbar, and iframe when matched', () => {
    render(
      <MemoryRouter initialEntries={['/Geometries/cyllinder']}>
        <Routes>
          <Route path="/:category/:widgetName" element={<ViewerPage widgets={mockWidgets} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Rotating Cylinder Geometry');
    expect(screen.getByText('Interactive 3D analytical cylinder')).toBeInTheDocument();
    expect(screen.getByTitle('Rotating Cylinder Geometry')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share url/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fullscreen/i })).toBeInTheDocument();
  });

  it('handles link copy click', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(
      <MemoryRouter initialEntries={['/Geometries/cyllinder']}>
        <Routes>
          <Route path="/:category/:widgetName" element={<ViewerPage widgets={mockWidgets} />} />
        </Routes>
      </MemoryRouter>
    );

    const shareBtn = screen.getByRole('button', { name: /share url/i });
    await fireEvent.click(shareBtn);
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });

  it('renders fallback notice when widget does not exist', () => {
    render(
      <MemoryRouter initialEntries={['/Unknown/widget']}>
        <Routes>
          <Route path="/:category/:widgetName" element={<ViewerPage widgets={mockWidgets} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Widget Not Found')).toBeInTheDocument();
  });
});
