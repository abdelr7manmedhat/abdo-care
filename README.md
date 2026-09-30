# 🩺 ABDO CARE — Personal Medication Companion & Prescription Decoder

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Tech: Multimodal AI](https://img.shields.io/badge/AI-Multimodal_Vision-blue.svg)](https://deepmind.google/technologies/gemini/)
[![Audio: Web Audio API](https://img.shields.io/badge/Audio-Web_Audio_API-cyan.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![UI: Minimalist](https://img.shields.io/badge/UI-ChatGPT_Style-lightgrey.svg)](https://openai.com/chatgpt)

**ABDO CARE** is a personal digital healthcare companion designed to solve medication non-adherence and decipher complex handwritten doctor prescriptions and medical laboratory test reports.

---

## ✨ Key Features

1. **🔍 Handwritten Prescription OCR & Decoding:**
   - Upload any photo of a handwritten doctor prescription.
   - Automatically extracts trade names, active chemical ingredients, and meal-time dosing instructions.

2. **🔔 Continuous Ringing Dose Alarm:**
   - Features a continuous looping acoustic alarm chime synthesized via the Web Audio API.
   - **The alarm never stops until the patient actively confirms "I Took My Medication".**

3. **🧪 Medical Lab Test Interpretation (CBC & Biomarkers):**
   - Translates complex blood panels (CBC, HbA1c, Lipids) into plain, reassuring, human-readable language with follow-up medical guidance.

4. **💊 Medication Cabinet & Timetable Drawer:**
   - Interactive daily schedule (Morning, Afternoon, Evening) with dose check-off tracking and streak tracking.

5. **🌍 100% Bilingual Localization:**
   - Instant, seamless one-click switching between **Arabic** and **English**.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, Modern Vanilla JavaScript (ES6+), Tailwind CSS, Lucide Icons.
- **Backend / Proxy:** Node.js, Express.
- **Audio Engine:** Web Audio API (real-time synthesized clinical alarm chimes).
- **AI Orchestration:** Multimodal Vision LLMs (Google Gemini / OpenAI GPT-4o-mini).

---

## 🚀 Quick Start (Local Setup)

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/abdo-care.git

# 2. Navigate into the project folder
cd abdo-care

# 3. Install dependencies
npm install

# 4. Start the local server
npm start
```

Open your browser and navigate to:
```
http://localhost:3000
```
*(Or simply double-click `index.html` to run in standalone browser mode).*

---

## 📄 License
This project is licensed under the MIT License.
