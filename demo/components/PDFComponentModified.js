import React, { useState, useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import { saveAs } from 'file-saver';
// Import Tailwind CSS directly (you might need to adjust the path based on your setup)
import { Slider } from 'primereact/slider';

import axios from 'axios';
import { PDFDocument, rgb } from 'pdf-lib';
import Toast from './Toast';
import { Button } from 'primereact/button';
import Draggable from 'react-draggable';
pdfjs.GlobalWorkerOptions.workerSrc = `cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const App = () => {
    const [searchTerm, setSearchTerm] = useState('sample');
    const [results, setResults] = useState([]);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pdfUrl, setPdfUrl] = useState('http://10.244.3.132:3001/pdf');
    const [pdfUrlLocal, setPdfUrlLocal] = useState(null);
    const [notif, setNotif] = useState()
    const [highlightedAreas, setHighlightedAreas] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1.0); // Initial zoom level
    const canvasRef = useRef(null);
    const [zoomToCoordinates, setZoomToCoordinates] = useState(null);
    const [tableCoordinates, setTableCoordinates] = useState(null);
    const [canvasHeight, setCanvasHeight] = useState(null)
    const [modifiedPDFBlobURI, setModifiedPDFBlobURI] = useState(null)
    const [panOffsetX, setPanOffsetX] = useState(0);
    const [panOffsetY, setPanOffsetY] = useState(0);
    const [pdfURIModified, setpdfURIModified] = useState('')
    const [diagramType, setDiagramType] = useState('table');
    const [binData, setBinData] = useState()
    const [resizableStyle, setResizableStyle] = useState({ display: 'none' });
    const [once, setOnce] = useState(null)
    const [isDraggable,setDraggable] = useState(false)
    const toast = useRef(null);
    const [eventCo,setEventCo ] = useState();
    const [ tempPDF, setTempPDF ] = useState(null)
    const [drags,setDrags] = useState(null)
    // Load PDF from URL
    const loadPdfFromUrl = async (bloburl) => {
        try {
            //console.log("modifiedPDFBlobURI", modifiedPDFBlobURI, "bloburl", bloburl)
            let pdf
            if (bloburl !== null) {
                const arrayBuffer = bloburl.buffer;
                //console.log("array buffer", arrayBuffer)
                pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            } else {
                const loadingTask = pdfjs.getDocument(pdfUrl);
                pdf = await loadingTask.promise;
            }

            setPdfDocument(pdf);
            setHighlightedAreas(!highlightedAreas)
            //   handleSearch();
        } catch (error) {
            //console.error('Error loading PDF from URL:', error);
        }
    };
    const resizableRef = useRef(null);
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [previousDimensions, setPreviousDimensions] = useState({ width: 100, height: 100 }); // Initial dimensions
    const [previousRatio, setRatio] = useState({ width: 1, height: 1 }); // Initial dimensions

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
    const handlePageChange = (event) => {
        setCurrentPage(Number(event.target.value));
    };
    const handleZoomChange = (event) => {
        const newZoomLevel = parseFloat(event.target.value);
        setZoomLevel(newZoomLevel);
        setHighlightedAreas(!highlightedAreas)
    };
    const handlePanInputChange = (event) => {
        const { name, value } = event;
        if (name === 'panXPercent') {
            // Calculate new panOffsetX based on percentage of canvas width
            const canvasWidth = canvasRef.current.width / zoomLevel;
            const newOffsetX = (parseFloat(value) / 100) * canvasWidth;
            setPanOffsetX(newOffsetX);
        } else if (name === 'panYPercent') {
            // Calculate new panOffsetY based on percentage of canvas height
            const canvasHeight = canvasRef.current.height / zoomLevel;
            const newOffsetY = (parseFloat(value) / 100) * canvasHeight;
            setPanOffsetY(newOffsetY);
        }
        setHighlightedAreas(!highlightedAreas)
    };
    const drawTableOnPDF = async (pdfBytes, num, x, y) => {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        if (x != null && y != null) {
            if (diagramType == 'table') {
                pages.forEach((page) => {
                    const { width, height } = page.getSize();

                    // Define table dimensions and position based on user input
                    const tableWidth = previousDimensions.width;
                    const tableHeight = previousDimensions.height;

                    // Draw table outline
                    //console.log("table is drawn")
                    page.drawRectangle({
                        x,
                        y: canvasHeight - (y + previousDimensions.height),
                        width: tableWidth,
                        height: tableHeight,
                        borderColor: rgb(0, 0, 0),
                        borderWidth: 2,
                    });

                    // Draw table rows and columns
                    const numRows = 4;
                    const numCols = 2;
                    const rowHeight = (tableHeight / numRows) * (previousRatio.height / 4);
                    const colWidth = (tableWidth / numCols) * (previousRatio.width / 4);
                    /////////////////// row lines //////////////////
                    for (let i = 0; i < 2; i++) {
                        page.drawLine({
                            start: { x, y: (canvasHeight - (y + previousDimensions.height)) + i * rowHeight },
                            end: { x: x + tableWidth, y: (canvasHeight - (y + previousDimensions.height)) + i * rowHeight },
                            color: rgb(0, 0, 0),
                            thickness: 4,
                        });
                    }
                    for (let i = 2; i < numRows; i++) {
                        page.drawLine({
                            start: { x, y: (canvasHeight - (y + previousDimensions.height)) + i * rowHeight },
                            end: { x: x + tableWidth, y: (canvasHeight - (y + previousDimensions.height)) + i * rowHeight },
                            color: rgb(0, 0, 0),
                            thickness: 1,
                        });
                    }
                    //////////////// coulmn lines //////////////////
                    for (let i = 1; i < numCols; i++) {
                        page.drawLine({
                            start: { x: x + i * colWidth, y: (canvasHeight - (y + previousDimensions.height)) },
                            end: { x: x + i * colWidth, y: (canvasHeight - (y + previousDimensions.height)) + tableHeight },
                            color: rgb(0, 0, 0),
                            thickness: 1,
                        });
                    }
                });

                pages.forEach((page) => {
                    const tableWidth = 100 * (previousRatio.width / 4);
                    const tableHeight = 200 * (previousRatio.height / 4);
                    // page.drawText('Signature Block', { x: x + 5, y: (canvasHeight - (y + previousDimensions.height)) + tableHeight - 15, size: 12 / zoomLevel });
                    const numRows = 4;
                    const numCols = 2;
                    const rowHeight = tableHeight / numRows;
                    const colWidth = tableWidth / numCols;
                    // Draw names in the table cells
                    let nameIndex = 0;
                    for (let row = 0; row < numRows; row++) {
                        for (let col = 0; col < numCols; col++) {
                            const cellX = x + col * colWidth;
                            const cellY = (canvasHeight - (y + previousDimensions.height)) + row * rowHeight;

                            if (nameIndex < names.length) {
                                page.drawText(names[nameIndex], {
                                    x: cellX + 5, // Adjust for padding
                                    y: cellY + 5, // Adjust for padding
                                    size: 12 / zoomLevel,
                                    color: rgb(0, 0, 0),
                                });
                            }

                            nameIndex++;
                        }
                    }
                })
            }
            if (diagramType == 'circle') {
                pages.forEach((page) => {
                    page.drawEllipse({
                        x, // X-coordinate of the circle's center
                        y: canvasHeight - (y + previousDimensions.height), // Y-coordinate of the circle's center
                        xScale: 50 * (previousRatio.height / 4), // Radius of the circle in the x-direction
                        yScale: 50 * (previousRatio.height / 4), // Radius of the circle in the y-direction
                        borderColor: rgb(1, 0, 0), // Yellow color for the border
                        borderWidth: 4, // Width of the border
                    });

                    //console.log('drawing cicle')
                })
            }
            if (diagramType == 'text') {
                pages.forEach((page) => {
                    page.drawText('Your Text Here', {
                        x, // X-coordinate for the text
                        y: canvasHeight - y, // Y-coordinate for the text
                        size: 24, // Font size
                        color: rgb(0, 0, 0), // Fill color (black in this case)
                        borderColor: rgb(1, 1, 0), // Yellow outline color
                        borderWidth: 2, // Outline width
                    });
                })

            }

        }



        const modifiedPdfBytes = await pdfDoc.save();
        const pdfDataUri = await createDataUri(modifiedPdfBytes);
        setModifiedPDFBlobURI(modifiedPdfBytes)
        setBinData(modifiedPdfBytes)
        //console.log("pdfDoc", pdfDoc, "pdfDataUri", pdfDataUri, "modifiedbytes", modifiedPdfBytes)
        setpdfURIModified(pdfDataUri)
        loadPdfFromUrl(modifiedPdfBytes)
        return pdfDataUri;

        // return modifiedPdfBytes;
    };



    const renderPdf = () => {
        if (pdfDocument) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            pdfDocument.getPage(currentPage).then(async(page) => {
                const viewport = page.getViewport({ scale: zoomLevel });
                let centerX, centerY;
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                    transform: [zoomLevel, 0, 0, zoomLevel, panOffsetX, panOffsetY]
                };

                // canvas.width = viewport.width;
                // canvas.height = viewport.height;
                canvas.width = viewport.width / zoomLevel;
                canvas.height = viewport.height / zoomLevel;
                context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before rendering
                await page.render(renderContext).promise;

                setCanvasHeight(viewport.height)


            });
        }
    };

    const handleUploadBlob = async (blob) => {
        const file = new File([blob], 'originalFile.pdf', { type: 'application/pdf' });

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://10.244.3.132:3001/pdf', {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                //console.log('File uploaded and replaced successfully');
            } else {
                //console.error('Failed to upload file');
            }
        } catch (error) {
            //console.error('Error uploading file:', error);
        }
    };
    const handleUploadUint8Array = async () => {
        const blob = new Blob([binData], { type: 'application/pdf' });
        await handleUploadBlob(blob);
    };
    useEffect(() => {
        if(!drags){
            renderPdf();
            console.log("drag stopped")
        }
    }, [highlightedAreas,drags]);
    useEffect(() => {
        loadPDF()
    }, [
        xCoord, yCoord
    ])
    useEffect(() => {
        loadPdfFromUrl(null)
    }, [])

    const handleCanvasClick = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if(!isDraggable){
            setResizableStyle({
                display: 'block',
                left: `${event.clientX}px`,
                top: `${event.clientY + canvasHeight}px`,
            });
        setEventCo({x : event.clientX ,y : event.clientY})
        setXCoord(Number(x + panOffsetX));
        setYCoord(Number(y + panOffsetY));
        // setHighlightedAreas(!highlightedAreas);
        }
       
        setOnce((prev) => prev + 1);
    };



    const createDataUri = (bytes) => {
        const blob = new Blob([bytes], { type: 'application/pdf' });
        return URL.createObjectURL(blob);
    };
    const sendBlobToBackend = async (url) => {
        try {

            const response = await fetch(url);
            const blob = await response.blob();


            const formData = new FormData();
            formData.append('file', blob, 'filename.png');


            await axios.post('http://10.244.3.132:3001/pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            //console.log('Blob sent to backend successfully!');
        } catch (error) {
            //console.error('Error sending blob to backend:', error);
        }
    };
    const loadPDF = async () => {
        try {
            if (!isDraggable) {
                const response = await axios.get('http://10.244.3.132:3001/pdf', {
                    responseType: 'arraybuffer',
                });
                const pdfDataUri = await drawTableOnPDF(response.data, 1, xCoord, yCoord);
                setPdfUrlLocal(pdfDataUri);
                setTempPDF(response.data)
            }
            const pdfDataUri = await drawTableOnPDF(tempPDF, 1, xCoord, yCoord);
                setPdfUrlLocal(pdfDataUri);

        } catch (error) {
            //console.error('Error fetching or modifying the PDF:', error);
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


    useEffect(() => {
        const resizableElement = resizableRef.current;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                const widthRatio = (width / previousDimensions.width)*zoomLevel;
                const heightRatio = (height / previousDimensions.height)*zoomLevel;
                setRatio({ width: widthRatio, height: heightRatio });
                setPreviousDimensions({ width : width * zoomLevel, height : height * zoomLevel});
               
            }
        });

        if (resizableElement) {
            resizeObserver.observe(resizableElement);
        }

        return () => {
            if (resizableElement) {
                resizeObserver.unobserve(resizableElement);

            }
           
        };

        
    }, []);

    function downloadPDF() {
        const url = 'http://10.244.3.132:3001/pdf'; // Replace with your PDF endpoint
      
        // Use Axios to fetch the PDF from the endpoint
        axios({
          url: url,
          method: 'GET',
          responseType: 'blob', // Important for handling binary data
        })
          .then((response) => {
            // Create a URL for the blob data
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const blobURL = URL.createObjectURL(blob);
      
            // Create a temporary <a> element to trigger download
            const link = document.createElement('a');
            link.href = blobURL;
            link.setAttribute('download', 'file.pdf'); // Specify the default file name
      
            // Append to the body and trigger the download
            document.body.appendChild(link);
            link.click();
      
            // Clean up and remove the <a> element
            link.parentNode.removeChild(link);
            URL.revokeObjectURL(blobURL); // Revoke the object URL after download
          })
          .catch((error) => {
            console.error('Error downloading the PDF:', error);
          });
      }

      const accept = () => {
        toast?.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '80vw',
    };

    const gridContainerStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        flexGrow: 1,
    };

    const gridItemStyle = {
        border: '1px solid #ccc',
        padding: '20px',
        boxSizing: 'border-box',
    };

    const resizableStyles = {
        position: 'absolute',
        border: '2px solid red',
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        resize: 'both',
        overflow: 'auto',
        width: '100px',
        height: '100px',
        boxSizing: 'border-box',
    };
    const buttonStyle = {
        position: 'absolute',
        backgroundColor: 'lightblue',
        border: '1px solid blue',
        padding: '5px',
        cursor: 'pointer',
    };

    const verticalButtonStyle = {
        ...buttonStyle,
        top: '50%',
        left: '100%',
        transform: 'translateY(-50%)',
    };

    const horizontalButtonStyle = {
        ...buttonStyle,
        left: '50%',
        top: '100%',
        transform: 'translateX(-50%)',
    };

    return (
<>
<Toast ref={toast} />

        <div style={containerStyle}>
            <div style={gridContainerStyle}>
                <div style={gridItemStyle}>
                    <div className="min-w-96"> <div>

                        <Button onClick={loadPdfFromUrl} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
                            Load PDF
                        </Button >
                        <Button icon="pi pi-table" className=" font-bold py-1 px-4 rounded" style={{ color: diagramType == 'table' ? 'white' : 'black', backgroundColor: diagramType == 'table' ? 'grey' : 'white' }} onClick={() => {
                            if (diagramType == 'table') {
                                setDiagramType('')
                            } else {
                                setDiagramType('table')
                            }
                        }} />
                        <Button icon="pi pi-circle" className=" font-bold py-1 px-4 rounded" style={{ color: diagramType == 'circle' ? 'white' : 'black', backgroundColor: diagramType == 'circle' ? 'grey' : 'white' }} onClick={() => {
                            if (diagramType == 'circle') {
                                setDiagramType('')
                            } else {
                                setDiagramType('circle')
                            }
                        }} />

                        <Button icon="pi pi-comment" className=" font-bold py-1 px-4 rounded" style={{ color: diagramType == 'text' ? 'white' : 'black', backgroundColor: diagramType == 'text' ? 'grey' : 'white' }} onClick={() => {
                            if (diagramType == 'text') {
                                setDiagramType('')
                            } else {
                                setDiagramType('text')
                            }
                        }} />
                         <Button icon="pi pi-hashtag" className=" font-bold py-1 px-4 rounded" style={{ color: isDraggable ? 'white' : 'black', backgroundColor: isDraggable ? 'grey' : 'white' }} onClick={() => { setDraggable(!isDraggable)}} />
                        <Button icon="pi pi-search-plus" className="  font-bold py-1 px-4 rounded" style={{ color: diagramType == 'zoomIn' ? 'white' : 'black', backgroundColor: diagramType == 'zoomIn' ? 'grey' : 'white' }} onClick={() => setDiagramType('zoomIn')} />
                        <Button icon="pi pi-search-minus" className=" font-bold py-1 px-4 rounded" style={{ color: diagramType == 'zoomOut' ? 'white' : 'black', backgroundColor: diagramType == 'zoomOut' ? 'grey' : 'white' }} onClick={() => setDiagramType('zoomOut')} />
                        <Button icon="pi pi-undo" className=" font-bold py-1 px-4 rounded" onClick={()=>{console.log('undo')}} />
                        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" icon="pi pi-save" onClick={() => {sendBlobToBackend(pdfUrlLocal); accept()}} />
                        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" icon="pi pi-download" onClick={() => downloadPDF()} />
                    </div>
                    <div>

                    <canvas
                            id="pdfViewer"
                            ref={canvasRef}
                            style={{ backgroundColor: 'lightred' }}

                        />
                        {diagramType !== '' && 
        //                  <Draggable
        //                  axis="both"
                   
        //   onStart={(e, data) => console.log('Drag Start:', data)}
        //   onDrag={(e, data) => { 
        //     // console.log("Event Co",eventCo)
        //     const canvas = canvasRef.current;
        // const rect = canvas.getBoundingClientRect();
        // const x = e.clientX - rect.left;
        // const y = e.clientY - rect.top;
        //     console.log("rect top", rect.top,"data.y", data.y)
        //     setXCoord(x)
        //     setYCoord(y)
        //     setDrags(true);
        //     console.log('Dragging:', data); }}
        //   onStop={(e, data) => { 
        //     // console.log('Drag Stop:', data);
        //     console.log("event", e)
        //     setDrags(false)
        //     setHighlightedAreas(!highlightedAreas)
        //  }}
        //   disabled = {!isDraggable}
        //                  >
                            <div
                            className="resizable"
                            ref={resizableRef}
                            style={{ ...resizableStyles, ...resizableStyle }}
                        >
                        </div>
                            // </Draggable>
                            
                            }
                    </div>
                      

                    </div>
                    <div>

                        <div>
                            X Coordinate: <input type="number" value={xCoord} onChange={handleXChange} />
                        </div>
                        <div>
                            Y Coordinate: <input type="number" value={yCoord} onChange={handleYChange} />
                        </div>
                        <div >
                            <label htmlFor="panXPercent">Pan X (%):</label>
                            <hr />

                            <Slider value={(panOffsetX / (canvasRef.current?.width)) * 100} onChange={(e) => handlePanInputChange({ name: "panXPercent", value: e.value })} min={-100}
                                max={100} />
                            <hr />
                            <label htmlFor="panYPercent">Pan Y (%):</label>
                            <hr />
                            <Slider value={(panOffsetY / (canvasRef.current?.height)) * 100} onChange={(e) => handlePanInputChange({ name: "panYPercent", value: e.value })} min={-100}
                                max={100} />
                        </div>

                    </div>
                    <div className="mt-4">
                        <label className="mr-2">Go to page:</label>
                        <input
                            type="number"
                            value={currentPage}
                            onChange={handlePageChange}
                            min={1}
                            max={pdfDocument ? pdfDocument.numPages : 1}
                            className="border border-gray-400 rounded px-2 py-1 mr-2"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="mr-2">Zoom level:</label>
                        <input
                            type="number"
                            value={zoomLevel}
                            onChange={handleZoomChange}
                            step={0.1}
                            min={0.1}
                            max={5.0}
                            className="border border-gray-400 rounded px-2 py-1 mr-2"
                        />
                    </div>
                    

                </div>
               

            </div>
            <div className="grid grid-cols-2 w-full h-screen space-x-16">
                <Toast
                    message={toastMessage}
                    isVisible={isToastVisible}
                    onClose={hideToast}
                />

            </div>
        </div>
        </>


    );
};

export default App;