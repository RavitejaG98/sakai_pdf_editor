"use client";
import { useEffect, useState } from "react";

export const usePDFJS = (onLoad, deps = []) => {
  const [pdfjs, setPDFJS] = useState(null);

  // Load the library once on mount (the webpack import automatically sets up the worker)
  useEffect(() => {
    import("pdfjs-dist/webpack.mjs").then(setPDFJS);
  }, []);

  // Execute the callback function whenever PDFJS loads (or a custom dependency-array updates)
  useEffect(() => {
    if (!pdfjs) return;
    (async () => await onLoad(pdfjs))();
  }, [pdfjs, ...deps]);
};
