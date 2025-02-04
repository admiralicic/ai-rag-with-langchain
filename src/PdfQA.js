import { Ollama, OllamaEmbeddings } from "@langchain/ollama";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import path from "node:path";

export class PdfQA {
  constructor({
    model,
    pdfDocument,
    chunkSize,
    chunkOverlap,
    searchType = "similarity",
    kdocuments,
  }) {
    this.model = model;
    this.pdfDocument = pdfDocument;
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
    this.searchType = searchType;
    this.kdocuments = kdocuments;
  }

  async init() {
    // Load the chat model
    this.initChatModel();
    await this.loadDocuments();
    await this.splitDocuments();
    this.selectEmbedding = new OllamaEmbeddings({
      model: "all-minilm:latest",
    });
    await this.createVectorStore();
    this.createRetreiver();
    this.chain = await this.createChain();
    return this;
  }

  async initChatModel() {
    console.log(`Loading ${this.model} model...`);
    // Use the Ollama class to load the model
    this.llm = new Ollama({ model: this.model });

    console.log("Model loaded successfully!");
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

  async createVectorStore() {
    console.log("Creating document embeddings...");

    this.db = await MemoryVectorStore.fromDocuments(
      this.texts,
      this.selectEmbedding
    );
  }

  createRetreiver() {
    console.log("Initialize vector store retreiver...");
    this.retriever = this.db.asRetriever({
      k: this.kdocuments,
      searchType: this.searchType,
    });
  }

  async createChain() {
    console.log("Creating Retrieval QA Chain...");

    console.log("Setting up prompt template...");
    const prompt = ChatPromptTemplate.fromTemplate(
      `Answer the user question: {input} based on the following context {context}`
    );

    console.log("Setting up combine documents chain...");
    const combineDocsChain = await createStuffDocumentsChain({
      llm: this.llm,
      prompt,
    });

    console.log("Setting up retrieval chain...");
    const chain = await createRetrievalChain({
      combineDocsChain,
      retriever: this.retriever,
    });

    return chain;
  }

  queryChain() {
    return this.chain;
  }
}
