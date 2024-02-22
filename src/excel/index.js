import XLSX from 'xlsx';
import fs from 'fs/promises';
import fs2 from 'fs';
import path from 'path'

export async function addToExcel(obj, filePath) {
    let workbook;
    let worksheet;

    // Verifica se o arquivo já existe de maneira assíncrona
    let fileExists;
    try {
        await fs.access(filePath);
        fileExists = true;
    } catch {
        fileExists = false;
    }

    if (fileExists) {
        // Lê o arquivo existente de forma assíncrona
        const data = await fs.readFile(filePath);
        workbook = XLSX.read(data, { type: 'buffer' });
    } else {
        // Cria um novo workbook
        workbook = XLSX.utils.book_new();
    }

    // Define o nome da planilha
    const sheetName = workbook.SheetNames[0] || "Sheet1";

    if (fileExists) {
        // Usa a planilha existente se o arquivo existir
        worksheet = workbook.Sheets[sheetName];
    } else {
        // Cria uma nova planilha se o arquivo não existir
        worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    // Converte o worksheet para JSON
    const json = XLSX.utils.sheet_to_json(worksheet);

    if (Array.isArray(obj)) {
        // Adiciona cada objeto do array ao JSON
        obj.forEach(item => json.push(item));
    } else if (typeof obj === 'object' && obj !== null) {
        // Adiciona um único objeto ao JSON
        json.push(obj);
    } else {
        throw new Error("O argumento fornecido não é um objeto nem um array.");
    }

    // Converte de volta para worksheet
    worksheet = XLSX.utils.json_to_sheet(json);
    workbook.Sheets[sheetName] = worksheet;

    // Converte o workbook para um buffer
    const buffer = XLSX.write(workbook, { type: 'buffer' });

    // Escreve o buffer no arquivo de forma assíncrona
    await fs.writeFile(filePath, buffer);
}

export async function readExcelFile(path) {
    // Lendo o arquivo de forma assíncrona
    const buffer = await fs.readFile(path);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Pegando o nome da primeira planilha
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

export async function searchXLSX(folderPath) {
    try {
        const files = fs2.readdirSync(folderPath);
        for (let file of files) {
            if (path.extname(file) === '.xlsx') {
                return file;
            }
        }
    } catch (err) {
        console.error("Erro ao acessar o diretório: ", err);
    }
    return null;
}

export async function searchMultipleXLSX(folderPath) {
    try {
        const files = fs2.readdirSync(folderPath);
        const xlsxFiles = files.filter(file => path.extname(file) === '.xlsx');
        return xlsxFiles;
    } catch (err) {
        console.error("Erro ao acessar o diretório: ", err);
    }
    return [];
}