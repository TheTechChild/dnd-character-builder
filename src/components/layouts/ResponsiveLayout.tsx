import React from 'react';
import { cn } from '@/utils/cn';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function ResponsiveLayout({
  children,
  className,
  sidebar,
  header,
  footer,
}: ResponsiveLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-gradient-subtle', className)}>
      {/* Mobile Header */}
      {header && (
        <header className="sticky top-0 z-30 bg-darker/95 backdrop-blur-md border-b border-border-subtle safe-top">
          <div className="container-responsive">
            {header}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        {sidebar && (
          <aside className="hidden lg:block w-64 xl:w-80 bg-dark/50 border-r border-border-subtle">
            <div className="sticky top-[4.5rem] h-[calc(100vh-4.5rem)] overflow-y-auto hide-scrollbar">
              <div className="p-6">
                {sidebar}
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 container-responsive py-6 lg:py-8">
          {/* Tablet Sidebar */}
          {sidebar && (
            <div className="lg:hidden mb-6">
              <div className="bg-dark/50 rounded-lg border border-border-subtle p-4 sm:p-6">
                {sidebar}
              </div>
            </div>
          )}
          
          {children}
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="bg-darker border-t border-border-subtle safe-bottom">
          <div className="container-responsive py-6">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 2, lg: 3 }
}: ResponsiveGridProps) {
  const gridClasses = cn(
    'grid gap-4 sm:gap-6',
    {
      'grid-cols-1': cols.default === 1,
      'grid-cols-2': cols.default === 2,
      'grid-cols-3': cols.default === 3,
      'grid-cols-4': cols.default === 4,
      'sm:grid-cols-1': cols.sm === 1,
      'sm:grid-cols-2': cols.sm === 2,
      'sm:grid-cols-3': cols.sm === 3,
      'sm:grid-cols-4': cols.sm === 4,
      'md:grid-cols-1': cols.md === 1,
      'md:grid-cols-2': cols.md === 2,
      'md:grid-cols-3': cols.md === 3,
      'md:grid-cols-4': cols.md === 4,
      'lg:grid-cols-1': cols.lg === 1,
      'lg:grid-cols-2': cols.lg === 2,
      'lg:grid-cols-3': cols.lg === 3,
      'lg:grid-cols-4': cols.lg === 4,
      'xl:grid-cols-1': cols.xl === 1,
      'xl:grid-cols-2': cols.xl === 2,
      'xl:grid-cols-3': cols.xl === 3,
      'xl:grid-cols-4': cols.xl === 4,
    },
    className
  );

  return <div className={gridClasses}>{children}</div>;
}

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  decorative?: boolean;
}

export function ResponsiveCard({
  children,
  className,
  decorative = true
}: ResponsiveCardProps) {
  return (
    <div
      className={cn(
        'mobile-card',
        'decoration-responsive',
        'hover-effect',
        decorative && 'relative overflow-hidden',
        className
      )}
    >
      {decorative && (
        <>
          {/* Desktop-only decorative elements */}
          <div className="decoration-desktop-only absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-gold-bright/10 to-transparent rounded-full blur-2xl" />
          <div className="decoration-desktop-only absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-mystic-bright/10 to-transparent rounded-full blur-xl" />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface MobileNavigationProps {
  items: Array<{
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    active?: boolean;
  }>;
  className?: string;
}

export function MobileNavigation({ items, className }: MobileNavigationProps) {
  return (
    <nav className={cn('lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-darker/95 backdrop-blur-md border-t border-border-subtle safe-bottom', className)}>
      <div className="flex justify-around items-center px-2 py-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={cn(
              'flex flex-col items-center justify-center',
              'min-w-[64px] p-2 rounded-lg',
              'touch-target-responsive',
              'touch-feedback',
              'transition-all duration-200',
              item.active
                ? 'text-gold-bright bg-gold-bright/10'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            )}
          >
            {item.icon && (
              <span className="text-xl mb-1">{item.icon}</span>
            )}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

interface TabletSidebarProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  className?: string;
}

export function TabletSidebar({
  children,
  sidebarContent,
  className
}: TabletSidebarProps) {
  return (
    <div className={cn('tablet-sidebar', className)}>
      <aside className="hidden md:block lg:hidden">
        <div className="sticky top-20">
          {sidebarContent}
        </div>
      </aside>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}