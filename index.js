import { PdfQA } from "./src/PdfQA.js";

const pdfDocument = "../documents/pycharm-documentation-mini.pdf";
const pdfQa = await new PdfQA({
  model: "llama3",
  pdfDocument,
  chunkSize: 1000,
  chunkOverlap: 0,
}).init();

const pdfQaChain = pdfQa.queryChain();

const answer1 = await pdfQaChain.invoke({
  input: "How do we add a custom file type in PyCharm",
});

console.log(answer1.answer, "\n");
console.log("# number of documents used as context:", answer1.context.length);

const chatHistory1 = [answer1.input, answer1.answer];

console.log("------------------------------");

const answer2 = await pdfQaChain.invoke({
  input: "Is there anything else to add here?",
  chat_history: chatHistory1,
});

console.log(answer2.answer, "\n");
