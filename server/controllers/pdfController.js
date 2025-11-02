import { extractTextFromPDF, summarizeText, explainConcepts } from '../services/pdfService.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function uploadPDF(req, res, next) {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfFile = req.files.pdf;
    const uploadPath = join(__dirname, '../uploads', pdfFile.name);

    await pdfFile.mv(uploadPath);

    const text = await extractTextFromPDF(uploadPath);

    await fs.unlink(uploadPath).catch(() => {});

    res.json({
      success: true,
      text: text,
      filename: pdfFile.name
    });
  } catch (error) {
    next(error);
  }
}

export async function summarize(req, res, next) {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const summary = await summarizeText(text);

    res.json({
      success: true,
      summary: summary
    });
  } catch (error) {
    next(error);
  }
}

export async function explain(req, res, next) {
  try {
    const { text, topic } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const explanation = await explainConcepts(text, topic);

    res.json({
      success: true,
      explanation: explanation
    });
  } catch (error) {
    next(error);
  }
}

export default { uploadPDF, summarize, explain };

