const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS & Large Payload JSON Parsing (Supports High-Res Medical Photos)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve Static Frontend Files (index.html, style.css, app.js)
app.use(express.static(path.join(__dirname)));

// AiMicromind Flow Configuration
const AIMICROMIND_FLOW_ID = "46281994-dab4-493e-bf56-3b386f42d4d4";
const AIMICROMIND_API_URL = `https://core.aimicromind.com/api/v1/prediction/${AIMICROMIND_FLOW_ID}`;

// Backend API Proxy Endpoint to AiMicromind Flow (Supports Multimodal Vision & Images)
app.post('/api/generate', async (req, res) => {
    try {
        const { question, uploads } = req.body;
        console.log(`[Localhost API] 🚀 Forwarding request to AiMicromind (Has Image: ${Boolean(uploads && uploads.length > 0)})...`);

        const requestBody = {
            question: question || "Please review this attached medical document.",
        };

        if (uploads && uploads.length > 0) {
            requestBody.uploads = uploads;
        }

        // Forward request to AiMicromind API
        const response = await fetch(AIMICROMIND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        const outputText = data.text || data.response || (typeof data === 'string' ? data : JSON.stringify(data));

        console.log(`[Localhost API] ✅ Received response from AiMicromind successfully.`);
        return res.json({
            success: true,
            text: outputText,
            raw: data
        });
    } catch (error) {
        console.error("[Server Error] Failed to call AiMicromind:", error.message);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start Local Server
app.listen(PORT, () => {
    console.log("========================================================");
    console.log(`🚀 GrowthOS AI App is running locally on Node.js!`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`🔗 Connected to AiMicromind Flow ID: ${AIMICROMIND_FLOW_ID}`);
    console.log("========================================================");
    
    // Automatically open in default browser on Windows
    exec(`start http://localhost:${PORT}`);
});
