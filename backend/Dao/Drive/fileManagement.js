

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

        const parentFolderId = "1TsAemnT7vSjZaGVhVCpfzpHZRy8gghhF";
        const filesInParent = await listFilesAndFoldersInParent(drive, parentFolderId);

        console.log('Folders:');
        filesInParent
            .filter(file => file.mimeType === 'application/vnd.google-apps.folder')
            .forEach(folder => console.log(folder));

        console.log('Files:');
        filesInParent
            .filter(file => file.mimeType !== 'application/vnd.google-apps.folder')
            .forEach(file => console.log(file));
        // // const query = `mimeType = 'application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed = false`;
        // const query = `'${parentFolderId}' in parents and trashed = false`;
        // const res = await drive.files.list({
        //     q: query,
        //     fields: 'files(id, name, mimeType)', // Fetch file type for differentiation
        // });
        // console.log("jbdshajbdhsjadbh");

        // console.log("res import: ", res);

        const collections = res.data.files;
        console.log('Found collections:', collections);
        return collections;
    } catch (error) {
        console.error('Error fetching collections:', error.errors[0].message);
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
