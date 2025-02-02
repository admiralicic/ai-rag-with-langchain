import { PdfQA } from "./src/PdfQA.js";

const pdfDocument = "../documents/pycharm-documentation-mini.pdf";
const pdfQA = await new PdfQA({ model: "llama3", pdfDocument }).init();

console.log(pdfQA.documents.length);

console.log("/n/nDocument #0 page content: ", pdfQA.documents[0].pageContent);
