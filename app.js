const express = require("express");
const { google } = require("googleapis");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Endpoint to generate authentication URL
app.get("/auth-url", (req, res) => {
    const scopes = [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
    ];
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
    });
    res.send({ url });
});

// OAuth callback to retrieve tokens
app.get("/oauth2callback", async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        res.send({ success: true, tokens });
    } catch (err) {
        res.status(500).send("Authentication failed");
    }
});

// Middleware for handling file uploads
const upload = multer({ dest: "uploads/" });

// Upload file to Google Drive
app.post("/upload", upload.single("file"), async (req, res) => {
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    try {
        const fileMetadata = {
            name: req.file.originalname,
            parents: [process.env.DRIVE_FOLDER_ID], // Replace with your folder ID
        };
        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path),
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media,
            fields: "id",
        });

        // Cleanup uploaded file
        fs.unlinkSync(req.file.path);

        res.send({ success: true, fileId: file.data.id });
    } catch (err) {
        res.status(500).send("Error uploading file");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
