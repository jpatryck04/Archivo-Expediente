interface ScannerViewfinderProps {
  isScanning: boolean;
}

export function ScannerViewfinder({ isScanning }: ScannerViewfinderProps) {
  if (!isScanning) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div className="relative w-64 h-64">
        {/* Esquinas */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg" />

        {/* Línea animada */}
        <div className="absolute left-2 right-2 h-0.5 bg-red-500 animate-scan-line shadow-lg" />
      </div>

      <style>{`
        @keyframes scan-line {
          0%, 100% { top: 8px; }
          50% { top: calc(100% - 8px); }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}