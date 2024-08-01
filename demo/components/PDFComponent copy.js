
import React, { useState, useEffect, useRef } from 'react';

import { saveAs } from 'file-saver';

import axios from 'axios';
import { PDFDocument, rgb } from 'pdf-lib';
import Toast from './Toast';

const PDFComponent = () => {
  const [searchTerm, setSearchTerm] = useState('sample');
  const [results, setResults] = useState([]);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfUrl, setPdfUrl] = useState('http://10.244.3.132:3001/pdf');
  const [pdfUrlLocal, setPdfUrlLocal] = useState(null);
const [notif,setNotif] = useState()
  const [highlightedAreas, setHighlightedAreas] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1.0); // Initial zoom level
  const canvasRef = useRef(null);
  const [zoomToCoordinates, setZoomToCoordinates] = useState(null);
  const [tableCoordinates, setTableCoordinates] = useState(null);
  const [canvasHeight,setCanvasHeight] = useState(null)
  const [modifiedPDFBlobURI,setModifiedPDFBlobURI] = useState(null)
  // Load PDF from URL
  const loadPdfFromUrl = async () => {
    try {
      // const loadingTask = pdfjs.getDocument(pdfUrl);
      // const pdf = await loadingTask.promise;
      const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      setPdfDocument(pdfDoc);
      handleSearch();
    } catch (error) {
      console.error('Error loading PDF from URL:', error);
    }
  };
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const hideToast = () => {
    setIsToastVisible(false);
  };
  const [xCoord, setXCoord] = useState(null); // Initial X coordinate
  const [yCoord, setYCoord] = useState(null); // Initial Y coordinate
  const names = ['CBE/SC', '', 'Dy.CE/BR/D/SC', '', 'AXEN/BR/D/SC', '', 'DRM/BZA', '', 'DEN/SOUTH/BZA', ''];

  const handleXChange = (e) => {
    setXCoord(Number(e.target.value));
  };

  const handleYChange = (e) => {
    setYCoord(Number(e.target.value));
  };

  const drawTableOnPDF = async (pdfBytes, num ,x, y) => {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc?.getPages();
    if(x != null && y != null){

      pages.forEach((page) => {
        const { width, height } = page.getSize();
  
        // Define table dimensions and position based on user input
        const tableWidth = 500;
        const tableHeight = 300;
  
        // Draw table outline
        page.drawRectangle({
          x,
          y : canvasHeight - y,
          width: tableWidth,
          height: tableHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 2,
        });
  
        // Draw table rows and columns
        const numRows = 4;
        const numCols = 2;
        const rowHeight = tableHeight / numRows;
        const colWidth = tableWidth / numCols;
  /////////////////// row lines //////////////////
        for (let i = 0; i < 2; i++) {
          page.drawLine({
            start: { x, y: (canvasHeight - y) + i * rowHeight },
            end: { x: x + tableWidth, y: (canvasHeight - y) + i * rowHeight },
            color: rgb(0, 0, 0),
            thickness: 4,
          });
        }
        for (let i = 2; i < numRows; i++) {
          page.drawLine({
            start: { x, y: (canvasHeight - y) + i * rowHeight },
            end: { x: x + tableWidth, y:(canvasHeight - y)+ i * rowHeight },
            color: rgb(0, 0, 0),
            thickness: 1,
          });
        }
        //////////////// coulmn lines //////////////////
        for (let i = 1; i < numCols; i++) {
          page.drawLine({
            start: { x: x + i * colWidth, y : (canvasHeight - y) },
            end: { x: x + i * colWidth, y: (canvasHeight - y) + tableHeight },
            color: rgb(0, 0, 0),
            thickness: 1,
          });
        }
      });

    
      pages.forEach((page) => {
        const tableWidth = 500;
        const tableHeight = 300;
        // page.drawText('Signature Block', { x: x + 5, y: (canvasHeight - y) + tableHeight - 15, size: 12 });
      const numRows = 4;
      const numCols = 2;
      const rowHeight = tableHeight / numRows;
      const colWidth = tableWidth / numCols;
    // Draw names in the table cells
    let nameIndex = 0;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const cellX = x + col * colWidth;
        const cellY = (canvasHeight - y) + row * rowHeight;

        if (nameIndex < names.length) {
          page.drawText(names[nameIndex], {
            x: cellX + 5, // Adjust for padding
            y: cellY + 5, // Adjust for padding
            size: 12,
            color: rgb(0, 0, 0),
          });
        }

        nameIndex++;
      }
    }
  })
    }
  
   

    const modifiedPdfBytes = await pdfDoc.save();
    const pdfDataUri = await createDataUri(modifiedPdfBytes);
    setModifiedPDFBlobURI(modifiedPdfBytes)
    return pdfDataUri;

    // return modifiedPdfBytes;
  };

  // const downloadPDF = async () => {
  //   try {
  //     const response = await axios.get('https://filebin.net/k0amqvyf8cthizg9/downloaded-with-borders.pdf', {
  //       responseType: 'arraybuffer',
  //     });

  //     const modifiedPdfBytes = await drawTableOnPDF(response.data, xCoord, yCoord);

  //     const pdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

  //     saveAs(pdfBlob, 'downloaded-with-table.pdf');
  //   } catch (error) {
  //     console.error('Error downloading or modifying the PDF:', error);
  //   }
  // };
  // const downloadPDFButton = async () => {
  //   try {


  //     const modifiedPdfBytes = modifiedPDFBlobURI

  //     const pdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

  //     saveAs(pdfBlob, 'downloaded-with-table.pdf');
  //   } catch (error) {
  //     console.error('Error downloading or modifying the PDF:', error);
  //   }
  // };
  const downloadPDFButton = async () => {
    try {
      const response = await fetch(modifiedPDFBlobURI);
      const blob = await response.blob();
  
      saveAs(blob, 'downloaded-with-table.pdf');
    } catch (error) {
      console.error('Error downloading the PDF:', error);
    }
  };
  // Search for keywords in the PDF
  const handleSearch = async () => {
    try {
      const searchResults = [];
      const highlights = [];

      for (let pageNum = 1; pageNum <= 1; pageNum++) {
        const page = await pdfDocument?.getPage(pageNum);
        const textContent = await page?.getTextContent();
        const textItems = textContent.items;

        for (let i = 0; i < textItems.length; i++) {
          const text = textItems[i].str;
          const lowerCaseText = text.toLowerCase();
          const lowerCaseSearchTerm = searchTerm.toLowerCase();

          if (lowerCaseText.includes(lowerCaseSearchTerm)) {
            searchResults.push({
              page: pageNum,
              text: text,
              position: i + 1, // Position of the item within the page
              x: textItems[i].transform[4],
              y: page.view[3] - textItems[i].transform[5] // Adjust for the page coordinates
            });

            const index = lowerCaseText.indexOf(lowerCaseSearchTerm);
            const item = textContent.items[i];
            const transform = item.transform;
            const width = item.width;
            const height = item.height;

            const x = transform[4];
            const y = page.view[3] - transform[5]; // Adjust for the page coordinates
            const rect = {
              x: x,
              y: y - height, // Adjust for the text position
              width: width,
              height: height
            };

            highlights.push({
              page: pageNum,
              rect: rect
            });
          }
        }
      }

      setResults(searchResults);
      setHighlightedAreas(highlights);
      setCurrentPage(1); // Reset to first page after search
    } catch (error) {
      console.error('Error searching PDF:', error);
    }
  };

  // Handle page change
  const handlePageChange = (event) => {
    setCurrentPage(Number(event.target.value));
  };

  // Render PDF on canvas with zoom and highlights
  const renderPdfWithZoomAndHighlights = () => {
    if (pdfDocument) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      pdfDocument?.getPage(currentPage).then((page) => {
        const viewport = page.getViewport({ scale: zoomLevel });

        // Calculate coordinates to center zoom around a specific point
        let centerX, centerY;
        // if (zoomToCoordinates) {
        //   centerX = zoomToCoordinates.x * zoomLevel;
        //   centerY = zoomToCoordinates.y * zoomLevel;
        // } else {
        //   centerX = viewport.width / 2;
        //   centerY = viewport.height / 2;
        // }

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          transform: [zoomLevel, 0, 0, zoomLevel, centerX, centerY]
        };

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        setCanvasHeight(canvas.height)
        page.render(renderContext);

        // Highlight areas with search results
        highlightedAreas.forEach((highlight) => {
          if (highlight.page === currentPage) {
            const { x, y, width, height } = highlight.rect;
            context.beginPath();
            context.rect(x * zoomLevel, y * zoomLevel, width * zoomLevel, height * zoomLevel);
            context.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Yellow with opacity
            context.fill();
          }
        });

    
          const x  = centerX
          const y = centerY
        
        
      });
    }
  };

  // Update rendering when page, zoom level, or highlights change
  useEffect(() => {
    renderPdfWithZoomAndHighlights();
  }, [currentPage, zoomLevel, highlightedAreas, zoomToCoordinates]);
useEffect(()=>{
  loadPDF()
},[
  xCoord
])
useEffect(()=>{
  loadPdfFromUrl()
},[])

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setTableCoordinates({ x: x, y: y });
    setXCoord(Number(x));
    setYCoord(Number(y))

    if (pdfDocument) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      pdfDocument.getPage(currentPage).then((page) => {
        const viewport = page.getViewport({ scale: zoomLevel });

        // Calculate coordinates to center zoom around a specific point
        let centerX, centerY;
        if (zoomToCoordinates) {
          centerX = zoomToCoordinates.x * zoomLevel;
          centerY = zoomToCoordinates.y * zoomLevel;
        } else {
          centerX = viewport.width / 2;
          centerY = viewport.height / 2;
        }

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          transform: [zoomLevel, 0, 0, zoomLevel, centerX, centerY]
        };

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        context.beginPath();
        context.rect(x, canvasHeight-y, 100, 50); // Drawing a rectangle of 100x50 as a table placeholder
        context.strokeStyle = 'blue';
        context.stroke();
    
        // Draw table rows and columns
        context.moveTo(x, y + 25);
        context.lineTo(x + 100, y + 25);
        context.moveTo(x + 50, y);
        context.lineTo(x + 50, y + 50);
        context.strokeStyle = 'blue';
        context.stroke();
        page.render(renderContext);
        
      })

    
    }
    // alert(`Coordinates: X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`);
  
   
    
    
  };
  const createDataUri = (bytes) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  };

  const loadPDF = async () => {
    try {
      const response = await axios.get('http://10.244.3.132:3001/pdf', {
        responseType: 'arraybuffer',
      });

      const pdfDataUri = await drawTableOnPDF(response.data, 1, xCoord, yCoord);
      setPdfUrlLocal(pdfDataUri);
    } catch (error) {
      console.error('Error fetching or modifying the PDF:', error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('click', handleCanvasClick);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('click', handleCanvasClick);
      }
    };
  }, []);
  // Handle zoom change
  const handleZoomChange = (event) => {
    const newZoomLevel = parseFloat(event.target.value);
    setZoomLevel(newZoomLevel);
  };

  // Handle zoom to coordinates
  const handleZoomToCoordinates = (x, y) => {
    setZoomLevel(1.0); // Reset zoom level
    setZoomToCoordinates({ x: x, y: y });
    setXCoord(Number(x));
    setYCoord(Number(y));
    
  };

  return (
    <div className="grid grid-cols-2 w-full h-screen space-x-16">
       <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={hideToast}
      />
  <div > 
<div>
        <button onClick={loadPdfFromUrl} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
          Load PDF
          </button>
</div>
  <div >
    <div >
        <button onClick={loadPDF} className='bg-red-400 p-2'>Load PDF with Table</button>
      {pdfUrlLocal && (
        <div className=' w-full h-screen' >
          <iframe title="PDF Viewer" src={pdfUrlLocal} width={'100%'} height={'100%'} />
        </div>
      )}
        </div>
        <br/>
  
</div>
<button
        onClick={() => showToast('Signature Table has been finalised and drawing succesfully checked in')}
        className="bg-blue-500 text-white p-2 rounded mx-20"
      >
        Finalise Signature Table and check in
      </button>
</div>
  </div>
  );
};

export default PDFComponent;