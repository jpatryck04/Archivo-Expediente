import { Link } from 'react-router-dom';
import { Menu, Search, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  description?: string;
  onMobileMenuOpen: () => void;
}

export function Header({ title, description, onMobileMenuOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
            aria-label="Abrir menú de navegación"
            onClick={onMobileMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-gray-900">{title}</h1>
          {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
          )}
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
          <Link to="/expedientes" className="flex-1 sm:flex-none">
            <Button variant="outline" size="sm" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </Link>
          <Link to="/scan" className="flex-1 sm:flex-none">
            <Button size="sm" className="w-full">
              <ScanLine className="h-4 w-4 mr-2" />
              Escanear QR
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}