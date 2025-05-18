const axios = require('axios');
const fs = require('fs');
const path = require('path');

const config = {
  STACK_TAG: 'microsoft-teams',
  GITHUB_REPO: 'MicrosoftDocs/msteams-docs'
};

const OUTPUT_PATH = path.join(__dirname, 'feedback.json');

// Fetch Stack Overflow Data
async function fetchStackOverflow() {
  const url = `https://api.stackexchange.com/2.3/questions?order=desc&sort=activity&tagged=${config.STACK_TAG}&site=stackoverflow`;

  try {
    const response = await axios.get(url);
    return response.data.items.map(item => ({
      source: "stackoverflow",
      title: item.title,
      body: item.body || "No body content",
      link: item.link
    }));
  } catch (err) {
    console.error("Error fetching Stack Overflow data:", err.message);
    return [];
  }
}

// Fetch GitHub Issues Data
async function fetchGitHubIssues() {
  const url = `https://api.github.com/repos/${config.GITHUB_REPO}/issues`;

  try {
    const response = await axios.get(url);
    return response.data.map(issue => ({
      source: "github",
      title: issue.title,
      body: issue.body || "No body content",
      link: issue.html_url
    }));
  } catch (err) {
    console.error("Error fetching GitHub data:", err.message);
    return [];
  }
}

// Main Function
async function run() {
  console.log("Fetching data...");

  const stackOverflowData = await fetchStackOverflow();
  const githubData = await fetchGitHubIssues();

  const combinedData = [...stackOverflowData, ...githubData];

  // Save to feedback.json
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(combinedData, null, 2));
  console.log(`Data saved to ${OUTPUT_PATH}`);
}

run();
