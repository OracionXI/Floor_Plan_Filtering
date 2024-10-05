import { readdir, writeFile } from 'fs/promises'; // Import readdir and writeFile from fs/promises
import { join } from 'path';
import { fileURLToPath } from 'url';

// Get the current directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Specify the folder path
const folderPath = join(__dirname, '../public/floorPlans'); // Replace 'images' with your folder name

// Output file path for JSON export
const outputFilePath = join(__dirname, 'imageFiles.json');

// Async function to read directory and log file names
async function logAndExportImageFiles() {
    try {
        const files = await readdir(folderPath);

        // Filter out non-image files (optional)
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));

        // Print the file names as an array
        console.log('Image files:', imageFiles);

        // Write the array to a JSON file
        await writeFile(outputFilePath, JSON.stringify(imageFiles, null, 2), 'utf-8');
        console.log(`File names saved to ${outputFilePath}`);
    } catch (err) {
        console.error('Error reading the folder or writing JSON file:', err);
    }
}

// Call the function
logAndExportImageFiles();
