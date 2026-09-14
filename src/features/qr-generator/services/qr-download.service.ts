import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Descarga un elemento HTML como imagen PNG.
 */
export async function downloadElementAsPng(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 3,
  });

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Descarga un SVG como archivo .svg.
 */
export function downloadSvg(svgElement: SVGElement, filename: string): void {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgElement);
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.svg`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Genera un PDF con múltiples etiquetas QR.
 */
export async function generateLabelsPdf(
  container: HTMLElement,
  filename = 'etiquetas-qr'
): Promise<void> {
  const canvas = await html2canvas(container, {
    backgroundColor: '#ffffff',
    scale: 2,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pageWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let position = 0;
  let remainingHeight = imgHeight;

  while (remainingHeight > 0) {
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    remainingHeight -= pageHeight;
    if (remainingHeight > 0) {
      pdf.addPage();
      position = -imgHeight + (imgHeight - remainingHeight);
    }
  }

  pdf.save(`${filename}.pdf`);
}