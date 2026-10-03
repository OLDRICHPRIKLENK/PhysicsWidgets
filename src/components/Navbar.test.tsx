import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './Navbar';

describe('Navbar component', () => {
  it('renders branding and author attribution', () => {
    const handleToggle = vi.fn();
    render(
      <MemoryRouter>
        <Navbar onToggleSidebar={handleToggle} isSidebarOpen={false} totalWidgets={5} />
      </MemoryRouter>
    );

    expect(screen.getByText('PhysicsWidgets')).toBeInTheDocument();
    expect(screen.getByText(/5 widgets/i)).toBeInTheDocument();
  });

  it('triggers onToggleSidebar when menu button is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <MemoryRouter>
        <Navbar onToggleSidebar={handleToggle} isSidebarOpen={false} totalWidgets={5} />
      </MemoryRouter>
    );

    const toggleBtn = screen.getByRole('button', { name: /toggle navigation sidebar/i });
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
