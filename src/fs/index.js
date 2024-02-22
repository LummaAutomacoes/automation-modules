import fs from 'fs'
import fs2 from 'fs/promises'
import path from 'path'

export async function createFolder(folderPathName) {
    try {
        if (!fs.existsSync(folderPathName)) {
            fs.mkdirSync(folderPathName)
        }
    } catch (error) {
        console.log("Ocorreu um erro, contate os Administradores.")
        console.error(error.stack)
    }
}

export async function createFile(filePath, contentFile) {
    try {
        await fs2.writeFile(filePath, contentFile);
    } catch (error) {
        console.log("Ocorreu um erro, contate os Administradores.");
        console.error(error.stack);
    }
}

export async function deleteAllFilesInDirectory(directoryPath) {
    try {
        const files = await fs2.readdir(directoryPath);
        for (const file of files) {
            await fs2.unlink(path.join(directoryPath, file));
        }
    } catch (error) {
        console.error(`Erro ao deletar arquivos: ${error}`);
    }
}

export async function listAllFilesInDirectory(directoryPath) {
    try {
        fs.readdir(directoryPath, (err, files) => {
            files.forEach(file => {
                let fileDetails = fs.lstatSync(path.resolve(directoryPath, file));
                if (fileDetails.isDirectory()) {
                    console.log('Directory: ' + file);
                } else {
                    console.log('File: ' + file);
                }
            });
        });
    } catch (error) {
        console.error(`Erro ao listar arquivos: ${error}`);
    }
}

export async function findFileInFolder(folderPath, nameFile) {
    try {
        const listAll = await fs2.readdir(folderPath, { withFileTypes: true });
        // Assuming fs2 is a typo or a custom implementation. Use fs.promises for standard Node.js
        const fileInFolder = listAll.find(file => !file.isDirectory() && file.name.includes(nameFile));
        return fileInFolder; // This will return the Dirent object if found, undefined otherwise
    } catch (error) {
        console.error(error.stack);
    }
}

export async function findFolder(folderPath, nameFolder) {
    try {
        const listAll = await fs2.readdir(folderPath, { withFileTypes: true });
        // Assuming fs2 is a typo or a custom implementation. Use fs.promises for standard Node.js
        const folder = listAll.find(file => file.isDirectory() && file.name.includes(nameFolder));
        return folder; // This will return the Dirent object if found, undefined otherwise
    } catch (error) {
        console.error(error.stack);
    }
}

export async function moveFiles(sourceDir, targetDir) {
    try {

        await fs2.mkdir(targetDir, { recursive: true });

        const files = await fs2.readdir(sourceDir, { withFileTypes: true });

        for (let file of files) {
            if (file.isFile()) {
                const sourceFilePath = path.join(sourceDir, file.name);
                const targetFilePath = path.join(targetDir, file.name);

                await fs2.rename(sourceFilePath, targetFilePath);
            }
        }
    } catch (error) {
        console.error(error.stack);
    }
}