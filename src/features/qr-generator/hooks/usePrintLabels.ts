import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export function usePrintLabels(documentTitle = 'Etiquetas-QR') {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  return { printRef, handlePrint };
}