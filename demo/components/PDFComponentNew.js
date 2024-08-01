import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Text, Transformer } from 'react-konva';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';
import 'pdfjs-dist/build/pdf.worker.entry';

const useTransformer = () => {
  const [selectedId, selectShape] = useState(null);

  return {
    selectedId,
    selectShape,
    TransformerComponent: ({ children }) => {
      const isSelected = selectedId !== null;

      return (
        <>
          {children}
          {isSelected && (
            <Transformer
              ref={(node) => {
                if (node) {
                  const selectedNode = node.getLayer().findOne(`#${selectedId}`);
                  node.nodes([selectedNode]);
                  node.getLayer().batchDraw();
                }
              }}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </>
      );
    },
  };
};

const DrawingCanvas = () => {
  const [lines, setLines] = useState([]);
  const [texts, setTexts] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [textContent, setTextContent] = useState('');
  const [textProps, setTextProps] = useState({ color: '#000000', fontSize: 20, x: 0, y: 0 });
  const [pdfUrl, setPdfUrl] = useState('http://10.244.3.132:3001/pdf'); // URL to your PDF
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  const { selectedId, selectShape, TransformerComponent } = useTransformer();

  useEffect(() => {
    setIsClient(true);
    if (pdfUrl) {
      loadPDF(pdfUrl);
    }
  }, [pdfUrl]);

  useEffect(() => {
    // Configure pdfjs-dist worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

  const loadPDF = async (url) => {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1); // Render first page
    const viewport = page.getViewport({ scale: 1 });
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  };

  const handleMouseDown = (e) => {
    if (isDrawing) return;

    const stage = stageRef.current.getStage();
    const { x, y } = stage.getPointerPosition();
    setLines([...lines, { points: [x, y], color: brushColor, size: brushSize }]);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const stage = stageRef.current.getStage();
    const { x, y } = stage.getPointerPosition();
    const newLines = lines.slice();
    const lastLine = newLines[newLines.length - 1];
    lastLine.points = lastLine.points.concat([x, y]);
    newLines.splice(newLines.length - 1, 1, lastLine);
    setLines(newLines);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSelect = (id) => {
    selectShape(id);
  };

  const handleAddText = () => {
    setTexts([...texts, { text: textContent, ...textProps }]);
    setTextContent('');
  };

  const handleTextChange = (e) => {
    setTextContent(e.target.value);
  };

  const handleTextPosition = (e) => {
    const stage = stageRef.current.getStage();
    const { x, y } = stage.getPointerPosition();
    setTextProps((prevProps) => ({ ...prevProps, x, y }));
  };

  const clearCanvas = () => {
    setLines([]);
    setTexts([]);
    selectShape(null);
  };

  const saveDrawingAsSVG = () => {
    if (stageRef.current) {
      const stage = stageRef.current.getStage();
      const svgContent = [
        ...lines.map((line) => {
          const points = line.points.reduce((acc, point, index) => {
            if (index % 2 === 0) acc.push(`${point},`);
            else acc[acc.length - 1] += `${point} `;
            return acc;
          }, []).join(' ');

          return `<polyline points="${points.trim()}" style="fill:none;stroke:${line.color};stroke-width:${line.size}px;" />`;
        }),
        ...texts.map((text) => {
          return `<text x="${text.x}" y="${text.y}" fill="${text.color}" font-size="${text.fontSize}">${text.text}</text>`;
        }),
      ].join('\n');

      const svgString = `
        <svg width="${stage.width()}" height="${stage.height()}" xmlns="http://www.w3.org/2000/svg">
          ${svgContent}
        </svg>
      `;

      const link = document.createElement('a');
      link.download = 'drawing.svg';
      link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
      link.click();
    }
  };

  function polylineToPath(svgString) {
    // Create a new DOM parser
    const parser = new DOMParser();
    // Parse the SVG string into a document
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    // Select the polyline element
    const polyline = svgDoc.querySelector('polyline');

    if (!polyline) {
        throw new Error('No polyline element found in the SVG string.');
    }

    const points = polyline.getAttribute('points');
    const strokeWidth = polyline.getAttribute('stroke-width') || '1'; // Default to 1 if not set
    const pointPairs = points.trim().split(/\s+/);
    let pathString = 'M';

    for (let i = 0; i < pointPairs.length; i += 2) {
        const x = pointPairs[i];
        const y = pointPairs[i + 1];

        if (i > 0) {
            pathString += ' L';
        }
        pathString += `${x},${y}`;
    }

    // Create a style string to apply stroke width
    const styleString = `stroke-width: ${strokeWidth};`;

    return { pathString, styleString };
}

async function embedSvgInPdf(svgString) {
  // Create a new PDFDocument
  const response = await fetch('http://10.244.3.132:3001/pdf');
  const pdfBlob = await response.blob();

console.log("svg string",svgString, )
  // Convert blob to ArrayBuffer
  const svgPathfromString = polylineToPath(svgString)
  const arrayBuffer = await pdfBlob.arrayBuffer();
  
  // Load the PDF with pdf-lib
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // Perform modifications
  const pages = pdfDoc.getPages();
  const page = pages[0];
  
  
  // Create a canvas to draw the SVG
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Set canvas dimensions based on the SVG
  const svgWidth = 600; // Example width, adjust based on your SVG
  const svgHeight = 400; // Example height, adjust based on your SVG
  canvas.width = svgWidth;
  canvas.height = svgHeight;
  
  // Set the SVG content
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  // Draw the SVG on the canvas
  const img = new Image();
  img.src = svgUrl;
  await new Promise((resolve) => (img.onload = resolve));
  context.drawImage(img, 0, 0);

  // Convert the canvas to PNG
  const pngDataUrl = canvas.toDataURL('image/png');
  const pngData = pngDataUrl.split(',')[1];
  
  // Embed PNG in PDF
  const pngImageBytes = Uint8Array.from(atob(pngData), c => c.charCodeAt(0));
  const pngImage = await pdfDoc.embedPng(pngImageBytes);
  
  // Draw the image on the page
  const { width, height } = pngImage;
  const positionX = 50;
const positionY = 720;

  page.drawSvgPath(svgPathfromString.pathString, {
    x: positionX,
    y: positionY,
    borderWidth: 10
  });
   // Draw lines
   lines.forEach((line) => {
    const { points, color, size } = line;

    // Ensure points are valid
    if (points.length < 4) return; // Ensure at least two points for a valid line

    // Convert points to SVG path string
    const path = points.reduce((acc, point, index) => {
      // Skip invalid points
      if (isNaN(point)) return acc;
      
      // Construct path commands
      if (index % 2 === 0) {
        // X coordinate
        if (index === 0) {
          acc += `M ${point}`;
        } else {
          acc += ` L ${point}`;
        }
      } else {
        // Y coordinate
        if (index % 2 === 1) {
          acc += ` ${point}`;
        }
      }
      return acc;
    }, '');

    // Ensure path string is valid
    if (path && path.startsWith('M')) {
      console.log('SVG Path:', path); // Debugging: print the path string

      // Draw path if valid
      page.drawSvgPath(path);
    }
  });

  // Add texts
  texts.forEach((text) => {
    page.drawText(text.text, {
      x: text.x,
      y: page.getHeight() - text.y, // Invert y-axis for PDF coordinate system
      size: text.fontSize,
      color: rgb(...hexToRgb(text.color)),
    });
  });
  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();
  
  // Create a download link for the PDF
  const link = document.createElement('a');
  link.download = 'drawing.pdf';
  link.href = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
  link.click();
}
const savePDFwithSVG= () => {
  if (stageRef.current) {
    const stage = stageRef.current.getStage();
    const svgContent = [
      ...lines.map((line) => {
        const points = line.points.reduce((acc, point, index) => {
          if (index % 2 === 0) acc.push(`${point},`);
          else acc[acc.length - 1] += `${point} `;
          return acc;
        }, []).join(' ');
  
        return `<polyline points="${points.trim()}" style="fill:none;stroke:${line.color};stroke-width:${line.size}px;" />`;
      }),
      ...texts.map((text) => {
        return `<text x="${text.x}" y="${text.y}" fill="${text.color}" font-size="${text.fontSize}">${text.text}</text>`;
      }),
    ].join('\n');
  
    const svgString = `
      <svg width="${stage.width()}" height="${stage.height()}" xmlns="http://www.w3.org/2000/svg">
        ${svgContent}
      </svg>
    `;
  
    embedSvgInPdf(svgString);
  }
}
// Example usage with your SVG string


  const downloadPDFWithAnnotations = async () => {
    if (!pdfUrl) return;
  
    // Load the original PDF
    const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
  
    // Assume only one page for simplicity; modify if working with multiple pages
    const pages = pdfDoc.getPages();
    const page = pages[0]; // Get the first page
  
    // Draw lines
    lines.forEach((line) => {
      const { points, color, size } = line;
  
      // Ensure points are valid
      if (points.length < 4) return; // Ensure at least two points for a valid line
  
      // Convert points to SVG path string
      const path = points.reduce((acc, point, index) => {
        // Skip invalid points
        if (isNaN(point)) return acc;
        
        // Construct path commands
        if (index % 2 === 0) {
          // X coordinate
          if (index === 0) {
            acc += `M ${point}`;
          } else {
            acc += ` L ${point}`;
          }
        } else {
          // Y coordinate
          if (index % 2 === 1) {
            acc += ` ${point}`;
          }
        }
        return acc;
      }, '');
  
      // Ensure path string is valid
      if (path && path.startsWith('M')) {
        console.log('SVG Path:', path); // Debugging: print the path string
  
        // Draw path if valid
        page.drawSvgPath(path);
      }
    });
  
    // Add texts
    texts.forEach((text) => {
      page.drawText(text.text, {
        x: text.x,
        y: page.getHeight() - text.y, // Invert y-axis for PDF coordinate system
        size: text.fontSize,
        color: rgb(...hexToRgb(text.color)),
      });
    });
  
    // Serialize the PDFDocument to bytes
    const pdfWithAnnotations = await pdfDoc.save();
  
    // Download the annotated PDF
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([pdfWithAnnotations], { type: 'application/pdf' }));
    link.download = 'annotated.pdf';
    link.click();
  };
  
  
  const hexToRgb = (hex) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return [r / 255, g / 255, b / 255];
  };

  if (!isClient) {
    return null;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>PDF Viewer with Drawing & Text</h2>
      <div>
        <label>
          Brush Color:
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: '20px' }}>
          Brush Size:
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
          />
        </label>
        <label style={{ marginLeft: '20px' }}>
          Text Content:
          <input
            type="text"
            value={textContent}
            onChange={handleTextChange}
            onFocus={handleTextPosition}
          />
        </label>
        <label style={{ marginLeft: '20px' }}>
          Text Color:
          <input
            type="color"
            value={textProps.color}
            onChange={(e) => setTextProps({ ...textProps, color: e.target.value })}
          />
        </label>
        <label style={{ marginLeft: '20px' }}>
          Text Size:
          <input
            type="number"
            min="1"
            value={textProps.fontSize}
            onChange={(e) => setTextProps({ ...textProps, fontSize: parseInt(e.target.value) })}
          />
        </label>
        <button
          onClick={handleAddText}
          style={{ marginLeft: '20px', padding: '5px 15px', cursor: 'pointer' }}
        >
          Add Text
        </button>
        <button
          onClick={clearCanvas}
          style={{ marginLeft: '20px', padding: '5px 15px', cursor: 'pointer' }}
        >
          Clear Canvas
        </button>
        <button
          onClick={saveDrawingAsSVG}
          style={{ marginLeft: '10px', padding: '5px 15px', cursor: 'pointer' }}
        >
          Save as SVG
        </button>
        <button
          onClick={downloadPDFWithAnnotations}
          style={{ marginLeft: '10px', padding: '5px 15px', cursor: 'pointer' }}
        >
          Download PDF
        </button>
        <button
          onClick={savePDFwithSVG}
          style={{ marginLeft: '10px', padding: '5px 15px', cursor: 'pointer' }}
        >
          Save PDF with SVG
        </button>
      </div>
      <div style={{ position: 'relative', marginTop: '10px' }}>
        <canvas ref={canvasRef} style={{ zIndex : -1, position : 'absolute', left : 0}} />
        <Stage
          width={window.innerWidth * 0.8}
          height={window.innerHeight * 0.8}
          style={{ border: '2px solid #000', zIndex : 2, position : 'absolute' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={stageRef}
        >
          <Layer>
            {lines.map((line, index) => (
              <Line
                key={index}
                id={`line-${index}`}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.size}
                lineCap="round"
                lineJoin="round"
                draggable
                onClick={() => handleSelect(`line-${index}`)}
                onTap={() => handleSelect(`line-${index}`)}
                onDragEnd={(e) => {
                  const newLines = lines.slice();
                  const updatedLine = newLines[index];
                  updatedLine.points = e.target.points();
                  newLines.splice(index, 1, updatedLine);
                  setLines(newLines);
                }}
              />
            ))}
            {texts.map((text, index) => (
              <Text
                key={index}
                id={`text-${index}`}
                text={text.text}
                x={text.x}
                y={text.y}
                fill={text.color}
                fontSize={text.fontSize}
                draggable
                onClick={() => handleSelect(`text-${index}`)}
                onTap={() => handleSelect(`text-${index}`)}
                onDragEnd={(e) => {
                  const newTexts = texts.slice();
                  const updatedText = newTexts[index];
                  updatedText.x = e.target.x();
                  updatedText.y = e.target.y();
                  newTexts.splice(index, 1, updatedText);
                  setTexts(newTexts);
                }}
              />
            ))}
            <TransformerComponent>
              <Line
                key="transformer"
                id={selectedId}
                stroke="transparent"
              />
              <Text
                key="text-transformer"
                id={selectedId}
                fill="transparent"
              />
            </TransformerComponent>
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default DrawingCanvas;
