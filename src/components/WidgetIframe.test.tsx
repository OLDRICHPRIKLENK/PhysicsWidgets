import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { WidgetIframe } from './WidgetIframe';

describe('WidgetIframe component', () => {
  it('renders an iframe with proper sandbox and srcDoc', () => {
    const rawHtml = '<!DOCTYPE html><html><body><h1>Quantum Simulation</h1></body></html>';
    render(
      <WidgetIframe
        rawHtml={rawHtml}
        title="Quantum Simulation Widget"
      />
    );

    const iframe = screen.getByTitle('Quantum Simulation Widget') as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe.srcdoc).toBe(rawHtml);
    expect(iframe.getAttribute('sandbox')).toContain('allow-scripts');
  });

  it('triggers onLoad callback when iframe finishes loading', () => {
    const handleLoad = vi.fn();
    render(
      <WidgetIframe
        rawHtml="<h1>Loaded</h1>"
        title="Test Widget"
        onLoad={handleLoad}
      />
    );

    const iframe = screen.getByTitle('Test Widget');
    act(() => {
      fireEvent.load(iframe);
    });
    expect(handleLoad).toHaveBeenCalled();
  });
});
