import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CosmicBackground } from './components/CosmicBackground';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { ViewerPage } from './pages/ViewerPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { loadAllWidgets, buildWidgetTree } from './utils/widgetRegistry';

export const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load all dynamically globbed widgets
  const widgets = useMemo(() => loadAllWidgets(), []);
  const tree = useMemo(() => buildWidgetTree(widgets), [widgets]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-ink-950 text-parchment-200 flex flex-col relative selection:bg-[#2b2b32] selection:text-parchment-50 font-serif">
        {/* Archival Cartesian Grid Background */}
        <CosmicBackground />

        {/* Global Navbar */}
        <Navbar
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          totalWidgets={widgets.length}
        />

        {/* Dynamic Hierarchical Sidebar */}
        <Sidebar
          widgets={widgets}
          tree={tree}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 transition-all duration-300 relative z-10">
          <Routes>
            <Route path="/" element={<HomePage widgets={widgets} />} />
            {/* Direct widget route: /Geometries/cyllinder, /EMFields/stub, etc. */}
            <Route path="/:category/:widgetName" element={<ViewerPage widgets={widgets} />} />
            {/* Catch-all for deeper paths or viewer prefixes */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/*" element={<ViewerPage widgets={widgets} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
