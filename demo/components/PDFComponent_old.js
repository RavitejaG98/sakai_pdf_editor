import { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import { Button } from 'primereact/button';
pdfjs.GlobalWorkerOptions.workerSrc = `cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const PdfViewer = () => {

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
    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await fetch('http://localhost:3001/pdf');  // Replace with your backend endpoint
                const blob = await response.blob();
                console.log('blob',blob)
                // Convert blob to ArrayBuffer
                const arrayBuffer = await new Response(blob).arrayBuffer();
                console.log('blob array',arrayBuffer)
                // Render PDF on canvas
                const loadingTask = pdfjs.getDocument("http://localhost:3001/pdf");
                const pdf = await loadingTask.promise;
                setPdfDocument(pdf);
                

   
            
            } catch (error) {
                console.error('Error fetching or rendering PDF:', error);
            }
        };

        fetchPdf();
    }, []);
    const handleSearch = async () => {
        try {
          const searchResults = [];
          const highlights = [];
    
          for (let pageNum = 1; pageNum <= 1; pageNum++) {
            console.log("pdfDocument",pdfDocument)
            const page = await pdfDocument.getPage(pageNum);
            const textContent = await page.getTextContent();
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
      const loadPdfFromUrl = async () => {
        try {
          const loadingTask = pdfjs.getDocument(pdfUrl);
          const pdf = await loadingTask.promise;
          setPdfDocument(pdf);
          handleSearch();
        } catch (error) {
          console.error('Error loading PDF from URL:', error);
        }
      };
    return  <>
    <Button onClick={loadPdfFromUrl}>Click here</Button>
    <canvas
    id="pdfViewer"
    ref={canvasRef}
   style={{backgroundColor : "red"}}
  />;
    </> 
};

export default PdfViewer;
