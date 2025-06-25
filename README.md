# Interactive Networking Tutor with Gemini AI

This is a complete, AI-enhanced, single-page web application designed to teach computer networking concepts from absolute beginner to advanced topics (CCNA-level and beyond). It is built with vanilla HTML5, CSS3, and JavaScript, requiring no build step.

**⭐ Features**
- **10 Interactive Chapters:** Covering everything from the OSI model to Zero Trust Architecture.
- **Global AI Tutor:** A context-aware chatbot powered by Gemini is available on every page to answer your questions.
- **AI-Powered Labs:** Get AI-driven feedback on your subnet calculations and security rule designs.
- **Hands-On Simulators:** Includes a CLI, VLAN simulator, policy builders, and mock dashboards.
- **Advanced Topics:** Modules on Cloud Networking, Network Automation (with live Python), and Network Observability.

## ❗ CRITICAL SETUP: Add Your Gemini API Key

To enable all the AI features, you must add your own Google AI API key. This is a free and simple process.

1.  **Get a free API key** by visiting **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2.  Sign in with your Google account and click "**Create API key**".
3.  Copy the new key to your clipboard.
4.  Open the file: **`js/config.js`** in the project folder.
5.  Replace the placeholder text `"YOUR_GEMINI_API_KEY_HERE"` with the key you just copied.
6.  Save the file. The AI features will now be active.

**IMPORTANT:** Never share your API key publicly or commit the `config.js` file with your key in it to a public repository like GitHub.

## How to Run Locally

Because the application loads modules and calls an external API, you must serve the files from a local web server. **You cannot just double-click `index.html`.**

**1. Open a Terminal/Command Prompt.**
   - **Windows:** Click Start, type `cmd`, and press Enter.
   - **macOS:** Open Applications > Utilities > Terminal.

**2. Navigate to the `networking-tutor` folder.**
   - The easiest way: Type `cd ` (with a space), then drag the `networking-tutor` folder from your file explorer onto the terminal window and press Enter.

**3. Run the server command (pick one):**
   ```sh
   # Recommended method, if you have Python 3
   python -m http.server