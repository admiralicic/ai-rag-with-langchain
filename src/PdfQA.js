import { Ollama } from "@langchain/ollama";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "node:path";

export class PdfQA {
  constructor({ model, pdfDocument }) {
    this.model = model;
    this.pdfDocument = pdfDocument;
  }

  async init() {
    // Load the chat model
    this.initChatModel();

    await this.loadDocuments();

    return this;
  }

  async initChatModel() {
    console.log(`Loading ${this.model} model...`);
    // Use the Ollama class to load the model
    this.llm = new Ollama({ model: this.model });

    console.log("Model loaded successfully!");
    const response = await this.llm.invoke("What is the capital of France");
    console.log(response);
  }

  async loadDocuments() {
    // Load the PDF document
    console.log(`Loading PDF document...`);
    this.pdfLoader = new PDFLoader(
      path.join(import.meta.dirname, this.pdfDocument)
    );

    this.documents = await this.pdfLoader.load();
    console.log("PDF document loaded successfully!");
  }
}
