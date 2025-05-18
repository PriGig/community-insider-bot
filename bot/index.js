const express = require("express");
const fs = require("fs");
const path = require("path");
const { ActivityHandler, BotFrameworkAdapter, CardFactory } = require("botbuilder");
const config = require("./config");

const FEEDBACK_PATH = path.resolve(__dirname, "../mcp-server/processed_feedback.json");
const TOP_FEEDBACK_CARD_PATH = path.resolve(__dirname, "topFeedbackCard.json");
const PAIN_POINTS_CARD_PATH = path.resolve(__dirname, "painPointsCard.json");

// Initialize Express
const app = express();
app.use(express.json());

// Initialize Bot Adapter
const adapter = new BotFrameworkAdapter({
  appId: config.BOT_ID,
  appPassword: config.BOT_PASSWORD
});

// Function to map urgency to colors
const getUrgencyColor = (urgency) => {
  switch (urgency.toLowerCase()) {
    case "high":
      return "Attention"; // Red
    case "medium":
      return "Warning";   // Yellow
    case "low":
      return "Good";      // Green
    default:
      return "Default";   // Gray
  }
};

// Function to load Adaptive Card template
const loadAdaptiveCard = (cardPath, data) => {
  try {
    const cardTemplate = JSON.parse(fs.readFileSync(cardPath, "utf-8"));
    const cardString = JSON.stringify(cardTemplate);

    // Data sanitization to avoid JSON parsing errors
    const sanitizedData = {};
    Object.keys(data).forEach(key => {
      sanitizedData[key] = JSON.stringify(data[key]).slice(1, -1); // Removes quotes and escapes special characters
    });

    const populatedCard = cardString.replace(/\$\{(\w+)\}/g, (_, key) => sanitizedData[key] || "");
    return JSON.parse(populatedCard);
  } catch (error) {
    console.error("Error processing Adaptive Card:", error.message);
    throw new Error(`Error processing Adaptive Card: ${error.message}`);
  }
};

// Bot Logic
class FeedbackBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      const userMessage = context.activity.text.trim().toLowerCase();

      let feedbackData;
      try {
        feedbackData = JSON.parse(fs.readFileSync(FEEDBACK_PATH, "utf-8"));
      } catch (error) {
        console.error("Error reading feedback data:", error.message);
        await context.sendActivity("No feedback data available.");
        await next();
        return;
      }

      if (userMessage.includes("top feedback today")) {
        console.log("Generating Top Feedback Card...");

        const topFeedback = feedbackData.slice(0, 3);
        const cardData = {
          summary1: topFeedback[0]?.summary || "N/A",
          urgency1: topFeedback[0]?.urgency || "N/A",
          source1: topFeedback[0]?.source || "N/A",
          link1: topFeedback[0]?.link || "#",
          urgency1Color: getUrgencyColor(topFeedback[0]?.urgency || "low"),

          summary2: topFeedback[1]?.summary || "N/A",
          urgency2: topFeedback[1]?.urgency || "N/A",
          source2: topFeedback[1]?.source || "N/A",
          link2: topFeedback[1]?.link || "#",
          urgency2Color: getUrgencyColor(topFeedback[1]?.urgency || "low"),

          summary3: topFeedback[2]?.summary || "N/A",
          urgency3: topFeedback[2]?.urgency || "N/A",
          source3: topFeedback[2]?.source || "N/A",
          link3: topFeedback[2]?.link || "#",
          urgency3Color: getUrgencyColor(topFeedback[2]?.urgency || "low"),
        };

        const card = loadAdaptiveCard(TOP_FEEDBACK_CARD_PATH, cardData);
        await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });

      } else if (userMessage.includes("pain points summary")) {
        console.log("Generating Pain Points Summary Card...");

        const cardData = {
          summary1: feedbackData[0]?.summary || "N/A",
          urgency1: feedbackData[0]?.urgency || "N/A",
          source1: feedbackData[0]?.source || "N/A",
          link1: feedbackData[0]?.link || "#",
          urgency1Color: getUrgencyColor(feedbackData[0]?.urgency || "low"),

          summary2: feedbackData[1]?.summary || "N/A",
          urgency2: feedbackData[1]?.urgency || "N/A",
          source2: feedbackData[1]?.source || "N/A",
          link2: feedbackData[1]?.link || "#",
          urgency2Color: getUrgencyColor(feedbackData[1]?.urgency || "low")
        };

        const card = loadAdaptiveCard(PAIN_POINTS_CARD_PATH, cardData);
        await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });

      } else {
        await context.sendActivity("I can help you with:\n- Top feedback today\n- Pain points summary");
      }

      await next();
    });
  }
}

// Create Bot Instance
const feedbackBot = new FeedbackBot();

// Listen for incoming requests
app.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await feedbackBot.run(context);
  });
});

const PORT = config.PORT || 3980;
app.listen(PORT, () => {
  console.log(`✅ Teams Bot running on port ${PORT}`);
});
