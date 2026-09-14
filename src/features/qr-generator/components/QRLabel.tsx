import { QRCodeSVG } from 'qrcode.react';

interface QRLabelProps {
  locationCode: string;
  rackName: string;
  level: number;
  appUrl: string;
  size?: number;
  showRackName?: boolean;
  showLevel?: boolean;
  showCode?: boolean;
}

export function QRLabel({
  locationCode,
  rackName,
  level,
  appUrl,
  size = 128,
  showRackName = true,
  showLevel = true,
  showCode = true,
}: QRLabelProps) {
  const qrValue = `${appUrl}/scan/${locationCode}`;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white border rounded-lg print-label">
      <div className="text-center mb-2">
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
          Archivo
        </p>
        {showRackName && (
          <p className="text-sm font-semibold text-gray-900">{rackName}</p>
        )}
        {showLevel && (
          <p className="text-sm text-gray-700">Nivel {String(level).padStart(2, '0')}</p>
        )}
      </div>

      <div className="my-3 flex max-w-full justify-center overflow-hidden">
        <QRCodeSVG
          value={qrValue}
          size={size}
          level="H"
          includeMargin
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>

      {showCode && (
        <p className="text-xs font-mono text-gray-600 mt-2">{locationCode}</p>
      )}
    </div>
  );
}