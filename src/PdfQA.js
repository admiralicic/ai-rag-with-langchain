import { Ollama } from "@langchain/ollama";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import path from "node:path";

export class PdfQA {
  constructor({ model, pdfDocument, chunkSize, chunkOverlap }) {
    this.model = model;
    this.pdfDocument = pdfDocument;
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
  }

  async init() {
    // Load the chat model
    this.initChatModel();

    await this.loadDocuments();
    await this.splitDocuments();

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
    console.log(`Loading PDFs...`);
    const pdfLoader = new PDFLoader(
      path.join(import.meta.dirname, this.pdfDocument)
    );

    this.documents = await pdfLoader.load();
    console.log("PDF document loaded successfully!");
  }

  async splitDocuments() {
    console.log("Splitting documents...");
    const textSplitter = new CharacterTextSplitter({
      separator: " ",
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
    });

    this.texts = await textSplitter.splitDocuments(this.documents);
  }
}
