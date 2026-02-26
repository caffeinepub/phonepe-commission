import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import AppHeader from './components/AppHeader';
import CommissionDashboard from './components/CommissionDashboard';
import CustomerPhotosGallery from './components/CustomerPhotosGallery';
import AppFooter from './components/AppFooter';

export type AppView = 'dashboard' | 'photos';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1">
        {activeView === 'dashboard' ? (
          <CommissionDashboard />
        ) : (
          <CustomerPhotosGallery />
        )}
      </main>
      <AppFooter />
      <Toaster richColors position="top-right" />
    </div>
  );
}
