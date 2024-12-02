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

const createFolder = async (parentFolderId, folderName) => {
    try {
        const drive = google.drive({ version: "v3", auth: oauth2Client });
        const response = await drive.files.create({
            resource: {
                name: folderName,
                mimeType: "application/vnd.google-apps.folder",
                parents: [parentFolderId], // ID of the parent folder
            },
            fields: "id, name",
        });
        console.log("Folder created:", response.data);
        return response.data.id; // Returns the folder ID
    } catch (err) {
        console.error("Error creating folder:", err.message);
        throw err;
    }
};

const uploadFileToDrive = async (folderId, filePath, fileName) => {
    try {
        const drive = google.drive({ version: "v3", auth: oauth2Client });

        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: [folderId], // Folder where the file will be uploaded
            },
            media: {
                mimeType: "image/jpeg", // Change based on file type
                body: fs.createReadStream(filePath),
            },
        });
        console.log("File uploaded:", response.data);
        return response.data;
    } catch (err) {
        console.error("Error uploading file:", err.message);
        throw err;
    } finally {
        // Clean up temporary file
        fs.unlinkSync(filePath);
    }
};

const PARENT_FOLDER_ID = process.env.DRIVE_FOLDER_ID; // Parent Google Drive Folder ID

// Route to create a folder
app.post("/create-folder", async (req, res) => {
    try {
        const folderName = req.body.name; // Get folder name from request body
        const folderId = await createFolder(PARENT_FOLDER_ID, folderName);
        res.json({ folderId, message: "Folder created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to upload a file to a folder
app.post("/upload/:folderId", upload.single("file"), async (req, res) => {
    try {
        const { folderId } = req.params; // Folder ID from URL
        const file = req.file; // Uploaded file
        const uploadedFile = await uploadFileToDrive(folderId, file.path, file.originalname);
        res.json({ uploadedFile, message: "File uploaded successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
