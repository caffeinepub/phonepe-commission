import { TrendingUp, LayoutDashboard, Images } from 'lucide-react';
import type { AppView } from '../App';

interface AppHeaderProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

export default function AppHeader({ activeView, onViewChange }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-primary shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
            <img
              src="/assets/generated/phonepe-logo-icon.dim_128x128.png"
              alt="PhonePe Commission Tracker Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.classList.add('bg-accent', 'flex', 'items-center', 'justify-center');
                  const icon = document.createElement('div');
                  icon.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>';
                  parent.appendChild(icon);
                }
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-primary-foreground tracking-tight leading-none">
              PhonePe Commission
            </h1>
            <p className="text-xs font-medium text-primary-foreground/70 mt-0.5">
              Commission Tracker & Calculator
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 bg-primary-foreground/10 rounded-xl p-1">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeView === 'dashboard'
                ? 'bg-primary-foreground text-primary shadow-sm'
                : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => onViewChange('photos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeView === 'photos'
                ? 'bg-primary-foreground text-primary shadow-sm'
                : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
            }`}
          >
            <Images className="w-3.5 h-3.5" />
            Customer Photos
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-primary-foreground/10 rounded-full px-3 py-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold text-primary-foreground/90">Live Tracker</span>
          </div>
        </div>
      </div>
    </header>
  );
}
