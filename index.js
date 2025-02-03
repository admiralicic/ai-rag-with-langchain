import { PdfQA } from "./src/PdfQA.js";

const pdfDocument = "../documents/pycharm-documentation-mini.pdf";
const pdfQA = await new PdfQA({
  model: "llama3",
  pdfDocument,
  chunkSize: 1000,
  chunkOverlap: 0,
}).init();

console.log(pdfQA.texts.length);
