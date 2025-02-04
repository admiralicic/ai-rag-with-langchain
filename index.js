import { PdfQA } from "./src/PdfQA.js";

const pdfDocument = "../documents/pycharm-documentation-mini.pdf";
const pdfQa = await new PdfQA({
  model: "llama3",
  pdfDocument,
  chunkSize: 1000,
  chunkOverlap: 0,
}).init();

const pdfQaChain = pdfQa.queryChain();

const answer = await pdfQaChain.invoke({
  input: "How do we add a custom file type in PyCharm",
});

console.log(answer.answer, "\n");
console.log("# of documents used as context:", answer.context.length, "\n");
