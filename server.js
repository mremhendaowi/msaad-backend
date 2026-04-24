import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // طباعة الرد في Logs للتشخيص
    console.log("Gemini response:", data);

    // إذا في خطأ من Gemini
    if (data.error) {
      return res.json({
        reply: "خطأ: " + data.error.message,
      });
    }

    // استخراج الرد
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "لا يوجد رد";

    res.json({ reply });

  } catch (error) {
    console.log("Server error:", error);
    res.json({
      reply: "خطأ في الاتصال بالسيرفر",
    });
  }
});

// مهم لـ Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});