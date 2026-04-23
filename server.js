const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // لقراءة المتغيرات من ملف .env أو Render

const app = express();
app.use(express.json());

// إعداد Gemini باستخدام المفتاح الموجود في المتغيرات البيئية
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "الرجاء إرسال رسالة" });
        }

        // اختيار الموديل (gemini-1.5-flash هو الأسرع والمجاني)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // إرسال الرد النهائي للمستخدم
        res.json({ reply: text });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ في الاتصال بالذكاء الاصطناعي" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));