

// Function to check if the "photoCollection" folder exists or create it
async function getOrCreatePhotoCollectionFolder(drive) {
    try {
        // Query to check if a folder named "photoCollection" exists
        const query = "mimeType = 'application/vnd.google-apps.folder' and name = 'photoCollection' and trashed = false";
        // console.log(drive);

        const res = await drive.files.list({
            q: query,
            fields: 'files(id, name)',
        });

        const folders = res.data.files;
        console.log('Found folders:', folders);

        if (folders.length > 0) {
            // If folder exists, return the ID of the first folder found
            console.log('Found photoCollection folder');
            return folders[0].id;
        } else {
            // If folder does not exist, create it
            console.log('Creating photoCollection folder');
            return await createPhotoCollectionFolder(drive);
        }
    } catch (error) {
        console.error('Error checking or creating photoCollection folder:', error);
        throw new Error('Failed to check or create folder');
    }
}

// Function to create the "photoCollection" folder if it doesn't exist
async function createPhotoCollectionFolder(drive) {
    try {
        const folderMetadata = {
            name: 'photoCollection',
            mimeType: 'application/vnd.google-apps.folder',
        };

        const folder = await drive.files.create({
            resource: folderMetadata,
            fields: 'id',
        });

        console.log('Created photoCollection folder with ID:', folder.data.id);
        return folder.data.id;
    } catch (error) {
        console.error('Error creating photoCollection folder:', error);
        throw new Error('Failed to create folder');
    }
}
async function listFilesAndFoldersInParent(drive, parentFolderId) {
    try {
        let files = [];
        let pageToken = null;

        do {
            const res = await drive.files.list({
                q: `'${parentFolderId}' in parents and trashed = false`, // Files with this parent folder ID
                fields: "nextPageToken, files(id, name, mimeType, parents)", // Specify fields to fetch
                pageToken: pageToken, // Handle pagination
            });

            files = files.concat(res.data.files);
            pageToken = res.data.nextPageToken; // Continue to next page if available
        } while (pageToken);

        console.log(`Files and folders in parent folder (${parentFolderId}):`, files);
        return files;
    } catch (error) {
        console.error('Error fetching files:', error.message);
        throw new Error('Failed to fetch files in the parent folder');
    }
}

// Function to retrieve all collection folders within "photoCollection" folder
async function getAllCollectionsInPhotoCollection(drive, parentFolderId) {
    try {
        // Helper function to list files and folders in a given parent folder
        async function listFilesAndFoldersInParent(drive, folderId) {
            const query = `'${folderId}' in parents and trashed = false`;
            const res = await drive.files.list({
                q: query,
                fields: 'files(id, name, mimeType)',
            });
            return res.data.files || [];
        }

        // Helper function to recursively fetch files and folders
        async function fetchAllFilesAndFolders(drive, folderId) {
            const items = await listFilesAndFoldersInParent(drive, folderId);
            let allItems = [...items];

            // Recursively process subfolders
            for (const item of items) {
                if (item.mimeType === 'application/vnd.google-apps.folder') {
                    const subfolderItems = await fetchAllFilesAndFolders(drive, item.id);
                    allItems = allItems.concat(subfolderItems);
                }
            }

            return allItems;
        }

        // Fetch all files and folders starting from the parent folder
        const allItems = await fetchAllFilesAndFolders(drive, parentFolderId);

        // Separate folders and files for better readability
        const folders = allItems.filter(item => item.mimeType === 'application/vnd.google-apps.folder');
        const files = allItems.filter(item => item.mimeType !== 'application/vnd.google-apps.folder');

        // console.log('Folders:', folders);
        // console.log('Files:', files);

        return { folders, files };
    } catch (error) {
        console.error('Error fetching collections:', error.message);
        throw new Error('Failed to fetch collections');
    }
}

// Function to retrieve all images inside a given collection folder
async function getImagesInCollection(drive, folderId) {
    try {
        const query = `mimeType contains 'image/' and '${folderId}' in parents and trashed = false`;
        const res = await drive.files.list({
            q: query,
            fields: 'files(id, name, mimeType)',
        });

        const images = res.data.files;
        console.log(`Found images in folder ${folderId}:`, images);
        return images;
    } catch (error) {
        console.error('Error fetching images:', error);
        throw new Error('Failed to fetch images');
    }
}

// Export functions for use in other parts of your app
module.exports = {
    getOrCreatePhotoCollectionFolder,
    createPhotoCollectionFolder,
    getAllCollectionsInPhotoCollection,
    getImagesInCollection,
};
