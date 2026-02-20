import mammoth from "mammoth";
import { createRequire } from "module";

// pdf-parse has a known ESM bug: on import it tries to read a test PDF at a
// hardcoded path (test/data/05-versions-space.pdf) which doesn't exist in the
// project. The fix is to bypass the package's main index and load the core
// library file directly using CommonJS require, which skips the test-file load.
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

/**
 * Extracts plain text from uploaded file buffer based on mimetype
 */
export const extractTextFromFile = async (buffer, mimetype, originalname) => {
  const ext = originalname.split(".").pop().toLowerCase();

  if (ext === "txt" || mimetype === "text/plain") {
    return buffer.toString("utf-8");
  }

  if (
    ext === "docx" ||
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (ext === "pdf" || mimetype === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }

  throw new Error(
    `Unsupported file type: .${ext}. Supported formats: .pdf, .docx, .txt`
  );
};

/**
 * Validates file size (max 5MB)
 */
export const validateFileSize = (size, maxMB = 5) => {
  if (size > maxMB * 1024 * 1024) {
    throw new Error(`File too large. Maximum size is ${maxMB}MB.`);
  }
};