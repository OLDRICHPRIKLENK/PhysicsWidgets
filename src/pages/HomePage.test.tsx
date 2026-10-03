import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
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
  },
];

describe('HomePage component', () => {
  it('renders Welcome to Physics header and hero cylinder widget preview', () => {
    render(
      <MemoryRouter>
        <HomePage widgets={mockWidgets} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Welcome to Physics/i);
    expect(screen.getByText('HERO WIDGET')).toBeInTheDocument();
    expect(screen.getByTitle('Rotating Cylinder Geometry')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^About$/i })).toBeInTheDocument();
  });
});
