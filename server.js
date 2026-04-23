import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// رسالة ترحيب للتأكد أن النسخة الحالية هي "V3"
app.get('/', (req, res) => res.send('Server Version: V3-FIXED is Live!'));

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message provided" });

        // التعديل: تجربة الموديل gemini-pro كبديل إذا فشل flash في بعض المناطق
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            apiVersion: 'v1' // إجبار المكتبة على استخدام الإصدار المستقر v1 بدلاً من v1beta
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Gemini Detailed Error:", error);
        res.status(500).json({ 
            reply: "فشل الاتصال", 
            details: error.message,
            version: "V3-FIXED" 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});