import type { ReactNode } from 'react';
import { Header } from './Header';
import { useOutletContext } from 'react-router-dom';

interface AppLayoutContext {
  onMobileMenuOpen: () => void;
}

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function PageLayout({ title, description, children, actions }: PageLayoutProps) {
  const context = useOutletContext<AppLayoutContext | undefined>();
  const onMobileMenuOpen = context?.onMobileMenuOpen ?? (() => undefined);

  return (
    <div className="min-h-screen">
      <Header
        title={title}
        description={description}
        onMobileMenuOpen={onMobileMenuOpen}
      />
      <div className="p-4 sm:p-6">
        {actions && <div className="mb-6">{actions}</div>}
        {children}
      </div>
    </div>
  );
}