import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// قراءة المفتاح من Render
const API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // ✅ فحص وجود المفتاح
  if (!API_KEY) {
    console.log("API KEY MISSING");
    return res.json({
      reply: "المفتاح غير موجود في السيرفر"
    });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    // طباعة الرد الكامل في Logs
    console.log("OpenRouter response:", data);

    // ✅ إذا في خطأ من API
    if (data.error) {
      return res.json({
        reply: "خطأ: " + data.error.message
      });
    }

    // ✅ استخراج الرد
    const reply =
      data.choices?.[0]?.message?.content ||
      "لا يوجد رد";

    res.json({ reply });

  } catch (error) {
    console.log("Server error:", error);
    res.json({
      reply: "خطأ في الاتصال بالسيرفر"
    });
  }
});

// مهم لـ Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});