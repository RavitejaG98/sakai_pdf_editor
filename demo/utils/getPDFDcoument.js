// app/_utils/getPDFDocument.tsx

// this function takes an argument we named path that 
// can be a path to the file or can be an external link
// that contains the PDF
const getPDFDocument = async (path) => {
  pdfJS.GlobalWorkerOptions.workerSrc =
    window.location.origin + "/pdf.worker.min.js";

  return new Promise((resolve, reject) => {
    pdfJS
      .getDocument(path)
      .promise.then((document) => {
        resolve(document);
      })
      .catch(reject);
  });
};

export default getPDFDocument