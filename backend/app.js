const express = require("express");
const { google } = require("googleapis");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const { getOrCreatePhotoCollectionFolder } = require("./Dao/Drive/fileManagement");
require("dotenv").config();

const app = express();

// Add COOP and COEP headers
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

app.use(cors());
app.use(bodyParser.json());

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);
// const drive = google.drive({ version: 'v3', auth: oAuth2Client });


// Endpoint to generate authentication URL
// app.get("/auth-url", (req, res) => {
//     const scopes = [
//         "https://www.googleapis.com/auth/drive.file",
//         "https://www.googleapis.com/auth/userinfo.email",
//         "https://www.googleapis.com/auth/userinfo.profile",
//     ];
//     const url = oauth2Client.generateAuthUrl({
//         access_type: "offline",
//         scope: scopes,
//     });
//     res.send({ url });
// });

// // OAuth callback to retrieve tokens
// app.get("/oauth2callback", async (req, res) => {
//     const { code } = req.query;
//     try {
//         const { tokens } = await oauth2Client.getToken(code);

//         oauth2Client.setCredentials(tokens);
//         console.log(tokens);
//         res.send({ success: true, tokens });
//     } catch (err) {
//         res.status(500).send("Authentication failed");
//     }
// });

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


app.post("/api/google-login", async (req, res) => {

    const { code } = req.body.response;
    try {
        console.log("ID Token:", code);
        // Verify the ID token
        console.log(process.env.REDIRECT_URI);

        // const { tokens } = await oauth2Client.getToken(code);
        const { tokens } = await oauth2Client.getToken({
            code,
            redirect_uri: "http://localhost:5000/api/google-login", // Ensure it matches Google Console
        });
        console.log("ID Token:", tokens);
        const ticket = await oauth2Client.verifyIdToken({
            idToken,
        });
        console.log("Ticket:", ticket);

        const payload = ticket.getPayload();
        const userId = payload.sub;
        console.log(`User ${userId} logged in.`);

        // Set OAuth2 client credentials
        oauth2Client.setCredentials({
            access_token: idToken,
        });
        const drive = google.drive({ version: "v3", auth: oauth2Client });

        // Pass authenticated client to Google Drive functions
        const folderId = await getOrCreatePhotoCollectionFolder(drive);
        res.json({ folderId });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ error: "Authentication failed." });
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
