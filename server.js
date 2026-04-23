import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.get('/', (req, res) => res.send('Server is Up!'));

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("API Key is missing in Render Environment");
        }

        // استخدام gemini-1.5-flash كخيار أول لأنه الأحدث
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("DEBUG ERROR:", error.message);
        // إرسال تفاصيل الخطأ بدقة
        res.status(500).json({ 
            error: "حدث خطأ داخلي", 
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Active on ${PORT}`));