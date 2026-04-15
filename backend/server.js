require("dotenv").config();
const express = require("express");
const cors = require("cors");
const systemPrompt = require("./systemPrompt");

const app = express();
app.use(cors());
app.use(express.json());

const conversationHistory = [];
const USE_OLLAMA = process.env.USE_OLLAMA === "true";

async function callAI(messages) {
    if (USE_OLLAMA) {
        const response = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.2",
                messages,
                stream: false,
                options: {
                    temperature: 0.4,
                    top_p: 0.85,
                    repeat_penalty: 1.3,
                    num_predict: 200,
                }
            })
        });
        const data = await response.json();
        if (!data.message) throw new Error("Ollama error: " + JSON.stringify(data));
        return data.message.content;

    } else {
        const models = [
            "meta-llama/llama-3.2-3b-instruct:free",
            "google/gemma-3-4b-it:free",
            "mistralai/mistral-7b-instruct:free",
            "qwen/qwen2.5-vl-3b-instruct:free",
            "microsoft/phi-4-reasoning-plus:free",
        ];

        let lastError = "";

        for (let attempt = 0; attempt < models.length; attempt++) {
            const model = models[attempt];
            try {
                console.log(`Trying model: ${model}`);
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model,
                        messages,
                        temperature: 0.4,
                        max_tokens: 300
                    })
                });

                const data = await response.json();

                if (data.choices?.[0]?.message?.content) {
                    console.log(`Success with model: ${model}`);
                    return data.choices[0].message.content;
                }

                lastError = data.error?.message || "No content returned";
                console.log(`Model ${model} failed: ${lastError}`);

                if (data.error?.code === 429 || data.error?.code === 503) {
                    await new Promise(r => setTimeout(r, 1500));
                }

            } catch (err) {
                lastError = err.message;
                console.log(`Model ${model} threw error: ${lastError}`);
            }
        }

        throw new Error(`All models failed. Last error: ${lastError}`);
    }
}

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    conversationHistory.push({ role: "user", content: message });

    try {
        const reply = await callAI([
            { role: "system", content: systemPrompt },
            ...conversationHistory
        ]);

        conversationHistory.push({ role: "assistant", content: reply });
        res.json({ reply });

    } catch (error) {
        console.error("AI error:", error.message);
        res.status(500).json({ error: "Something went wrong, please try again." });
    }
});

app.get("/", (req, res) => {
    res.json({ status: "APUBot server is running!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`APUBot running on port ${PORT} — using ${USE_OLLAMA ? "Ollama (local)" : "OpenRouter (cloud)"}`);
});