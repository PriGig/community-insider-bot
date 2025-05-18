# community-insider-bot- AI-Powered Developer Feedback Aggregator

This project is a Microsoft Teams application that uses the Teams AI Library (v2) and MCP protocol to ingest developer feedback from Stack Overflow and GitHub Issues, extract actionable insights using GPT-4, and surface them through a conversational Teams bot with Adaptive Cards.

---
## Project Structure

```
/community-insider-bot/
│── mcp-client/
│   └── index.js  # Fetches data from Stack Overflow and GitHub
│
│── mcp-server/
│   └── index.js  # Processes feedback and logs data to processed_feedback.json
│   └── processed_feedback.json # Sample feedback data for AI processing
│
│── bot/
│   ├── index.js  # Bot logic to handle Teams interactions
│   ├── config.js  # Configuration for bot service
│   ├── topFeedbackCard.json  # Adaptive card for Top Feedback
│   └── painPointsCard.json  # Adaptive card for Pain Points
│
└── README.md
```

---
## Key Features

* Extracts feedback from GitHub Issues and Stack Overflow
* Analyzes and classifies feedback based on urgency (High, Medium, Low)
* Generates adaptive cards for:

  * Top Feedback Today
  * Pain Points Summary
* Provides actionable insights to developers and project managers

---

## Metrics and Interpretation

* **Top Feedback Analysis:** Number of feedback items classified as High, Medium, or Low urgency.
* **Pain Points Analysis:** Recurrent issues identified from developer feedback.
* **Engagement Analysis:** Track how often feedback summaries are generated and shared.
* **Resolution Rate:** Number of high-priority feedback items addressed within a specific timeframe.

---

## Getting Started

### Prerequisites:

* Node.js v22.15.1
* Azure Bot Service
* Azure OpenAI GPT-4 Deployment
* Microsoft Teams Developer Account
* Ngrok (for testing in Teams)

### Installation:

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd community-insider-bot
   ```

2. Install dependencies for each service:

   ```bash
   cd mcp-client && npm install
   cd ../mcp-server && npm install
   cd ../bot && npm install
   ```

3. Configure Azure OpenAI (GPT-4): Add Azure OpenAI credentials in config.js. Update the `config.js` files with necessary credentials and configuration.

4. Start MCP Client, MCP Server, and Bot in separate terminals:

   ```bash
   node mcp-client/index.js
   node mcp-server/index.js
   node bot/index.js
   ```
5. Testing via Ngrok
   
   Start Ngrok:
   ```bash
   npx ngrok http 3980
   ```
   Update the messaging endpoint in the Azure Bot configuration with the Ngrok URL.
   
5. Deploy the bot to Teams.
   Zip the manifest.json, color.png, and outline.png files in /bot/manifest.
   Upload the zip file to the Teams Developer Portal.
   Test the bot in the Teams client.

---

## Usage

* Send `Top feedback today` to receive the top 3 feedback items based on urgency.
* Send `Pain points summary` to receive the summarized pain points and suggested actions.

---

## Adaptive Cards Structure

1. Top Feedback Card:
   Displays the top 3 feedback items.
   Includes urgency, source, and link.

2. Pain Points Summary Card:
   Displays key pain points.
   Includes impact level and urgency indicator.

---

## Future Enhancements

* Implement sentiment analysis: Integrate GPT-4 to assess feedback tone.
* Add more developer forums for data extraction.
* Include interactive buttons for marking feedback as resolved or dismissed.
* Feedback Metrics Dashboard: Develop a dashboard to track feedback trends and sentiment distribution.
* Push Notifications: Implement proactive notifications for urgent feedback in Teams.

---

## Troubleshooting and Debugging
1. 502 Gateway Error: Ensure server and bot services are running properly.
2. Invalid Client Secret Error: Verify Azure AD credentials in config.js.
3. Data Mapping Issues: Check data structure in processed_feedback.json.

---

## Contributors

* Developer: \kumaripriya

---
