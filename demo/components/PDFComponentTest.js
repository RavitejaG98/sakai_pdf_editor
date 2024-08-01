import React, { useState, useRef, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { Stage, Layer, Line } from 'react-konva';
import { PDFDocument, rgb } from 'pdf-lib';

const PdfWithSvg = ({ pdfUrl, svgElements }) => {
  const [pdfData, setPdfData] = useState(null);
  const canvasRef = useRef(null);

  const fetchPdf = useCallback(async () => {
    const response = await fetch('https://pdfobject.com/pdf/sample.pdf');
    const pdfBytes = await response.arrayBuffer();
    setPdfData(pdfBytes);
  }, []);

  const drawSvgOnCanvas = useCallback(async () => {
    if (!pdfData) return;

    const pdfDoc = await PDFDocument.load(pdfData);
    const pages = await pdfDoc.getPages();

    // Optionally, you could modify the PDF here, e.g., draw text or images

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
                    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"/>
                 </svg>`;
    const svgData = new Uint8Array(Buffer.from(svg));

    // Draw SVG on PDF page (this is an example; adjust as needed)
    const page = pages[0]
    page.drawSvgPath(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
                    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"/>
                 </svg>`, { borderColor: rgb(0, 1, 0), borderWidth: 5 });

    const pdfBytesWithSvg = await pdfDoc.save();
    // Create a URL for the modified PDF
    const blob = new Blob([pdfBytesWithSvg], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  }, [pdfData]);

  React.useEffect(() => {
    fetchPdf();
  }, [fetchPdf]);

  return (
    <div>
      <button onClick={drawSvgOnCanvas}>Draw SVG on PDF</button>
      <Stage width={window.innerWidth} height={window.innerHeight} ref={canvasRef}>
        <Layer>
          {svgElements?.map((element, index) => (
            <Line
              key={index}
              points={element.points}
              stroke={element.stroke}
              strokeWidth={element.strokeWidth}
              tension={element.tension}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default PdfWithSvg;
