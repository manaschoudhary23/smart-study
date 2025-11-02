# Smart Study Assistant 📚

An intelligent study assistant powered by Google's Gemini AI that helps students learn effectively through text analysis, quiz generation, and visual reasoning.

## Features

### 📄 Text Understanding
- **PDF Upload**: Upload and extract text from PDF documents
- **Text Summarization**: Get clear, concise summaries of your study materials
- **Concept Explanation**: Simplified explanations with analogies and examples

### 🧩 Quiz Generation
- Generate 5-20 questions from your text
- Multiple-choice and short-answer questions
- Customizable difficulty levels
- Instant feedback with explanations

### 🎨 Visual Reasoning
- **Draw Tool**: Create diagrams and drawings with a canvas-based tool
- **Image Upload**: Upload images for analysis
- **AI-Powered Analysis**: Ask questions about images and get detailed explanations
- Supports diagrams, circuits, math problems, and more

## Tech Stack

### Backend
- **Node.js** with Express
- **Google Gemini AI** (Gemini Pro & Gemini Pro Vision)
- **pdf-parse** for PDF text extraction
- **Multer** for file uploads

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- Modern, responsive UI with CSS

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

5. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## Project Structure

```
smart-study-assistant/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── server/                 # Express backend
│   ├── controllers/       # Request handlers
│   ├── routes/            # API routes
│   ├── services/          # Business logic & AI services
│   ├── uploads/           # Temporary file storage
│   ├── app.js             # Express app setup
│   └── server.js          # Server entry point
│
└── README.md
```

## API Endpoints

### PDF & Text Analysis
- `POST /api/pdf/upload` - Upload and extract text from PDF
- `POST /api/pdf/summarize` - Generate summary from text
- `POST /api/pdf/explain` - Get concept explanation

### Quiz Generation
- `POST /api/quiz/generate` - Generate quiz questions
  - Body: `{ text, numQuestions?, questionType?, difficulty? }`

### Visual Analysis
- `POST /api/vision/analyze` - Analyze image with optional question
  - FormData: `image`, `question?`, `context?`

## Usage Examples

### Upload and Summarize PDF
1. Go to Home page
2. Upload a PDF or paste text
3. Click "Generate Summary" or "Explain Concepts"

### Generate Quiz
1. Upload or paste text on Home page
2. Select number of questions and type
3. Click "Generate Quiz"
4. Answer questions and get instant feedback

### Visual Question & Answer
1. Go to Visual Q&A page
2. Draw on canvas or upload an image
3. Enter your question (e.g., "Find the distance", "Explain this circuit")
4. Click "Analyze Image" to get AI-powered analysis

## Features in Detail

### SmartStudy AI Capabilities
- **Clear Communication**: Structured, educational responses
- **Beginner-Friendly**: Simplified explanations with analogies
- **Visual Understanding**: Analyzes diagrams, circuits, math problems
- **Step-by-Step Reasoning**: Detailed explanations for complex problems
- **Formula Support**: Uses equations where appropriate

## Environment Variables

### Server (.env)
```
PORT=5000
GEMINI_API_KEY=your_api_key_here
CLIENT_URL=http://localhost:5173
```

## Development

### Running in Development Mode
- Backend: `npm run dev` (uses nodemon for auto-reload)
- Frontend: `npm run dev` (Vite with HMR)

### Building for Production
- Frontend: `npm run build` (outputs to `dist/`)

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your Gemini API key is correctly set in `.env`
2. **CORS Error**: Ensure `CLIENT_URL` in server `.env` matches your frontend URL
3. **File Upload Fails**: Check file size limits (default: 10MB)
4. **PDF Parse Error**: Ensure PDF is not password-protected or corrupted

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ for students everywhere

