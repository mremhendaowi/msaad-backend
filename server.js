import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// مسار للترحيب في المتصفح للتأكد من عمل السيرفر
app.get('/', (req, res) => {
    res.send('AI Server is running perfectly!');
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message provided" });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(message);
        // الطريقة الأكثر أماناً لجلب النص في الإصدارات الجديدة
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Response:", text); // سيظهر في الـ Logs في Render
        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ reply: "حدث خطأ في جلب الرد من الذكاء الاصطناعي", details: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is live on port ${PORT}`);
});