import { PdfQA } from "./src/PdfQA.js";

const pdfDocument = "../documents/pycharm-documentation-mini.pdf";
const pdfQA = await new PdfQA({
  model: "llama3",
  pdfDocument,
  chunkSize: 1000,
  chunkOverlap: 0,
}).init();

console.log("# of returned documents: ", pdfQA.retriever.k);
console.log("Search Type: ", pdfQA.retriever.searchType);

const relevantDocuments = await pdfQA.retriever.invoke(
  "What can I do with AI in PyCharm?"
);

console.log("Relevant Documents: ", relevantDocuments);
