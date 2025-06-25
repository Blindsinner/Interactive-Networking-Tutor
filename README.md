<div align="center">
  <img src="https://github.com/Blindsinner/Interactive-Networking-Tutor/blob/main/logo.png" alt="Logo" width="150">
  <h1>Interactive Networking Tutor</h1>
  <p><strong>A comprehensive, AI-enhanced web application for learning computer networking, from beginner to architect.</strong></p>
  <p><em>Created by <a href="https://github.com/Blindsinner">Blindsinner</a></em></p>
</div>

<div align="center">

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)
![Technology](https://img.shields.io/static/v1?label=tech&message=HTML5%20|%20CSS3%20|%20JS&color=blueviolet)

</div>

---

The Interactive Networking Tutor is a complete, self-contained, single-page web application designed to teach computer networking concepts. It guides learners from foundational topics like the OSI model to advanced, real-world subjects like cloud networking, automation, and Zero Trust architecture.

The core learning experience is enhanced by **Google's Gemini AI**, which provides a global, context-aware tutor to answer questions and an in-lab assistant to explain complex calculations and security policies.

## 🚀 Live Demo

A live version of this project is hosted on GitHub Pages.

**[➡️ Launch the Interactive Networking Tutor](https://blindsinner.github.io/interactive-networking-tutor/)**

> **Note:** Please replace the link above if you deploy to a different URL. The link assumes your repository is named `interactive-networking-tutor`.

## 📋 Table of Contents

- [⭐ Key Features](#-key-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [🏁 Getting Started](#-getting-started)
  - [Prerequisites](#1-prerequisites)
  - [Configuration: The API Key](#2-configuration-critical-step)
  - [Running Locally](#3-running-locally)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [⚖️ License](#️-license)

---

## ⭐ Key Features

* **Comprehensive Curriculum:** 10 interactive chapters covering everything from the OSI model to Zero Trust Architecture.
* **Global AI Tutor:** A context-aware chatbot powered by Gemini is available on every page to answer your questions.
* **AI-Powered Labs:** Get AI-driven feedback on your VPC designs and detailed explanations for your ACL rules.
* **Hands-On Simulators:** Includes a CLI, VLAN simulator, policy builders, and mock dashboards.
* **Live Python Sandbox:** Use Pyodide to run real Python code for network automation tasks directly in the browser.
* **100% Client-Side:** No backend or database required. The entire application runs in the browser.
* **Fully Responsive:** Designed for a seamless experience on desktop, tablet, and mobile devices.


## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
* **Visualizations:** [D3.js](https://d3js.org/) and [Cytoscape.js](https://js.cytoscape.org/)
* **AI Integration:** [Google Gemini API](https://ai.google.dev/)
* **In-Browser Python:** [Pyodide](https://pyodide.org/)

---

## 🏁 Getting Started

Follow these instructions to get the project running on your local machine.

### 1. Prerequisites

You only need two things installed on your computer:
* A modern web browser (like Chrome, Firefox, or Edge).
* **Python 3**.

### 2. Configuration (❗CRITICAL STEP)

To enable the AI features, you **must** add your own Google AI API key.

1.  **Get a free API key** from **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2.  Open the file: **`js/config.js`** in the project folder.
3.  Replace the placeholder text `"YOUR_GEMINI_API_KEY_HERE"` with the key you just copied.
    ```javascript
    // Before:
    const API_KEY = "YOUR_GEMINI_API_KEY_HERE";

    // After:
    const API_KEY = "AIzaSyB...your...actual...key...here...";
    ```
4.  Save the file. The AI features will now be active.

> **⚠️ Security Warning:** Never share your API key publicly or commit the `config.js` file with your key in it to a public Git repository. If you are using Git, you should add `js/config.js` to your `.gitignore` file immediately.

### 3. Running Locally

Because the application loads files dynamically, you cannot just open `index.html` in your browser. You must serve it from a local web server.

1.  **Open your Terminal or Command Prompt.**
2.  **Navigate to the project folder.** (Tip: Type `cd ` then drag the folder onto the terminal window and press Enter).
    ```sh
    cd path/to/your/interactive-networking-tutor
    ```
3.  **Run the local server command** that you confirmed works for your system:
    ```sh
    python -m http.server
    ```
4.  **Open the application.** The terminal will show a message like `Serving HTTP on :: port 8000...`. Open your web browser and go to this address:
    [**http://localhost:8000**](http://localhost:8000)

---

## 🚀 Deployment

You can host this static application for free on several platforms.

* **GitHub Pages (Recommended):**
    1.  Push your project to a GitHub repository named `interactive-networking-tutor`.
    2.  In your repository settings, go to **Settings > Pages**.
    3.  Under "Build and deployment", select the **Source** as "Deploy from a branch".
    4.  Choose your main branch and `/ (root)` folder. Save.
    5.  Your site will be live at `https://blindsinner.github.io/interactive-networking-tutor/`.

* **Netlify / Vercel:**
    1.  Push your project to a GitHub repository.
    2.  Log in to Netlify or Vercel and connect your GitHub account.
    3.  Select your project repository. The default settings should work out of the box.
    4.  Click "Deploy".

---

## 🤝 Contributing

Contributions from the community are welcome and greatly appreciated! This project is a space for us to learn and teach networking concepts together.

Please feel free to fork the repository, make improvements, and submit a pull request.

1.  **Fork the Project:** Click the 'Fork' button at the top right of this page.
2.  **Create your Feature Branch:** `git checkout -b feature/AmazingNewLab`
3.  **Commit your Changes:** `git commit -m 'Add some AmazingNewLab'`
4.  **Push to the Branch:** `git push origin feature/AmazingNewLab`
5.  **Open a Pull Request:** [Click here to open a Pull Request](https://github.com/Blindsinner/interactive-networking-tutor/pulls)

### 💡 Areas for Contribution
* Adding new interactive lab modules.
* Improving the existing simulators.
* Enhancing accessibility features.
* Fixing bugs or typos.
* Adding more quiz questions.

---

## ⚖️ License

This project is distributed under the MIT License. See `LICENSE.txt` for more information.

*(You should create a file named `LICENSE.txt` in your project and paste the standard MIT License text into it.)*

---

<div align="center">
  <p>Created with ❤️ by <a href="https://github.com/Blindsinner">Blindsinner</a></p>
</div>
