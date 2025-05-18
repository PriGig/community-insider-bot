const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const config = require("./config");

const app = express();
app.use(express.json());  // Ensure JSON payloads are parsed correctly

const PORT = config.PORT || 3978;

const INPUT_PATH = path.join(__dirname, "../mcp-client/feedback.json");
const OUTPUT_PATH = path.join(__dirname, "processed_feedback.json");

// Processing Route
app.post("/process-feedback", async (req, res) => {
  console.log("Processing feedback...");

  try {
    const feedbackData = JSON.parse(fs.readFileSync(INPUT_PATH, "utf-8"));
    const processedData = [];

    for (const entry of feedbackData) {
      const payload = {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Summarize the key problem in this developer feedback and classify urgency (High/Medium/Low): ${entry.body}`
          }
        ]
      };

      const response = await axios.post(
        `${config.APP_ID}/openai/deployments/gpt-4/chat/completions?api-version=2025-01-01-preview`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": config.APP_PASSWORD
          }
        }
      );

      const summary = response.data.choices[0].message.content;

      processedData.push({
        source: entry.source,
        link: entry.link,
        summary: summary,
        urgency: "High"  // This is static for now; adjust based on logic
      });
    }

    // Save to processed_feedback.json
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(processedData, null, 2));
    console.log(`Processed data saved to ${OUTPUT_PATH}`);

    res.json({ success: true, data: processedData });

  } catch (error) {
    console.error("Error processing feedback:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ MCP Server running on port ${PORT}`);
});
