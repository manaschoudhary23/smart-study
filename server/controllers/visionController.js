import { analyzeImageBuffer } from "../services/visionService.js";
import fs from 'fs/promises';

export async function analyzeImageUpload(req, res, next) {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const imageFile = req.files.image;
    const { question, context } = req.body;

    if (imageFile.size > 4 * 1024 * 1024) {
      return res.status(400).json({ 
        error: "Image file is too large. Maximum size is 4MB.",
        details: "Please compress your image or try a smaller file."
      });
    }

    const ext = imageFile.name.split(".").pop().toLowerCase();
    const allowedTypes = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp']);
    
    if (!allowedTypes.has(ext)) {
      return res.status(400).json({ 
        error: "Invalid file type",
        details: "Please upload a PNG, JPEG, GIF, or WebP image."
      });
    }

    const mimeType =
      ext === "png" ? "image/png" :
      ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
      ext === "gif" ? "image/gif" :
      ext === "webp" ? "image/webp" :
      "image/jpeg";

    const defaultQuestion = "Please analyze this image and explain what you see. Consider any text, diagrams, mathematical equations, or scientific concepts shown.";

    let imageBuffer;
    let tempPath = null;
    if (imageFile.data && imageFile.data.length) {
      imageBuffer = imageFile.data;
    } else if (imageFile.tempFilePath) {
      tempPath = imageFile.tempFilePath;
      imageBuffer = await fs.readFile(tempPath);
    } else {
      return res.status(400).json({ error: 'Uploaded file not readable' });
    }

    const analysis = await analyzeImageBuffer(
      imageBuffer,
      mimeType,
      question || defaultQuestion,
      context || ""
    );

    if (tempPath) {
      fs.unlink(tempPath).catch(() => {});
    }

    res.json({
      success: true,
      analysis,
      question: question || "Image analysis",
    });
  } catch (error) {
    console.error("Vision Controller Error:", error);
    res.status(500).json({ error: error.message });
  }
}
