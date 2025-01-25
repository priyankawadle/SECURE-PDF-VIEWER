
// import React, { useState, useEffect } from 'react';
// import { Viewer } from '@react-pdf-viewer/core';
// import { GlobalWorkerOptions } from 'pdfjs-dist';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';


// // Set the worker source to the correct version on CDN
// GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.15.349/pdf.worker.min.js`;

// // const PDFViewer = () => {
// //   const [pdfFiles, setPdfFiles] = useState([]);
// //   const [selectedPDF, setSelectedPDF] = useState('');

// //   useEffect(() => {
// //     fetch('http://localhost:5000/api/pdfs')
// //       .then((response) => response.json())
// //       .then((files) => setPdfFiles(files))
// //       .catch((error) => console.error('Error fetching PDFs:', error));
// //   }, []);


// //   useEffect(() => {
// //     // Disable right-click when viewing PDFs
// //     const handleContextMenu = (event) => {
// //       event.preventDefault();
// //     };

// //     document.addEventListener('contextmenu', handleContextMenu);

// //     // Cleanup the event listener when the component unmounts
// //     return () => {
// //       document.removeEventListener('contextmenu', handleContextMenu);
// //     };
// //   }, []);

// //   return (
// //     <div>
// //       <select onChange={(e) => setSelectedPDF(e.target.value)} value={selectedPDF}>
// //         <option value="">Select a PDF</option>
// //         {pdfFiles.map((file) => (
// //           <option key={file} value={file}>
// //             {file}
// //           </option>
// //         ))}
// //       </select>
// //       {selectedPDF && (
// //         <div style={{ border: '1px solid black', height: '500px', marginTop: '20px' }}>
// //           <Viewer fileUrl={`http://localhost:5000/pdfs/${selectedPDF}`} />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default PDFViewer;


// const PDFViewer = () => {
//   const [pdfFiles, setPdfFiles] = useState([]);
//   const [selectedPDF, setSelectedPDF] = useState('');

//   useEffect(() => {
//     fetch('http://localhost:5000/api/pdfs')
//       .then((response) => response.json())
//       .then((files) => setPdfFiles(files))
//       .catch((error) => console.error('Error fetching PDFs:', error));
//   }, []);

//   useEffect(() => {
//     // Disable right-click
//     const handleContextMenu = (event) => {
//       event.preventDefault();
//     };
//     document.addEventListener('contextmenu', handleContextMenu);

//     // Disable screenshot keys
//     const handleKeyDown = (event) => {
//       if (
//         event.key === 'PrintScreen' || // PrntScr
//         (event.ctrlKey && event.key === 'PrintScreen') || // Ctrl + PrntScr
//         (event.key === 'Meta' && event.key === 'PrintScreen') // Windows + PrntScr
//       ) {
//         event.preventDefault();
//         alert('Screenshots are disabled!');
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);

//     return () => {
//       document.removeEventListener('contextmenu', handleContextMenu);
//       document.removeEventListener('keydown', handleKeyDown);
//     };
//   }, []);

//   return (
//     <div>
//       <select onChange={(e) => setSelectedPDF(e.target.value)} value={selectedPDF}>
//         <option value="">Select a PDF</option>
//         {pdfFiles.map((file) => (
//           <option key={file} value={file}>
//             {file}
//           </option>
//         ))}
//       </select>
//       {selectedPDF && (
//         <div style={{ border: '1px solid black', height: '500px', marginTop: '20px' }}>
//           <Viewer fileUrl={`http://localhost:5000/pdfs/${selectedPDF}`} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default PDFViewer;


import React, { useState, useEffect } from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Set the worker source to the legacy version
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PDFViewer = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState('');
  const [overlayActive, setOverlayActive] = useState(false);

  // Fetch available PDFs
  useEffect(() => {
    fetch('http://localhost:5000/api/pdfs')
      .then((response) => response.json())
      .then((files) => setPdfFiles(files))
      .catch((error) => console.error('Error fetching PDFs:', error));
  }, []);

  // Disable right-click and block screenshot keys
  useEffect(() => {
    // const handleContextMenu = (event) => {
    //   event.preventDefault();
    // };

    const handleKeyDown = (event) => {
      if (
        event.key === 'PrintScreen' || 
        (event.ctrlKey && event.key === 'PrintScreen') || 
        (event.metaKey && event.key === 'PrintScreen')
      ) {
        event.preventDefault();
        setOverlayActive(true);

        // Hide overlay after 3 seconds
        setTimeout(() => setOverlayActive(false), 3000);
      }
    };

    // document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      {/* Blackout overlay */}
      <div className={`screenshot-overlay ${overlayActive ? 'active' : ''}`}></div>

      <h1>Secure PDF Viewer</h1>

      <select onChange={(e) => setSelectedPDF(e.target.value)} value={selectedPDF}>
        <option value="">Select a PDF</option>
        {pdfFiles.map((file) => (
          <option key={file} value={file}>
            {file}
          </option>
        ))}
      </select>

      {selectedPDF && (
        <div className="viewer-container">
          <Viewer fileUrl={`http://localhost:5000/pdfs/${selectedPDF}`} />
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
