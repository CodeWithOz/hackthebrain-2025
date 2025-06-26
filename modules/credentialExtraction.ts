import { promises as fs } from "fs";
import {
  DocumentProcessorServiceClient,
  protos,
} from "@google-cloud/documentai";
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const projectId = "htb-2025";
const location = "us"; // Format is 'us' or 'eu'
const processorId = "a659a88bca4aa54d"; // Create processor in Cloud Console

// Create a singleton client to avoid multiple instantiations
const client = new DocumentProcessorServiceClient();

// Define the Zod schema for the Applicant interface
const ApplicantSchema = z.object({
  country: z.string().describe("The country where the applicant received their medical education"),
  degreeVerified: z.boolean().describe("Whether the applicant's medical degree has been verified"),
  internshipMonths: z.number().describe("Number of months of internship/residency completed"),
  hasMCCQE1: z.boolean().describe("Whether the applicant has passed the Medical Council of Canada Qualifying Examination Part 1"),
  role: z.enum(["gp", "specialist"]).default("gp").describe("The role of the applicant: general practitioner or specialist"),
  foreignSpecialtyCert: z.string().default("").describe("Foreign specialty certification, if any"),
  cfpcCertified: z.boolean().default(false).describe("Whether the applicant is certified by the College of Family Physicians of Canada"),
  provinceLicence: z.boolean().default(false).describe("Whether the applicant has a provincial medical license in Canada"),
  cmpa: z.boolean().default(false).describe("Whether the applicant has Canadian Medical Protective Association membership")
});

// Type alias for the extracted applicant data
type ApplicantData = z.infer<typeof ApplicantSchema>;

/**
 * Extract text from a PDF file using Google Document AI
 * @param file The uploaded file to process, or a path to a file on disk
 * @returns The extracted text content
 */
export async function extract(file?: File | string): Promise<string> {
  // The full resource name of the processor
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
  
  let encodedImage: string;
  
  if (file && typeof file === 'object' && 'arrayBuffer' in file) {
    // Handle uploaded File object
    const arrayBuffer = await file.arrayBuffer();
    encodedImage = Buffer.from(arrayBuffer).toString("base64");
  } else if (typeof file === 'string') {
    // Handle file path string
    const imageFile = await fs.readFile(file);
    encodedImage = Buffer.from(imageFile).toString("base64");
  } else {
    // Default to test file if no file is provided
    const testFilePath = "/Users/ucheozoemena/01-projects/hackthebrain-2025/modules/test.pdf";
    const imageFile = await fs.readFile(testFilePath);
    encodedImage = Buffer.from(imageFile).toString("base64");
  }

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: "application/pdf",
    },
  };

  // Recognizes text entities in the PDF document
  const [result] = await client.processDocument(request);
  const { document } = result;

  // Get all of the document text as one big string
  if (!document || !document.text) {
    throw new Error("Document not found");
  }
  const { text } = document;

  // Extract shards from the text field
  const getText = (
    textAnchor: protos.google.cloud.documentai.v1.Document.ITextAnchor
  ) => {
    if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
      return "";
    }

    // First shard in document doesn't have startIndex property
    const startIndex = textAnchor.textSegments[0].startIndex || 0;
    const endIndex = textAnchor.textSegments[0].endIndex || 0;

    return text.substring(Number(startIndex), Number(endIndex));
  };

  // Read the text recognition output from the processor
  console.log("The document contains the following paragraphs:");
  let fullText = "";
  for (const page of document.pages || []) {
    const { paragraphs } = page;

    for (const paragraph of paragraphs || []) {
      if (!paragraph.layout || !paragraph.layout.textAnchor) {
        console.log("Paragraph is missing layout or text anchor");
        continue;
      }
      const paragraphText = getText(paragraph.layout.textAnchor);
      console.log(`Paragraph text:\n${paragraphText}`);
      fullText += paragraphText;
    }
  }

  return fullText;
}

/**
 * Analyzes a resume using Google's Gemini model to extract credential information
 * @param resumeText The text content of the resume
 * @returns Structured applicant data based on the Applicant schema
 */
export async function analyzeResume(resumeText: string): Promise<ApplicantData> {
  // Initialize the Google Generative AI model
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || "",
    model: "gemini-1.5-flash",
  });
  
  // Create a structured output parser with the Zod schema
  const parser = StructuredOutputParser.fromZodSchema(ApplicantSchema);
  
  // Create a prompt template
  const promptTemplate = PromptTemplate.fromTemplate(`
    You are an expert medical credential analyzer. Your task is to extract information from the provided resume 
    to determine the applicant's qualifications for medical practice in Canada.
    
    Resume:
    {resumeText}
    
    Please extract the following information in a structured format:
    
    {formatInstructions}
    
    If certain information is not explicitly stated in the resume, make a reasonable inference based on the context.
    For example, if the resume mentions a Canadian medical license but doesn't specify the province, assume it's true for provinceLicence.
    If there's absolutely no information about a field, use the most conservative assumption (false for booleans, 0 for numbers, empty string for strings).
    Never return null or undefined for any field.
  `);
  
  // Create a chain that combines the prompt and model
  const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());
  
  // Invoke the chain
  const result = await chain.invoke({
    resumeText,
    formatInstructions: parser.getFormatInstructions(),
  });
  
  // Parse the result into the structured format
  try {
    return parser.parse(result);
  } catch (error) {
    console.error("Error parsing model output:", error);
    throw new Error("Failed to parse credential information from resume");
  }
}

/**
 * Extracts text from a resume and analyzes it to extract structured credential data
 * @returns Structured applicant data
 */
/**
 * Extracts text from a resume and analyzes it to extract structured credential data
 * @param file Optional file to process (File object or path string)
 * @returns Structured applicant data
 */
export async function extractAndEvaluateCredentials(file?: File | string): Promise<ApplicantData> {
  try {
    // Extract text from resume
    const resumeText = await extract(file);
    
    // Analyze the resume to extract structured data
    const applicantData = await analyzeResume(resumeText);
    
    return applicantData;
  } catch (error) {
    console.error("Error in credential extraction process:", error);
    throw error;
  }
}

