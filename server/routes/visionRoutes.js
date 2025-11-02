import express from "express";
import fileUpload from "express-fileupload";
import { analyzeImageUpload } from "../controllers/visionController.js";

const router = express.Router();

router.use(fileUpload({
  limits: { 
    fileSize: 4 * 1024 * 1024 
  },
  abortOnLimit: true,
  limitHandler: function(req, res, next) {
    return res.status(413).json({
      error: 'File too large',
      details: 'Maximum file size is 4MB. Please compress your image or try a smaller file.'
    });
  },
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
  debug: process.env.NODE_ENV === 'development'
}));

router.post("/analyze", analyzeImageUpload);

export default router;
