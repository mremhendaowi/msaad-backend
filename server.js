app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        // محاولة استخدام الموديل المستقر gemini-pro
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(message);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ 
            reply: "فشل الاتصال النهائي", 
            details: error.message,
            tip: "تأكد من أن الـ API Key صالح ومفعل من Google AI Studio" 
        });
    }
});