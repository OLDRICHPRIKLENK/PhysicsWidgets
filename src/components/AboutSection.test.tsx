import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutSection } from './AboutSection';

describe('AboutSection component', () => {
  it('renders the exact required about description text', () => {
    render(<AboutSection />);

    const aboutHeading = screen.getByRole('heading', { name: /^About$/i });
    expect(aboutHeading).toBeInTheDocument();

    expect(
      screen.getByText(
        /This website is to store visualisation artifacts and widgets from analytical equations and physical experiments\. Created and maintained by/i
      )
    ).toBeInTheDocument();

    expect(screen.getAllByText('Oldrich Priklenk').length).toBeGreaterThan(0);
  });
});
