const express = require("express");
const cors = require("cors");

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

    console.log(data); // مهم للتشخيص

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "لا يوجد رد";

    res.json({ reply });
  } catch (error) {
    console.log(error);
    res.json({ reply: "خطأ في الاتصال" });
  }
});

app.listen(3000, () => {
  console.log("AI Server running");
});