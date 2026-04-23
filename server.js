import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => res.send('Server is Up!'));

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(message);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Running on port ${PORT}`);
});