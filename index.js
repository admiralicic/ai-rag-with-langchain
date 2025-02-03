import { PdfQA } from "./src/PdfQA.js";

const pdfDocument = "../documents/pycharm-documentation-mini.pdf";
const pdfQA = await new PdfQA({
  model: "llama3",
  pdfDocument,
  chunkSize: 1000,
  chunkOverlap: 0,
}).init();

console.log("Embeddings model: ", pdfQA.db.embeddings.model);
console.log("# of embeddings: ", pdfQA.db.memoryVectors.length);

const similaritySearchWithScoreResults =
  await pdfQA.db.similaritySearchWithScore("File type associations", 10);

console.log("Document pages and their score related to our query:");
for (const [doc, score] of similaritySearchWithScoreResults) {
  console.log(
    `* [SIM=${score.toFixed(3)}] [Page number: ${doc.metadata.loc.pageNumber}]`
  );
}
